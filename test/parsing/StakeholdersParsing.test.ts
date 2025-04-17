import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel, Stakeholder, StakeholderGroup, Stakeholders } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'
import { parseValidInput } from './ParsingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

describe('Stakeholders parsing tests', () => {
  test('parse stakeholders without body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders
   `)

    expect(document.parseResult.value.stakeholders).toHaveLength(1)
    const stakeholders = document.parseResult.value.stakeholders[0]
    expectEmptyStakeholders(stakeholders)
  })

  test('parse stakeholders with empty body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
      }
    `)

    expect(document.parseResult.value.stakeholders).toHaveLength(1)
    const stakeholders = document.parseResult.value.stakeholders[0]
    expectEmptyStakeholders(stakeholders)
  })

  test('parse stakeholders with full body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext
      
      Stakeholders of TestContext {
        StakeholderGroup TestGroup
        Stakeholder TestStakeholder
      }
    `)

    expect(document.parseResult.value.stakeholders).toHaveLength(1)
    const stakeholders = document.parseResult.value.stakeholders[0]
    expect(stakeholders).not.toBeUndefined()
    expect(stakeholders.contexts).toHaveLength(1)
    expect(stakeholders.stakeholders).toHaveLength(2)
  })

  test('parse stakeholder group without body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        StakeholderGroup TestGroup
      }
    `)

    expect(document.parseResult.value.stakeholders).toHaveLength(1)
    expect(document.parseResult.value.stakeholders[0].stakeholders).toHaveLength(1)
    const group = document.parseResult.value.stakeholders[0].stakeholders[0] as StakeholderGroup
    expectEmptyStakeholderGroup(group)
  })

  test('parse stakeholder group with empty body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        StakeholderGroup TestGroup {
        }
      }
    `)

    expect(document.parseResult.value.stakeholders).toHaveLength(1)
    expect(document.parseResult.value.stakeholders[0].stakeholders).toHaveLength(1)
    const group = document.parseResult.value.stakeholders[0].stakeholders[0] as StakeholderGroup
    expectEmptyStakeholderGroup(group)
  })

  test('parse stakeholder group with full body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        StakeholderGroup TestGroup {
          Stakeholder TestStakeholder
        }
      }
    `)

    expect(document.parseResult.value.stakeholders).toHaveLength(1)
    expect(document.parseResult.value.stakeholders[0].stakeholders).toHaveLength(1)
    const group = document.parseResult.value.stakeholders[0].stakeholders[0] as StakeholderGroup
    expect(group).not.toBeUndefined()
    expect(group.name).toEqual('TestGroup')
    expect(group.stakeholders).toHaveLength(1)
  })

  test('parse stakeholder without body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)

    expect(document.parseResult.value.stakeholders).toHaveLength(1)
    expect(document.parseResult.value.stakeholders[0].stakeholders).toHaveLength(1)
    const stakeholder = document.parseResult.value.stakeholders[0].stakeholders[0] as Stakeholder
    expectEmptyStakeholder(stakeholder)
  })

  test('parse stakeholder with empty body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder {
        }
      }
    `)

    expect(document.parseResult.value.stakeholders).toHaveLength(1)
    expect(document.parseResult.value.stakeholders[0].stakeholders).toHaveLength(1)
    const stakeholder = document.parseResult.value.stakeholders[0].stakeholders[0] as Stakeholder
    expectEmptyStakeholder(stakeholder)
  })

  test('parse stakeholder with full body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder {
          interest = HIGH
          influence MEDIUM
          description = "description"
        }
      }
    `)

    expect(document.parseResult.value.stakeholders).toHaveLength(1)
    expect(document.parseResult.value.stakeholders[0].stakeholders).toHaveLength(1)
    const stakeholder = document.parseResult.value.stakeholders[0].stakeholders[0] as Stakeholder
    expect(stakeholder.name).toEqual('TestStakeholder')
    expect(stakeholder.interest).toEqual('HIGH')
    expect(stakeholder.influence).toEqual('MEDIUM')
    expect(stakeholder.description).toEqual('description')
  })
})

function expectEmptyStakeholders (stakeholders: Stakeholders) {
  expect(stakeholders).not.toBeUndefined()
  expect(stakeholders.contexts).toHaveLength(0)
  expect(stakeholders.stakeholders).toHaveLength(0)
}

function expectEmptyStakeholderGroup (group: StakeholderGroup): void {
  expect(group).not.toBeUndefined()
  expect(group.$type).toEqual('StakeholderGroup')
  expect(group.name).toEqual('TestGroup')
  expect(group.stakeholders).toHaveLength(0)
}

function expectEmptyStakeholder (stakeholder: Stakeholder): void {
  expect(stakeholder).not.toBeUndefined()
  expect(stakeholder.name).toEqual('TestStakeholder')
  expect(stakeholder.influence).toBeUndefined()
  expect(stakeholder.interest).toBeUndefined()
  expect(stakeholder.description).toBeUndefined()
}
