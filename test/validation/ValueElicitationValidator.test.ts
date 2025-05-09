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

describe('ValueElicitationValidationProvider tests', () => {
  test('accept one priority', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        Value TestValue {
          Stakeholder TestStakeholder {
            priority = HIGH
          }
        }
      }
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple priorities', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        Value TestValue {
          Stakeholder TestStakeholder {
            priority = HIGH
            priority = HIGH
          }
        }
      }
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(4)
  })

  test('accept one impact', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        Value TestValue {
          Stakeholder TestStakeholder {
            impact HIGH
          }
        }
      }
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple impacts', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        Value TestValue {
          Stakeholder TestStakeholder {
            impact HIGH
            impact HIGH
          }
        }
      }
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(4)
  })

  test('report multiple impacts', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        Value TestValue {
          Stakeholder TestStakeholder {
            impact HIGH
            impact HIGH
          }
        }
      }
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(4)
  })

  test('report one consequences', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        Value TestValue {
          Stakeholder TestStakeholder {
            consequences
              good "conseq"
              bad "conseq"
          }
        }
      }
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple impacts', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        Value TestValue {
          Stakeholder TestStakeholder {
            consequences
              good "conseq"
              bad "conseq"
            consequences
              neutral "conseq"
          }
        }
      }
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(4)
  })
})
