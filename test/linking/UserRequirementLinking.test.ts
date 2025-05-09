import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel, UserStory } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { parseValidInput } from '../ParsingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(() => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

afterEach(async () => {
  if (document) await clearDocuments(services.shared, [document])
})

describe('User requirement linking tests', () => {
  test('check linking of user requirement in subdomain', async () => {
    document = await parseValidInput(parse, `
      Domain TestDomain {
        Subdomain TestSubdomain  supports TestUseCase, TestUserStory
      }
      UserStory TestUserStory
      UseCase TestUseCase
    `)

    const subdomain = document.parseResult.value.domains[0].subdomains[0]
    expect(subdomain.supportedFeatures).toHaveLength(2)
    expect(subdomain.supportedFeatures[0]).not.toBeUndefined()
    expect(subdomain.supportedFeatures[0].ref).not.toBeUndefined()
    expect(subdomain.supportedFeatures[0].ref?.name).toEqual('TestUseCase')
    expect(subdomain.supportedFeatures[1]).not.toBeUndefined()
    expect(subdomain.supportedFeatures[1].ref).not.toBeUndefined()
    expect(subdomain.supportedFeatures[1].ref?.name).toEqual('TestUserStory')
  })

  test('check linking of user requirement in aggregate', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        Aggregate TestAggregate {
         features = TestUseCase, TestUserStory
        }
      }
      UserStory TestUserStory
      UseCase TestUseCase
    `)

    const aggregate = document.parseResult.value.boundedContexts[0].aggregates[0]
    expect(aggregate.userRequirements).toHaveLength(2)
    expect(aggregate.userRequirements[0]).not.toBeUndefined()
    expect(aggregate.userRequirements[0].ref).not.toBeUndefined()
    expect(aggregate.userRequirements[0].ref?.name).toEqual('TestUseCase')
    expect(aggregate.userRequirements[1]).not.toBeUndefined()
    expect(aggregate.userRequirements[1].ref).not.toBeUndefined()
    expect(aggregate.userRequirements[1].ref?.name).toEqual('TestUserStory')
  })

  test('check linking of use case in aggregate', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        Aggregate TestAggregate {
         useCases TestUseCase
        }
      }
      UseCase TestUseCase
    `)

    const aggregate = document.parseResult.value.boundedContexts[0].aggregates[0]
    expect(aggregate.useCases).toHaveLength(1)
    expect(aggregate.useCases[0]).not.toBeUndefined()
    expect(aggregate.useCases[0].ref).not.toBeUndefined()
    expect(aggregate.useCases[0].ref?.name).toEqual('TestUseCase')
  })

  test('check linking of user story in aggregate', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        Aggregate TestAggregate {
         userStories TestUserStory
        }
      }
      UserStory TestUserStory
    `)

    const aggregate = document.parseResult.value.boundedContexts[0].aggregates[0]
    expect(aggregate.userStories).toHaveLength(1)
    expect(aggregate.userStories[0]).not.toBeUndefined()
    expect(aggregate.userStories[0].ref).not.toBeUndefined()
    expect(aggregate.userStories[0].ref?.name).toEqual('TestUserStory')
  })

  test('check linking of user story in userStory', async () => {
    document = await parseValidInput(parse, `
      UserStory TestUserStory split by AnotherStory
      UserStory AnotherStory
    `)

    const userStory = document.parseResult.value.userRequirements[0] as UserStory
    expect(userStory.splittingStory).not.toBeUndefined()
    expect(userStory.splittingStory?.ref).not.toBeUndefined()
    expect(userStory.splittingStory?.ref?.name).toEqual('AnotherStory')
  })
})
