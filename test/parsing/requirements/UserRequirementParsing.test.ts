import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel, NormalFeature, StoryFeature, UseCase, UserStory } from '../../../src/language/generated/ast.js'
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

describe('User requirement parsing tests', () => {
  test('parse UseCase without body', async () => {
    document = await parseValidInput(parse, `
      UseCase TestUseCase
    `)

    expect(document.parseResult.value.userRequirements).toHaveLength(1)
    const userRequirement = document.parseResult.value.userRequirements[0]
    expect(userRequirement).not.toBeUndefined()
    expect(userRequirement.$type).toEqual('UseCase')
    const useCase = userRequirement as UseCase
    expectUseCaseToBeEmpty(useCase)
  })

  test('parse UseCase with empty body', async () => {
    document = await parseValidInput(parse, `
      UseCase TestUseCase {
      }
    `)

    expect(document.parseResult.value.userRequirements).toHaveLength(1)
    const useCase = document.parseResult.value.userRequirements[0] as UseCase
    expectUseCaseToBeEmpty(useCase)
  })

  test('parse UseCase with full body', async () => {
    document = await parseValidInput(parse, `
      UseCase TestUseCase {
        secondaryActors = "actor1", "actor2"
        actor "role"
        benefit = "benefit"
        level = "level"
        scope = "scope"
        interactions
          create an "order",
          "edit" an "order"
      }
    `)

    expect(document.parseResult.value.userRequirements).toHaveLength(1)
    const useCase = document.parseResult.value.userRequirements[0] as UseCase
    expect(useCase).not.toBeUndefined()
    expect(useCase.name).toEqual('TestUseCase')
    expect(useCase.secondaryActors).toHaveLength(2)
    expect(useCase.secondaryActors[0]).toEqual('actor1')
    expect(useCase.secondaryActors[1]).toEqual('actor2')
    expect(useCase.role).toEqual(['role'])
    expect(useCase.benefit).toEqual(['benefit'])
    expect(useCase.level).toEqual(['level'])
    expect(useCase.scope).toEqual(['scope'])
    expect(useCase.features).toHaveLength(2)
  })

  test('parse UserStory without body', async () => {
    document = await parseValidInput(parse, `
      UserStory TestUserStory
    `)

    expect(document.parseResult.value.userRequirements).toHaveLength(1)
    const requirement = document.parseResult.value.userRequirements[0]
    expect(requirement).not.toBeUndefined()
    expect(requirement.$type).toEqual('UserStory')
    const userStory = requirement as UserStory
    expectUserStoryToBeEmpty(userStory)
  })

  test('parse UserStory with empty body', async () => {
    document = await parseValidInput(parse, `
      UserStory TestUserStory {
      }
    `)

    expect(document.parseResult.value.userRequirements).toHaveLength(1)
    const userStory = document.parseResult.value.userRequirements[0] as UserStory
    expectUserStoryToBeEmpty(userStory)
  })

  test('parse UserStory with full body', async () => {
    document = await parseValidInput(parse, `
      UserStory TestUserStory
        split by AnotherUserStory 
      {
        As a "user" create an "order" so that "I can buy stuff" and that "consumption" is promoted, accepting that "savings" are reduced
      }    
      UserStory AnotherUserStory
    `)

    expect(document.parseResult.value.userRequirements).toHaveLength(2)
    const userStory = document.parseResult.value.userRequirements[0] as UserStory
    expect(userStory.name).toEqual('TestUserStory')
    expect(userStory.splittingStory).not.toBeUndefined()
    expect(userStory.role).toEqual('user')
    expect(userStory.features).toHaveLength(1)
    expect(userStory.benefit).toEqual('I can buy stuff')
    expect(userStory.valuation).not.toBeUndefined()
    expect(userStory.valuation?.promotedValues).toHaveLength(1)
    expect(userStory.valuation?.promotedValues[0]).toEqual('consumption')
    expect(userStory.valuation?.harmedValues).toHaveLength(1)
    expect(userStory.valuation?.harmedValues[0]).toEqual('savings')
  })

  test('parse NormalFeature', async () => {
    document = await parseValidInput(parse, `
      UseCase TestUseCase {
        interactions = create an "order" with its "products", "prices" in a "cart"
      }
    `)

    expect(document.parseResult.value.userRequirements).toHaveLength(1)
    const useCase = document.parseResult.value.userRequirements[0] as UseCase
    expect(useCase.features).toHaveLength(1)
    const feature = useCase.features[0] as NormalFeature
    expect(feature.$type).toEqual('NormalFeature')
    expect(feature.verb).toEqual('create')
    expect(feature.entityArticle).toEqual('an')
    expect(feature.entity).toEqual('order')
    expect(feature.entityAttributesPreposition).toEqual('with its')
    expect(feature.entityAttributes).toHaveLength(2)
    expect(feature.entityAttributes[0]).toEqual('products')
    expect(feature.entityAttributes[1]).toEqual('prices')
    expect(feature.containerEntityPreposition).toEqual('in')
    expect(feature.containerEntityArticle).toEqual('a')
    expect(feature.containerEntity).toEqual('cart')
  })

  test('parse StoryFeature', async () => {
    document = await parseValidInput(parse, `
      UseCase TestUseCase {
        interactions = I want to "create" an "order" with its "products", "prices" in a "cart"
      }
    `)

    expect(document.parseResult.value.userRequirements).toHaveLength(1)
    const useCase = document.parseResult.value.userRequirements[0] as UseCase
    expect(useCase.features).toHaveLength(1)
    const feature = useCase.features[0] as StoryFeature
    expect(feature.$type).toEqual('StoryFeature')
    expect(feature.verb).toEqual('create')
    expect(feature.entityArticle).toEqual('an')
    expect(feature.entity).toEqual('order')
    expect(feature.entityAttributesPreposition).toEqual('with its')
    expect(feature.entityAttributes).toHaveLength(2)
    expect(feature.entityAttributes[0]).toEqual('products')
    expect(feature.entityAttributes[1]).toEqual('prices')
    expect(feature.containerEntityPreposition).toEqual('in')
    expect(feature.containerEntityArticle).toEqual('a')
    expect(feature.containerEntity).toEqual('cart')
  })
})

function expectUseCaseToBeEmpty (useCase: UseCase) {
  expect(useCase.name).toEqual('TestUseCase')
  expect(useCase.role).toHaveLength(0)
  expect(useCase.secondaryActors).toHaveLength(0)
  expect(useCase.features).toHaveLength(0)
  expect(useCase.benefit).toHaveLength(0)
  expect(useCase.scope).toHaveLength(0)
  expect(useCase.level).toHaveLength(0)
}

function expectUserStoryToBeEmpty (userStory: UserStory) {
  expect(userStory.name).toEqual('TestUserStory')
  expect(userStory.splittingStory).toBeUndefined()
  expect(userStory.role).toBeUndefined()
  expect(userStory.features).toHaveLength(0)
  expect(userStory.benefit).toBeUndefined()
  expect(userStory.valuation).toBeUndefined()
}
