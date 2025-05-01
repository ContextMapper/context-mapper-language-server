import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import {
  ContextMappingModel,
  CustomerSupplierRelationship,
  Partnership,
  SharedKernel, UpstreamDownstreamRelationship
} from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'
import { parseValidInput } from '../../ParsingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

describe('Relationship parsing tests', () => {
  test('parse SharedKernel relationship properties', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext <-> FirstContext : RelName {
            implementationTechnology "Java"
          }
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expect(document.parseResult.value.contextMap).toHaveLength(1)
    expect(document.parseResult.value.contextMap[0].relationships).toHaveLength(1)
    const relationship = document.parseResult.value.contextMap[0].relationships[0] as SharedKernel
    expect(relationship).not.toBeUndefined()
    expect(relationship.name).toEqual('RelName')
    expect(relationship.implementationTechnology).toEqual('Java')
    expect(relationship.participant1).not.toBeUndefined()
    expect(relationship.participant2).not.toBeUndefined()
  })

  test('parse SharedKernel relationship variation 1', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [SK] <-> [SK] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    expectRelationshipType(document, 'SharedKernel')
  })

  test('parse SharedKernel relationship variation 2', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          [SK] TestContext <-> [SK] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'SharedKernel')
  })

  test('parse SharedKernel relationship variation 3', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [SK] <-> FirstContext [SK]
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'SharedKernel')
  })

  test('parse SharedKernel relationship variation 4', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          [SK] TestContext <-> FirstContext [SK]
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'SharedKernel')
  })

  test('parse SharedKernel relationship variation 5', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext Shared-Kernel FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'SharedKernel')
  })

  test('parse SharedKernel relationship variation 6', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext <-> FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'SharedKernel')
  })

  test('parse Partnership relationship properties', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [P] <-> [P] FirstContext : RelName {
            implementationTechnology "Java"
          }
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expect(document.parseResult.value.contextMap).toHaveLength(1)
    expect(document.parseResult.value.contextMap[0].relationships).toHaveLength(1)
    const relationship = document.parseResult.value.contextMap[0].relationships[0] as Partnership
    expect(relationship).not.toBeUndefined()
    expect(relationship.name).toEqual('RelName')
    expect(relationship.implementationTechnology).toEqual('Java')
    expect(relationship.participant1).not.toBeUndefined()
    expect(relationship.participant2).not.toBeUndefined()
  })

  test('parse Partnership relationship variation 1', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [P] <-> [P] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'Partnership')
  })

  test('parse Partnership relationship variation 2', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          [P] TestContext <-> [P] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'Partnership')
  })

  test('parse Partnership relationship variation 3', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [P] <-> FirstContext [P]
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'Partnership')
  })

  test('parse Partnership relationship variation 4', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          [P] TestContext <-> FirstContext [P]
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'Partnership')
  })

  test('parse Partnership relationship variation 5', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext Partnership FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'Partnership')
  })

  test('parse CustomerSupplier relationship properties', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [S,OHS] -> [C,CF] FirstContext : RelName {
            implementationTechnology "Java"
            downstreamRights INFLUENCER
            exposedAggregates = TestAggregate
          }
      }
      BoundedContext FirstContext
      BoundedContext TestContext {
        Aggregate TestAggregate
      }
    `)

    expect(document.parseResult.value.contextMap).toHaveLength(1)
    expect(document.parseResult.value.contextMap[0].relationships).toHaveLength(1)
    const relationship = document.parseResult.value.contextMap[0].relationships[0] as CustomerSupplierRelationship
    expect(relationship).not.toBeUndefined()
    expect(relationship.name).toEqual('RelName')
    expect(relationship.implementationTechnology).toEqual(['Java'])
    expect(relationship.downstreamGovernanceRights).toEqual(['INFLUENCER'])
    expect(relationship.upstreamExposedAggregates).toHaveLength(1)
    expect(relationship.upstream).not.toBeUndefined()
    expect(relationship.downstream).not.toBeUndefined()
    expect(relationship.upstreamRoles).toHaveLength(1)
    expect(relationship.upstreamRoles[0]).toEqual('OHS')
    expect(relationship.downstreamRoles).toHaveLength(1)
    expect(relationship.downstreamRoles[0]).toEqual('CF')
  })

  test('parse CustomerSupplier relationship variation 1', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [S] -> [C] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'CustomerSupplierRelationship')
  })

  test('parse CustomerSupplier relationship variation 2', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [C] <- [S] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'CustomerSupplierRelationship')
  })

  test('parse CustomerSupplier relationship variation 3', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext Customer-Supplier FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'CustomerSupplierRelationship')
  })

  test('parse CustomerSupplier relationship variation 4', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext Supplier-Customer FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'CustomerSupplierRelationship')
  })

  test('parse UpstreamDownstream relationship properties', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [U,OHS] -> [D,CF] FirstContext : RelName {
            downstreamRights INFLUENCER
            exposedAggregates = TestAggregate
            implementationTechnology "Java"
          }
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expect(document.parseResult.value.contextMap).toHaveLength(1)
    expect(document.parseResult.value.contextMap[0].relationships).toHaveLength(1)
    const relationship = document.parseResult.value.contextMap[0].relationships[0] as UpstreamDownstreamRelationship
    expect(relationship).not.toBeUndefined()
    expect(relationship.name).toEqual('RelName')
    expect(relationship.downstreamGovernanceRights).toEqual(['INFLUENCER'])
    expect(relationship.upstreamExposedAggregates).toHaveLength(1)
    expect(relationship.implementationTechnology).toEqual(['Java'])
    expect(relationship.upstream).not.toBeUndefined()
    expect(relationship.upstreamRoles).toHaveLength(1)
    expect(relationship.upstreamRoles[0]).toEqual('OHS')
    expect(relationship.downstream).not.toBeUndefined()
    expect(relationship.downstreamRoles).toHaveLength(1)
    expect(relationship.downstreamRoles[0]).toEqual('CF')
  })

  test('parse UpstreamDownstream relationship variation 1', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [U] -> [D] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'UpstreamDownstreamRelationship')
  })

  test('parse UpstreamDownstream relationship variation 2', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [D] <- [U] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'UpstreamDownstreamRelationship')
  })

  test('parse UpstreamDownstream relationship variation 3', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext Upstream-Downstream FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'UpstreamDownstreamRelationship')
  })

  test('parse UpstreamDownstream relationship variation 4', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext Downstream-Upstream FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)

    expectRelationshipType(document, 'UpstreamDownstreamRelationship')
  })
})

function expectRelationshipType (document: LangiumDocument<ContextMappingModel>, type: string) {
  expect(document.parseResult.value.contextMap).toHaveLength(1)
  expect(document.parseResult.value.contextMap[0].relationships).toHaveLength(1)
  const relationship = document.parseResult.value.contextMap[0].relationships[0]
  expect(relationship).not.toBeUndefined()
  expect(relationship.$type).toEqual(type)
}
