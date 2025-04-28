import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { parseValidInput } from '../ParsingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

afterEach(async () => {
  document && await clearDocuments(services.shared, [document])
})

describe('Domain linking tests', () => {
  test('check linking of bounded context implementation with domain', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext implements TestDomain
      Domain TestDomain
    `)

    const boundedContext = document.parseResult.value.boundedContexts[0]
    expect(boundedContext.implementedDomainParts).toHaveLength(1)
    expect(boundedContext.implementedDomainParts[0]).not.toBeUndefined()
    expect(boundedContext.implementedDomainParts[0].ref).not.toBeUndefined()
    expect(boundedContext.implementedDomainParts[0].ref?.name).toEqual('TestDomain')
  })

  test('check linking of bounded context implementation with subdomain', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext implements TestSubdomain
      Domain TestDomain {
        Subdomain TestSubdomain
      }
    `)

    const boundedContext = document.parseResult.value.boundedContexts[0]
    expect(boundedContext.implementedDomainParts).toHaveLength(1)
    expect(boundedContext.implementedDomainParts[0]).not.toBeUndefined()
    expect(boundedContext.implementedDomainParts[0].ref).not.toBeUndefined()
    expect(boundedContext.implementedDomainParts[0].ref?.name).toEqual('TestSubdomain')
  })

  test('check linking of bounded context implementation with domain & subdomain', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext implements TestSubdomain, AnotherDomain
      Domain TestDomain {
        Subdomain TestSubdomain
      }
      Domain AnotherDomain
    `)

    const boundedContext = document.parseResult.value.boundedContexts[0]
    expect(boundedContext.implementedDomainParts).toHaveLength(2)
    expect(boundedContext.implementedDomainParts[0]).not.toBeUndefined()
    expect(boundedContext.implementedDomainParts[0].ref).not.toBeUndefined()
    expect(boundedContext.implementedDomainParts[0].ref?.name).toEqual('TestSubdomain')
    expect(boundedContext.implementedDomainParts[1]).not.toBeUndefined()
    expect(boundedContext.implementedDomainParts[1].ref).not.toBeUndefined()
    expect(boundedContext.implementedDomainParts[1].ref?.name).toEqual('AnotherDomain')
  })
})
