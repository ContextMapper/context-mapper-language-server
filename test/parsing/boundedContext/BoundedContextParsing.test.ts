import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, test, expect } from 'vitest'
import { parseValidInput } from '../../ParsingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

describe('BoundedContext parsing tests', () => {
  test('parse BoundedContext without body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext FirstContext
    `)

    const contextMappingModel = document.parseResult.value
    expect(contextMappingModel).not.toBeUndefined()
    expect(contextMappingModel.boundedContexts.length).toEqual(1)
    expect(contextMappingModel.contextMap.length).toEqual(0)
    expect(contextMappingModel.userRequirements.length).toEqual(0)
    expect(contextMappingModel.domains.length).toEqual(0)
    expect(contextMappingModel.stakeholders.length).toEqual(0)
    expect(contextMappingModel.valueRegisters.length).toEqual(0)

    const boundedContext = contextMappingModel.boundedContexts[0]
    expect(boundedContext).not.toBeUndefined()
    expect(boundedContext.name).toEqual('FirstContext')
    expect(boundedContext.realizedBoundedContexts.length).toEqual(0)
    expect(boundedContext.refinedBoundedContext).toHaveLength(0)
    expect(boundedContext.implementedDomainParts.length).toEqual(0)
    expect(boundedContext.domainVisionStatement).toHaveLength(0)
    expect(boundedContext.knowledgeLevel).toHaveLength(0)
    expect(boundedContext.type).toHaveLength(0)
    expect(boundedContext.responsibilities.length).toEqual(0)
    expect(boundedContext.implementationTechnology).toHaveLength(0)
    expect(boundedContext.businessModel).toHaveLength(0)
    expect(boundedContext.evolution).toHaveLength(0)
    expect(boundedContext.aggregates.length).toEqual(0)
  })

  test('parse BoundedContext with full body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext
        implements TestDomain, TestSubDomain
        realizes ContextToRealize
        refines ContextToRefine
      {
        type = UNDEFINED
        responsibilities = "resp1", "resp2"
        knowledgeLevel = CONCRETE
        implementationTechnology = "java"
        businessModel = "model"
        evolution = GENESIS
        domainVisionStatement = "vision"
      }
      
      BoundedContext ContextToRefine
      BoundedContext ContextToRealize
      
      Domain TestDomain
      Domain AnotherDomain {
        Subdomain TestSubDomain
      }
    `)

    const contextMappingModel = document.parseResult.value
    expect(contextMappingModel).not.toBeUndefined()
    expect(contextMappingModel.boundedContexts.length).toEqual(3)

    const boundedContext = contextMappingModel.boundedContexts[0]
    expect(boundedContext).not.toBeUndefined()
    expect(boundedContext.name).toEqual('TestContext')
    expect(boundedContext.implementedDomainParts).toHaveLength(2)
    expect(boundedContext.realizedBoundedContexts).toHaveLength(1)
    expect(boundedContext.refinedBoundedContext).toHaveLength(1)
    expect(boundedContext.domainVisionStatement).toEqual(['vision'])
    expect(boundedContext.type).toEqual(['UNDEFINED'])
    expect(boundedContext.implementationTechnology).toEqual(['java'])
    expect(boundedContext.responsibilities.length).toEqual(2)
    expect(boundedContext.businessModel).toEqual(['model'])
    expect(boundedContext.knowledgeLevel).toEqual(['CONCRETE'])
    expect(boundedContext.evolution).toEqual(['GENESIS'])
    expect(boundedContext.aggregates.length).toEqual(0)
  })

  test('parse BoundedContext with partial body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        type = FEATURE
        implementationTechnology = "c#"
        domainVisionStatement = "vision"
      }
    `)

    const contextMappingModel = document.parseResult.value
    expect(contextMappingModel).not.toBeUndefined()
    expect(contextMappingModel.boundedContexts.length).toEqual(1)

    const boundedContext = contextMappingModel.boundedContexts[0]
    expect(boundedContext).not.toBeUndefined()
    expect(boundedContext.name).toEqual('TestContext')
    expect(boundedContext.domainVisionStatement).toEqual(['vision'])
    expect(boundedContext.type).toEqual(['FEATURE'])
    expect(boundedContext.implementationTechnology).toEqual(['c#'])
    expect(boundedContext.responsibilities.length).toEqual(0)
    expect(boundedContext.businessModel).toHaveLength(0)
    expect(boundedContext.knowledgeLevel).toHaveLength(0)
    expect(boundedContext.evolution).toHaveLength(0)
    expect(boundedContext.aggregates.length).toEqual(0)
  })
})
