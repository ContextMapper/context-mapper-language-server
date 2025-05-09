import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { Aggregate, ContextMappingModel } from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'
import { parseValidInput } from '../../ParsingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(() => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

describe('Aggregate parsing tests', () => {
  test('parse aggregate without body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        Aggregate TestAggregate
      }
    `)

    expect(document.parseResult.value.boundedContexts).toHaveLength(1)
    expect(document.parseResult.value.boundedContexts[0].aggregates).toHaveLength(1)
    const aggregate = document.parseResult.value.boundedContexts[0].aggregates[0]
    expectAggregateToBeEmpty(aggregate)
  })

  test('parse aggregate with empty body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        Aggregate TestAggregate {
        }
      }
    `)

    expect(document.parseResult.value.boundedContexts).toHaveLength(1)
    expect(document.parseResult.value.boundedContexts[0].aggregates).toHaveLength(1)
    const aggregate = document.parseResult.value.boundedContexts[0].aggregates[0]
    expectAggregateToBeEmpty(aggregate)
  })

  test('parse aggregate with full body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        Aggregate TestAggregate {
          responsibilities "resp1", "resp2"
          owner = TestContext
          useCases TestUseCase
          knowledgeLevel = META
          contentVolatility = RARELY
          likelihoodForChange = NORMAL
          availabilityCriticality = HIGH
          consistencyCriticality = HIGH
          securityZone "testZone"
          securityCriticality = LOW
          securityAccessGroup = "testGroup"
          storageSimilarity = TINY
        }
      }
      UseCase TestUseCase
    `)

    expect(document.parseResult.value.boundedContexts).toHaveLength(1)
    expect(document.parseResult.value.boundedContexts[0].aggregates).toHaveLength(1)
    const aggregate = document.parseResult.value.boundedContexts[0].aggregates[0]
    expect(aggregate.name).toEqual('TestAggregate')
    expect(aggregate.responsibilities).toHaveLength(2)
    expect(aggregate.responsibilities[0]).toEqual('resp1')
    expect(aggregate.responsibilities[1]).toEqual('resp2')
    expect(aggregate.owner).toHaveLength(1)
    expect(aggregate.userRequirements).toHaveLength(0)
    expect(aggregate.userStories).toHaveLength(0)
    expect(aggregate.useCases).toHaveLength(1)
    expect(aggregate.knowledgeLevel).toEqual(['META'])
    expect(aggregate.contentVolatility).toEqual(['RARELY'])
    expect(aggregate.likelihoodForChange).toEqual(['NORMAL'])
    expect(aggregate.availabilityCriticality).toEqual(['HIGH'])
    expect(aggregate.consistencyCriticality).toEqual(['HIGH'])
    expect(aggregate.securityZone).toEqual(['testZone'])
    expect(aggregate.securityCriticality).toEqual(['LOW'])
    expect(aggregate.securityAccessGroup).toEqual(['testGroup'])
    expect(aggregate.storageSimilarity).toEqual(['TINY'])
  })

  test('parse likelihood variation', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        Aggregate TestAggregate {
          structuralVolatility = NORMAL
        }
      }
    `)

    expect(document.parseResult.value.boundedContexts).toHaveLength(1)
    expect(document.parseResult.value.boundedContexts[0].aggregates).toHaveLength(1)
    expect(document.parseResult.value.boundedContexts[0].aggregates[0].likelihoodForChange).toEqual(['NORMAL'])
  })

  test('parse userStory', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        Aggregate TestAggregate {
          userStories TestStory
        }
      }
      UserStory TestStory
    `)

    expect(document.parseResult.value.boundedContexts).toHaveLength(1)
    expect(document.parseResult.value.boundedContexts[0].aggregates).toHaveLength(1)
    const aggregate = document.parseResult.value.boundedContexts[0].aggregates[0]
    expect(aggregate.userStories).toHaveLength(1)
    expect(aggregate.userRequirements).toHaveLength(0)
    expect(aggregate.useCases).toHaveLength(0)
  })

  test('parse features', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        Aggregate TestAggregate {
          features TestStory, TestUseCase
        }
      }
      UserStory TestStory
      UseCase TestUseCase
    `)

    expect(document.parseResult.value.boundedContexts).toHaveLength(1)
    expect(document.parseResult.value.boundedContexts[0].aggregates).toHaveLength(1)
    const aggregate = document.parseResult.value.boundedContexts[0].aggregates[0]
    expect(aggregate.userStories).toHaveLength(0)
    expect(aggregate.userRequirements).toHaveLength(2)
    expect(aggregate.useCases).toHaveLength(0)
  })

  test('parse userRequirements', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        Aggregate TestAggregate {
          userRequirements TestStory, TestUseCase
        }
      }
      UserStory TestStory
      UseCase TestUseCase
    `)

    expect(document.parseResult.value.boundedContexts).toHaveLength(1)
    expect(document.parseResult.value.boundedContexts[0].aggregates).toHaveLength(1)
    expect(document.parseResult.value.boundedContexts[0].aggregates[0].userRequirements).toHaveLength(2)
  })
})

function expectAggregateToBeEmpty (aggregate: Aggregate) {
  expect(aggregate).not.toBeUndefined()
  expect(aggregate.name).toEqual('TestAggregate')
  expect(aggregate.responsibilities).toHaveLength(0)
  expect(aggregate.userRequirements).toHaveLength(0)
  expect(aggregate.useCases).toHaveLength(0)
  expect(aggregate.userStories).toHaveLength(0)
  expect(aggregate.owner).toHaveLength(0)
  expect(aggregate.knowledgeLevel).toHaveLength(0)
  expect(aggregate.likelihoodForChange).toHaveLength(0)
  expect(aggregate.contentVolatility).toHaveLength(0)
  expect(aggregate.availabilityCriticality).toHaveLength(0)
  expect(aggregate.consistencyCriticality).toHaveLength(0)
  expect(aggregate.storageSimilarity).toHaveLength(0)
  expect(aggregate.securityCriticality).toHaveLength(0)
  expect(aggregate.securityZone).toHaveLength(0)
  expect(aggregate.securityAccessGroup).toHaveLength(0)
}
