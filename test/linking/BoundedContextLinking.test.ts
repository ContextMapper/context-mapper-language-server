import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { EmptyFileSystem, type LangiumDocument } from 'langium'
import { clearDocuments, parseHelper } from 'langium/test'
import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import {
  ContextMappingModel,
  CustomerSupplierRelationship,
  Partnership,
  SharedKernel,
  UpstreamDownstreamRelationship
} from '../../src/language/generated/ast.js'
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

describe('Bounded context linking tests', () => {
  test('check linking of bounded contexts in context map SharedKernel relationship', async () => {
    document = await parseValidInput(parse, `
        ContextMap {
            TestContext [SK] <-> [SK] FirstContext
        }
        BoundedContext FirstContext
        BoundedContext TestContext
    `)

    const relationship = document.parseResult.value.contextMap[0].relationships[0] as SharedKernel
    expect(relationship.participant1.ref).not.toBeUndefined()
    expect(relationship.participant1.ref?.name).toEqual('TestContext')
    expect(relationship.participant2.ref).not.toBeUndefined()
    expect(relationship.participant2.ref?.name).toEqual('FirstContext')
  })

  test('check linking of bounded contexts in context map Partnership relationship', async () => {
    document = await parseValidInput(parse, `
        ContextMap {
          FirstContext Partnership TestContext
        }
        BoundedContext FirstContext
        BoundedContext TestContext
    `)

    const relationship = document.parseResult.value.contextMap[0].relationships[0] as Partnership
    expect(relationship.participant1.ref).not.toBeUndefined()
    expect(relationship.participant1.ref?.name).toEqual('FirstContext')
    expect(relationship.participant2.ref).not.toBeUndefined()
    expect(relationship.participant2.ref?.name).toEqual('TestContext')
  })

  test('check linking of bounded contexts in context map UpstreamDownstream relationship', async () => {
    document = await parseValidInput(parse, `
        ContextMap {
          FirstContext -> TestContext
        }
        BoundedContext FirstContext
        BoundedContext TestContext
    `)

    const relationship = document.parseResult.value.contextMap[0].relationships[0] as UpstreamDownstreamRelationship
    expect(relationship.upstream.ref).not.toBeUndefined()
    expect(relationship.upstream.ref?.name).toEqual('FirstContext')
    expect(relationship.downstream.ref).not.toBeUndefined()
    expect(relationship.downstream.ref?.name).toEqual('TestContext')
  })

  test('check linking of bounded contexts in context map CustomerSupplier relationship', async () => {
    document = await parseValidInput(parse, `
        ContextMap {
          FirstContext [C] <- [S] TestContext
        }
        BoundedContext FirstContext
        BoundedContext TestContext
    `)

    const relationship = document.parseResult.value.contextMap[0].relationships[0] as CustomerSupplierRelationship
    expect(relationship.downstream.ref).not.toBeUndefined()
    expect(relationship.downstream.ref?.name).toEqual('FirstContext')
    expect(relationship.upstream.ref).not.toBeUndefined()
    expect(relationship.upstream.ref?.name).toEqual('TestContext')
  })

  test('check linking of bounded contexts in context map', async () => {
    document = await parseValidInput(parse, `
        ContextMap {
          contains FirstContext
          contains SecondContext
        }
        BoundedContext FirstContext
        BoundedContext SecondContext
    `)

    const contextMap = document.parseResult.value.contextMap[0]
    expect(contextMap.boundedContexts).toHaveLength(2)
    expect(contextMap.boundedContexts[0].ref).not.toBeUndefined()
    expect(contextMap.boundedContexts[0].ref?.name).toEqual('FirstContext')
    expect(contextMap.boundedContexts[1].ref).not.toBeUndefined()
    expect(contextMap.boundedContexts[1].ref?.name).toEqual('SecondContext')
  })

  test('check linking of bounded context from bounded context', async () => {
    document = await parseValidInput(parse, `
        BoundedContext TestContext 
          refines RefinedContext
          realizes RealizedContext
        
        BoundedContext RealizedContext
        BoundedContext RefinedContext
    `)

    const boundedContext = document.parseResult.value.boundedContexts[0]
    expect(boundedContext.refinedBoundedContext).toHaveLength(1)
    expect(boundedContext.refinedBoundedContext[0].ref).not.toBeUndefined()
    expect(boundedContext.refinedBoundedContext[0].ref?.name).toEqual('RefinedContext')
    expect(boundedContext.realizedBoundedContexts).toHaveLength(1)
    expect(boundedContext.realizedBoundedContexts[0].ref).not.toBeUndefined()
    expect(boundedContext.realizedBoundedContexts[0].ref?.name).toEqual('RealizedContext')
  })

  test('check linking of aggregate owner', async () => {
    document = await parseValidInput(parse, `
        BoundedContext TestContext {
          Aggregate TestAggregate {
            owner TestContext
          }
        }
    `)

    const aggregate = document.parseResult.value.boundedContexts[0].aggregates[0]
    expect(aggregate.owner).toHaveLength(1)
    expect(aggregate.owner[0].ref).not.toBeUndefined()
    expect(aggregate.owner[0].ref?.name).toEqual('TestContext')
  })

  test('check linking of shareholders context', async () => {
    document = await parseValidInput(parse, `
        BoundedContext FirstContext
        BoundedContext SecondContext
        Stakeholders of SecondContext, FirstContext
    `)

    const stakeholders = document.parseResult.value.stakeholders[0]
    expect(stakeholders.contexts).toHaveLength(2)
    expect(stakeholders.contexts[0]).not.toBeUndefined()
    expect(stakeholders.contexts[0].ref).not.toBeUndefined()
    expect(stakeholders.contexts[0].ref?.name).toEqual('SecondContext')
    expect(stakeholders.contexts[1]).not.toBeUndefined()
    expect(stakeholders.contexts[1].ref).not.toBeUndefined()
    expect(stakeholders.contexts[1].ref?.name).toEqual('FirstContext')
  })

  test('check linking of ValueRegister context', async () => {
    document = await parseValidInput(parse, `
        BoundedContext SecondContext
        ValueRegister TestRegister for SecondContext
    `)

    const valueRegister = document.parseResult.value.valueRegisters[0]
    expect(valueRegister.context).not.toBeUndefined()
    expect(valueRegister.context?.ref).not.toBeUndefined()
    expect(valueRegister.context?.ref?.name).toEqual('SecondContext')
  })
})
