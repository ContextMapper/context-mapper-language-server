import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  const doParse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  parse = (input: string) => doParse(input, { validation: true })
})

describe('SubDomainValidationProvider tests', () => {
  test('accept one type', async () => {
    document = await parse(`
      Domain TestDomain {
        Subdomain TestSubdomain {
          type UNDEFINED
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple types', async () => {
    document = await parse(`
      Domain TestDomain {
        Subdomain TestSubdomain {
          type UNDEFINED
          type CORE_DOMAIN
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one domainVisionStatement', async () => {
    document = await parse(`
      Domain TestDomain {
        Subdomain TestSubdomain {
          domainVisionStatement "Test Vision Statement"
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple domainVisionStatements', async () => {
    document = await parse(`
      Domain TestDomain {
        Subdomain TestSubdomain {
          domainVisionStatement "Test Vision Statement"
          domainVisionStatement "Test Vision Statement"
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })
})
