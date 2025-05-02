import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import {
  ContextMappingModel,
  Value,
  ValueElicitation,
  ValueEpic,
  ValueRegister
} from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'
import { parseInvalidInput, parseValidInput } from '../../ParsingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

describe('Value register parsing tests', () => {
  test('parse value register without body', async () => {
    document = await parseValidInput(parse, `
      ValueRegister TestRegister
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    const valueRegister = document.parseResult.value.valueRegisters[0]
    expectEmptyValueRegister(valueRegister)
  })

  test('parse value register with empty body', async () => {
    document = await parseValidInput(parse, `
      ValueRegister TestRegister {
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    const valueRegister = document.parseResult.value.valueRegisters[0]
    expectEmptyValueRegister(valueRegister)
  })

  test('parse value register with full body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister for TestContext {
        ValueCluster TestCluster
        ValueNarrative TestNarrative {
          When the SOI executes "feature",
          stakeholders expect it to promote, protect or create "promoValue",
          possibly degrading or prohibiting "harmValue"
          with the following externally observable and/or internally auditable behavior: "conditions"
        }
        Value TestValue
        ValueEpic TestEpic
        ValueWeighting TestWeighting {
          In the context of the SOI,
          stakeholder TestStakeholder values "val1" more than "val2"
          expecting benefits such as "benefit"
          running the risk of harms such as "harm"
        }
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    const valueRegister = document.parseResult.value.valueRegisters[0]
    expect(valueRegister.name).toEqual('TestRegister')
    expect(valueRegister.context).not.toBeUndefined()
    expect(valueRegister.valueClusters).toHaveLength(1)
    expect(valueRegister.values).toHaveLength(1)
    expect(valueRegister.valueEpics).toHaveLength(1)
    expect(valueRegister.valueNarratives).toHaveLength(1)
    expect(valueRegister.valueWeightings).toHaveLength(1)
  })

  test('parse value cluster without body', async () => {
    document = await parseValidInput(parse, `
      ValueRegister TestRegister {
        ValueCluster TestCluster
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].valueClusters).toHaveLength(1)
    const valueCluster = document.parseResult.value.valueRegisters[0].valueClusters[0]
    expect(valueCluster).not.toBeUndefined()
    expect(valueCluster.name).toEqual('TestCluster')
    expect(valueCluster.coreValue).toBeUndefined()
    expect(valueCluster.coreValue7000).toBeUndefined()
    expect(valueCluster.demonstrators).toHaveLength(0)
    expect(valueCluster.relatedValues).toHaveLength(0)
    expect(valueCluster.opposingValues).toHaveLength(0)
    expect(valueCluster.values).toHaveLength(0)
    expect(valueCluster.elicitations).toHaveLength(0)
  })

  test('parse value cluster with invalid empty body', async () => {
    await parseInvalidInput(parse, `
      ValueRegister TestRegister {
        ValueCluster TestCluster {
        }
      }
    `)
  })

  test('parse value cluster with minimal body', async () => {
    document = await parseValidInput(parse, `
      ValueRegister TestRegister {
        ValueCluster TestCluster {
          core AUTONOMY
        }
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].valueClusters).toHaveLength(1)
    const valueCluster = document.parseResult.value.valueRegisters[0].valueClusters[0]
    expect(valueCluster).not.toBeUndefined()
    expect(valueCluster.name).toEqual('TestCluster')
    expect(valueCluster.coreValue).toBeUndefined()
    expect(valueCluster.coreValue7000).toEqual('AUTONOMY')
  })

  test('parse value cluster with full body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        ValueCluster TestCluster {
          core "testCore"
          relatedValue = "relVal"
          demonstrator = "dem"
          opposingValue "oppo"
          
          Stakeholder TestStakeholder
          Value TestValue
        }
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].valueClusters).toHaveLength(1)
    const valueCluster = document.parseResult.value.valueRegisters[0].valueClusters[0]
    expect(valueCluster.name).toEqual('TestCluster')
    expect(valueCluster.coreValue).toEqual('testCore')
    expect(valueCluster.coreValue7000).toBeUndefined()
    expect(valueCluster.relatedValues).toHaveLength(1)
    expect(valueCluster.relatedValues[0]).toEqual('relVal')
    expect(valueCluster.demonstrators).toHaveLength(1)
    expect(valueCluster.demonstrators[0]).toEqual('dem')
    expect(valueCluster.opposingValues).toHaveLength(1)
    expect(valueCluster.opposingValues[0]).toEqual('oppo')
    expect(valueCluster.elicitations).toHaveLength(1)
    expect(valueCluster.values).toHaveLength(1)
  })

  test('parse value without body', async () => {
    document = await parseValidInput(parse, `
      ValueRegister TestRegister {
        Value TestValue
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values).toHaveLength(1)
    const value = document.parseResult.value.valueRegisters[0].values[0]
    expectEmptyValue(value)
  })

  test('parse value with empty body', async () => {
    document = await parseValidInput(parse, `
      ValueRegister TestRegister {
        Value TestValue {
        }
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values).toHaveLength(1)
    const value = document.parseResult.value.valueRegisters[0].values[0]
    expectEmptyValue(value)
  })

  test('parse value with full body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestValue {
          relatedValue = "relVal"
          isCore
          opposingValue "oppo"
          demonstrator = "dem"
          
          Stakeholder TestStakeholder
        }
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values).toHaveLength(1)
    const value = document.parseResult.value.valueRegisters[0].values[0]
    expect(value.name).toEqual('TestValue')
    expect(value.coreValue).toHaveLength(1)
    expect(value.demonstrators).toHaveLength(1)
    expect(value.demonstrators[0]).toEqual('dem')
    expect(value.relatedValues).toHaveLength(1)
    expect(value.relatedValues[0]).toEqual('relVal')
    expect(value.opposingValues).toHaveLength(1)
    expect(value.elicitations).toHaveLength(1)
  })

  test('parse value epic without body', async () => {
    document = await parseValidInput(parse, `
      ValueRegister TestRegister {
        ValueEpic TestEpic
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].valueEpics).toHaveLength(1)
    const epic = document.parseResult.value.valueRegisters[0].valueEpics[0]
    expectEmptyEpic(epic)
  })

  test('parse value epic with invalid empty body', async () => {
    await parseInvalidInput(parse, `
      ValueRegister TestRegister {
        ValueEpic TestEpic {
        }
      }
    `)
  })

  test('parse value epic with full body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        ValueEpic TestEpic {
          As a TestStakeholder I value "val" as demonstrated in
          reduction of "redVal1"
          reduction of "redVal2"
          realization of "relVal1"
        }
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].valueEpics).toHaveLength(1)
    const epic = document.parseResult.value.valueRegisters[0].valueEpics[0]
    expect(epic.name).toEqual('TestEpic')
    expect(epic.stakeholder).not.toBeUndefined()
    expect(epic.value).toEqual('val')
    expect(epic.realizedValues).toHaveLength(1)
    expect(epic.realizedValues[0]).toEqual('relVal1')
    expect(epic.reducedValues).toHaveLength(2)
    expect(epic.reducedValues[0]).toEqual('redVal1')
    expect(epic.reducedValues[1]).toEqual('redVal2')
  })

  test('parse value narrative', async () => {
    document = await parseValidInput(parse, `
      ValueRegister TestRegister {
        ValueNarrative TestNarrative {
          When the SOI executes "feat",
          stakeholders expect it to promote, protect or create "promoValue",
          possibly degrading or prohibiting "harmValue"
          with the following externally observable and/or internally auditable behavior: "conditions"
        }
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].valueNarratives).toHaveLength(1)
    const narrative = document.parseResult.value.valueRegisters[0].valueNarratives[0]
    expect(narrative).not.toBeUndefined()
    expect(narrative.name).toEqual('TestNarrative')
    expect(narrative.feature).toEqual('feat')
    expect(narrative.promotedValues).toEqual('promoValue')
    expect(narrative.harmedValues).toEqual('harmValue')
    expect(narrative.preAndPostConditions).toEqual('conditions')
  })

  test('parse value weighting', async () => {
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

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].valueWeightings).toHaveLength(1)
    const weighting = document.parseResult.value.valueRegisters[0].valueWeightings[0]
    expect(weighting).not.toBeUndefined()
    expect(weighting.name).toEqual('TestWeighting')
    expect(weighting.stakeholder).not.toBeUndefined()
    expect(weighting.value1).toEqual('val1')
    expect(weighting.value2).toEqual('val2')
    expect(weighting.benefits).toEqual('benefits')
    expect(weighting.harms).toEqual('harms')
  })

  test('parse value elicitation without body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestVal {
          Stakeholder TestStakeholder
        }
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values[0].elicitations).toHaveLength(1)
    const elicitation = document.parseResult.value.valueRegisters[0].values[0].elicitations[0]
    expectEmptyValueElicitation(elicitation)
  })

  test('parse value elicitation with empty body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestVal {
          Stakeholder TestStakeholder {
          }
        }
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values[0].elicitations).toHaveLength(1)
    const elicitation = document.parseResult.value.valueRegisters[0].values[0].elicitations[0]
    expectEmptyValueElicitation(elicitation)
  })

  test('parse value elicitation with full body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestVal {
          Stakeholder TestStakeholder {
            impact = MEDIUM
            consequences good "conseq"
            priority = LOW
          }
        }
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values[0].elicitations).toHaveLength(1)
    const elicitation = document.parseResult.value.valueRegisters[0].values[0].elicitations[0]
    expect(elicitation.stakeholder).not.toBeUndefined()
    expect(elicitation.priority).toEqual(['LOW'])
    expect(elicitation.impact).toEqual(['MEDIUM'])
    expect(elicitation.consequences).toHaveLength(1)
  })

  test('parse consequence without action', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestVal {
          Stakeholder TestStakeholder {
            consequences good "conseq"
          }
        }
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values[0].elicitations).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values[0].elicitations[0].consequences).toHaveLength(1)
    const consequence = document.parseResult.value.valueRegisters[0].values[0].elicitations[0].consequences[0]
    expect(consequence.type).toEqual('good')
    expect(consequence.consequence).toEqual('conseq')
    expect(consequence.action).toBeUndefined()
  })

  test('parse consequence with action', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestVal {
          Stakeholder TestStakeholder {
            consequences good "conseq" action "act" "typ"
          }
        }
      }
    `)

    expect(document.parseResult.value.valueRegisters).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values[0].elicitations).toHaveLength(1)
    expect(document.parseResult.value.valueRegisters[0].values[0].elicitations[0].consequences).toHaveLength(1)
    const consequence = document.parseResult.value.valueRegisters[0].values[0].elicitations[0].consequences[0]
    expect(consequence).not.toBeUndefined()
    const action = consequence.action
    expect(action?.action).toEqual('act')
    expect(action?.type).toEqual('typ')
  })
})

function expectEmptyValueRegister (valueRegister: ValueRegister) {
  expect(valueRegister).not.toBeUndefined()
  expect(valueRegister.name).toEqual('TestRegister')
  expect(valueRegister.context).toBeUndefined()
  expect(valueRegister.valueClusters).toHaveLength(0)
  expect(valueRegister.values).toHaveLength(0)
  expect(valueRegister.valueEpics).toHaveLength(0)
  expect(valueRegister.valueNarratives).toHaveLength(0)
  expect(valueRegister.valueWeightings).toHaveLength(0)
}

function expectEmptyValue (value: Value) {
  expect(value).not.toBeUndefined()
  expect(value.name).toEqual('TestValue')
  expect(value.coreValue).toHaveLength(0)
  expect(value.demonstrators).toHaveLength(0)
  expect(value.relatedValues).toHaveLength(0)
  expect(value.opposingValues).toHaveLength(0)
  expect(value.elicitations).toHaveLength(0)
}

function expectEmptyEpic (epic: ValueEpic) {
  expect(epic).not.toBeUndefined()
  expect(epic.name).toEqual('TestEpic')
  expect(epic.stakeholder).toBeUndefined()
  expect(epic.value).toBeUndefined()
  expect(epic.realizedValues).toHaveLength(0)
  expect(epic.reducedValues).toHaveLength(0)
}

function expectEmptyValueElicitation (elicitation: ValueElicitation) {
  expect(elicitation).not.toBeUndefined()
  expect(elicitation.stakeholder).not.toBeUndefined()
  expect(elicitation.priority).toHaveLength(0)
  expect(elicitation.impact).toHaveLength(0)
  expect(elicitation.consequences).toHaveLength(0)
}
