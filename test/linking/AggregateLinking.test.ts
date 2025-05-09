import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import {
  ContextMappingModel,
  CustomerSupplierRelationship,
  UpstreamDownstreamRelationship
} from '../../src/language/generated/ast.js'
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

describe('Aggregate linking tests', () => {
  test('check linking of aggregate in UpstreamDownstream relationship', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
        TestContext -> FirstContext {
          exposedAggregates TestAggregate
        }
      }
      BoundedContext FirstContext
      BoundedContext TestContext {
        Aggregate TestAggregate
      }
    `)

    const relationship = document.parseResult.value.contextMap[0].relationships[0] as UpstreamDownstreamRelationship
    expect(relationship.upstreamExposedAggregates).toHaveLength(1)
    expect(relationship.upstreamExposedAggregates[0]).not.toBeUndefined()
    expect(relationship.upstreamExposedAggregates[0].ref).not.toBeUndefined()
    expect(relationship.upstreamExposedAggregates[0].ref?.name).toEqual('TestAggregate')
  })

  test('check linking of aggregate in CustomerSupplier relationship', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
        TestContext [S] -> [C] FirstContext {
          exposedAggregates TestAggregate
        }
      }
      BoundedContext FirstContext
      BoundedContext TestContext {
        Aggregate TestAggregate
      }
    `)

    const relationship = document.parseResult.value.contextMap[0].relationships[0] as CustomerSupplierRelationship
    expect(relationship.upstreamExposedAggregates).toHaveLength(1)
    expect(relationship.upstreamExposedAggregates[0]).not.toBeUndefined()
    expect(relationship.upstreamExposedAggregates[0].ref).not.toBeUndefined()
    expect(relationship.upstreamExposedAggregates[0].ref?.name).toEqual('TestAggregate')
  })

  test('check linking of module aggregate in CustomerSupplier relationship', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
        TestContext [S] -> [C] FirstContext {
          exposedAggregates TestAggregate
        }
      }
      BoundedContext FirstContext
      BoundedContext TestContext {
        Module TestModule {
          Aggregate TestAggregate
        }
      }
    `)

    const relationship = document.parseResult.value.contextMap[0].relationships[0] as CustomerSupplierRelationship
    expect(relationship.upstreamExposedAggregates).toHaveLength(1)
    expect(relationship.upstreamExposedAggregates[0]).not.toBeUndefined()
    expect(relationship.upstreamExposedAggregates[0].ref).not.toBeUndefined()
    expect(relationship.upstreamExposedAggregates[0].ref?.name).toEqual('TestAggregate')
  })
})
