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

describe('Stakeholder linking tests', () => {
  test('check linking of stakeholder in value elicitation', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestValue {
          Stakeholder TestStakeholder
        }
      }
    `)

    const value = document.parseResult.value.valueRegisters[0].values[0]
    expect(value.elicitations).toHaveLength(1)
    expect(value.elicitations[0].stakeholder).not.toBeUndefined()
    expect(value.elicitations[0].stakeholder.ref).not.toBeUndefined()
    expect(value.elicitations[0].stakeholder.ref?.name).toEqual('TestStakeholder')
  })

  test('check linking of stakeholder in value epic', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        ValueEpic TestEpic {
          As a TestStakeholder I value "test" as demonstrated in realization of "realized"
        }
      }
    `)

    const valueEpic = document.parseResult.value.valueRegisters[0].valueEpics[0]
    expect(valueEpic.stakeholder).not.toBeUndefined()
    expect(valueEpic.stakeholder?.ref).not.toBeUndefined()
    expect(valueEpic.stakeholder?.ref?.name).toEqual('TestStakeholder')
  })

  test('check linking of stakeholder in value weighting', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        ValueWeighting TestWeighting {
          In the context of the SOI,
          stakeholder TestStakeholder values "val1" more than "val2"
          expecting benefits such as "benefits"
          running the risk of harms such as "harms"
        }
      }
    `)

    const valueWeighting = document.parseResult.value.valueRegisters[0].valueWeightings[0]
    expect(valueWeighting.stakeholder).not.toBeUndefined()
    expect(valueWeighting.stakeholder.ref).not.toBeUndefined()
    expect(valueWeighting.stakeholder.ref?.name).toEqual('TestStakeholder')
  })

  test('check linking of stakeholder group in value elicitation', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        StakeholderGroup TestStakeholderGroup
      }
      ValueRegister TestRegister {
        Value TestValue {
          Stakeholder TestStakeholderGroup
        }
      }
    `)

    const value = document.parseResult.value.valueRegisters[0].values[0]
    expect(value.elicitations).toHaveLength(1)
    expect(value.elicitations[0].stakeholder).not.toBeUndefined()
    expect(value.elicitations[0].stakeholder.ref).not.toBeUndefined()
    expect(value.elicitations[0].stakeholder.ref?.name).toEqual('TestStakeholderGroup')
  })

  test('check linking of stakeholder group stakeholder in value elicitation', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        StakeholderGroup TestStakeholderGroup {
          Stakeholder TestStakeholder
        }
      }
      ValueRegister TestRegister {
        Value TestValue {
          Stakeholder TestStakeholder
        }
      }
    `)

    const value = document.parseResult.value.valueRegisters[0].values[0]
    expect(value.elicitations).toHaveLength(1)
    expect(value.elicitations[0].stakeholder).not.toBeUndefined()
    expect(value.elicitations[0].stakeholder.ref).not.toBeUndefined()
    expect(value.elicitations[0].stakeholder.ref?.name).toEqual('TestStakeholder')
  })
})
