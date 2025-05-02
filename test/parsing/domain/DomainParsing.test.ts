import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'
import { parseValidInput } from '../../ParsingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

describe('Domain parsing tests', () => {
  test('parse domain without body', async () => {
    document = await parseValidInput(parse, `
        Domain TestDomain
    `)

    expect(document.parseResult.value.domains).toHaveLength(1)
    const domain = document.parseResult.value.domains[0]
    expect(domain).not.toBeUndefined()
    expect(domain.name).toEqual('TestDomain')
    expect(domain.domainVisionStatement).toBeUndefined()
    expect(domain.subdomains).toHaveLength(0)
  })

  test('parse domain with empty body', async () => {
    document = await parseValidInput(parse, `
        Domain TestDomain {
        }
    `)

    expect(document.parseResult.value.domains).toHaveLength(1)
    const domain = document.parseResult.value.domains[0]
    expect(domain).not.toBeUndefined()
    expect(domain.name).toEqual('TestDomain')
    expect(domain.domainVisionStatement).toBeUndefined()
    expect(domain.subdomains).toHaveLength(0)
  })

  test('parse domain with full body', async () => {
    document = await parseValidInput(parse, `
        Domain TestDomain {
          domainVisionStatement = "vision"
          Subdomain FirstSubdomain
          Subdomain SecondSubdomain
        }
    `)

    expect(document.parseResult.value.domains).toHaveLength(1)
    const domain = document.parseResult.value.domains[0]
    expect(domain).not.toBeUndefined()
    expect(domain.name).toEqual('TestDomain')
    expect(domain.domainVisionStatement).toEqual('vision')
    expect(domain.subdomains).toHaveLength(2)
  })

  test('parse subdomain', async () => {
    document = await parseValidInput(parse, `
        Domain TestDomain {
          Subdomain TestSubdomain
            supports TestUseCase 
          {
            domainVisionStatement "vision"
            type = CORE_DOMAIN
          }
        }
        UseCase TestUseCase
    `)

    expect(document.parseResult.value.domains).toHaveLength(1)
    expect(document.parseResult.value.domains[0].subdomains).toHaveLength(1)
    const subdomain = document.parseResult.value.domains[0].subdomains[0]
    expect(subdomain).not.toBeUndefined()
    expect(subdomain.name).toEqual('TestSubdomain')
    expect(subdomain.supportedFeatures).toHaveLength(1)
    expect(subdomain.type).toEqual(['CORE_DOMAIN'])
    expect(subdomain.domainVisionStatement).toEqual(['vision'])
  })
})
