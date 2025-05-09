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

describe('AggregateValidationProvider tests', () => {
  test('accept one owner', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          owner TestOwner
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple owners', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          owner TestOwner
          owner TestOwner
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one knowledgeLevel', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          knowledgeLevel META
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple knowledgeLevels', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          knowledgeLevel META
          knowledgeLevel META
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one contentVolatility', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          contentVolatility NORMAL
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple contentVolatilities', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          contentVolatility NORMAL
          contentVolatility NORMAL
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one availabilityCriticality', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          availabilityCriticality NORMAL
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple availabilityCriticalities', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          availabilityCriticality NORMAL
          availabilityCriticality NORMAL
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one consistencyCriticality', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          consistencyCriticality NORMAL
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple consistencyCriticalities', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          consistencyCriticality NORMAL
          consistencyCriticality NORMAL
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one storageSimilarity', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          storageSimilarity NORMAL
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple storageSimilarities', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          storageSimilarity NORMAL
          storageSimilarity NORMAL
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one securityCriticality', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          securityCriticality NORMAL
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple securityCriticalities', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          securityCriticality NORMAL
          securityCriticality NORMAL
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one securityZone', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          securityZone "zone"
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple securityZones', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          securityZone "zone"
          securityZone "zone"
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one securityAccessGroup', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          securityAccessGroup "group"
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple securityAccessGroups', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          securityAccessGroup "group"
          securityAccessGroup "group"
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one likelihoodForChange', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          likelihoodForChange NORMAL
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('accept one structuralVolatility', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          structuralVolatility NORMAL
        }
      }
    `)
    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple structuralVolatilities', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          structuralVolatility NORMAL
          likelihoodForChange NORMAL
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(2)
    expect(document.diagnostics!.map(d => d.range.start.line).sort()).toEqual([3, 4])
  })

  test('accept one responsibilities', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          responsibilities "resp1", "resp2"
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple responsibilities', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          responsibilities "resp1", "resp2"
          responsibilities "resp3"
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one useCases', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          useCases TestCase, TestCaseTwo
        }
      }
      
      UseCase TestCase
      UseCase TestCaseTwo
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple useCases', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          useCases TestCase, TestCaseTwo
          useCases TestCaseThree
        }
      }
      
      UseCase TestCase
      UseCase TestCaseTwo
      UseCase TestCaseThree
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one userStories', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          userStories TestStory, UserStoryTwo
        }
      }
      
      UserStory TestStory
      UserStory UserStoryTwo
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple userStories', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          userStories TestStory, UserStoryTwo
          userStories UserStoryThree
        }
      }
      
      UserStory TestStory
      UserStory UserStoryTwo
      UserStory UserStoryThree
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one features', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          features Feature, FeatureTwo
        }
      }
      
      UseCase Feature
      UserStory FeatureTwo
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple features', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          features Feature, FeatureTwo
          features FeatureThree
        }
      }
      
      UseCase Feature
      UserStory FeatureTwo
      UserStory FeatureThree
    `)
  })

  test('accept one userRequirements', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          userRequirements Feature, FeatureTwo
        }
      }
      
      UseCase Feature
      UserStory FeatureTwo
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple userRequirements', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          userRequirements Feature, FeatureTwo
          userRequirements FeatureThree
        }
      }
      
      UseCase Feature
      UserStory FeatureTwo
      UserStory FeatureThree
    `)
  })

  test('report userRequirements and features', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          userRequirements Feature, FeatureTwo
          features FeatureThree
        }
      }
      
      UseCase Feature
      UserStory FeatureTwo
      UserStory FeatureThree
    `)
  })

  test('report userRequirements and useCases and userStories', async () => {
    document = await parse(`
      BoundedContext TestOwner {
        Aggregate TestAggregate {
          useCases TestCase
          userStories TestStory
          userRequirements Feature
        }
      }
      UseCase Feature
      UseCase TestCase
      UserStory TestStory
    `)

    expect(document.diagnostics).toHaveLength(3)
    expect(document.diagnostics!.map(d => d.range.start.line).sort()).toEqual([3, 4, 5])
  })
})
