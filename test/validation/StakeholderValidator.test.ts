import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(() => {
  services = createContextMapperDslServices(EmptyFileSystem)
  const doParse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  parse = (input: string) => doParse(input, { validation: true })
})

describe('StakeholderValidationProvider tests', () => {
  test('accept one influence', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder {
          influence HIGH
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple influences', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder {
          influence HIGH
          influence HIGH
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one interest', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder {
          interest HIGH
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple interests', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder {
          interest HIGH
          interest HIGH
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one description', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder {
          description "Test Description"
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple descriptions', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder {
          description "Test Description"
          description "Test Description"
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })
})
