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

describe('ValueEpicValidationProvider tests', () => {
  test('report missing reduction of', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        ValueEpic TestEpic {
          As a TestStakeholder I value "val" as demonstrated in
          realization of "TestRealization"
        }
      }
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })

  test('report missing realization of', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        ValueEpic TestEpic {
          As a TestStakeholder I value "val" as demonstrated in
          reduction of "reduc"
        }
      }
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })

  test('report missing realization & reduction of', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        ValueEpic TestEpic {
          As a TestStakeholder I value "val" as demonstrated in
        }
      }
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)

    expect(document.diagnostics).toHaveLength(2)
  })

  test('accept epic with realization & reduction', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        ValueEpic TestEpic {
          As a TestStakeholder I value "val" as demonstrated in
          reduction of "reduc"
          realization of "real"
        }
      }
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })
})
