import { createContextMapperDslServices } from '../../src/language/context-mapper-dsl-module.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, test, expect } from 'vitest'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

describe('BoundedContext parsing tests', () => {
  test('parse BoundedContext without body', async () => {
    document = await parse(`
            BoundedContext FirstContext
    `)

    expect(document.parseResult.parserErrors.length).toEqual(0)

    const contextMappingModel = document.parseResult.value
    expect(contextMappingModel).not.toBeUndefined()
    expect(contextMappingModel.boundedContexts.length).toEqual(1)
    expect(contextMappingModel.contextMaps.length).toEqual(0)
    expect(contextMappingModel.userRequirements.length).toEqual(0)
    expect(contextMappingModel.domains.length).toEqual(0)
    expect(contextMappingModel.stakeholders.length).toEqual(0)
    expect(contextMappingModel.valueRegisters.length).toEqual(0)

    const boundedContext = contextMappingModel.boundedContexts[0]
    expect(boundedContext).not.toBeUndefined()
    expect(boundedContext.name).toEqual('FirstContext')
    expect(boundedContext.realizedBoundedContexts.length).toEqual(0)
    expect(boundedContext.refinedBoundedContext).toBeUndefined()
    expect(boundedContext.implementedDomainParts.length).toEqual(0)
    expect(boundedContext.domainVisionStatement).toBeUndefined()
    expect(boundedContext.knowledgeLevel).toBeUndefined()
    expect(boundedContext.type).toBeUndefined()
    expect(boundedContext.responsibilities.length).toEqual(0)
    expect(boundedContext.implementationTechnology).toBeUndefined()
    expect(boundedContext.businessModel).toBeUndefined()
    expect(boundedContext.evolution).toBeUndefined()
    expect(boundedContext.aggregates.length).toEqual(0)
  })

  test('parse BoundedContext with full body', async () => {
    document = await parse(`
      BoundedContext TestContext {
        type = UNDEFINED
        responsibilities = "resp1", "resp2"
        knowledgeLevel = CONCRETE
        implementationTechnology = "java"
        businessModel = "model"
        evolution = GENESIS
        domainVisionStatement = "vision"
      }
    `)

    expect(document.parseResult.parserErrors.length).toEqual(0)

    const contextMappingModel = document.parseResult.value
    expect(contextMappingModel).not.toBeUndefined()
    expect(contextMappingModel.boundedContexts.length).toEqual(1)

    const boundedContext = contextMappingModel.boundedContexts[0]
    expect(boundedContext).not.toBeUndefined()
    expect(boundedContext.name).toEqual('TestContext')
    expect(boundedContext.domainVisionStatement).toEqual('vision')
    expect(boundedContext.type).toEqual('UNDEFINED')
    expect(boundedContext.implementationTechnology).toEqual('java')
    expect(boundedContext.responsibilities.length).toEqual(2)
    expect(boundedContext.businessModel).toEqual('model')
    expect(boundedContext.knowledgeLevel).toEqual('CONCRETE')
    expect(boundedContext.evolution).toEqual('GENESIS')
    expect(boundedContext.aggregates.length).toEqual(0)
  })

  test('parse BoundedContext with body', async () => {
    document = await parse(`
      BoundedContext TestContext {
        type = FEATURE
        implementationTechnology = "c#"
        domainVisionStatement = "vision"
      }
    `)

    expect(document.parseResult.parserErrors.length).toEqual(0)

    const contextMappingModel = document.parseResult.value
    expect(contextMappingModel).not.toBeUndefined()
    expect(contextMappingModel.boundedContexts.length).toEqual(1)

    const boundedContext = contextMappingModel.boundedContexts[0]
    expect(boundedContext).not.toBeUndefined()
    expect(boundedContext.name).toEqual('TestContext')
    expect(boundedContext.domainVisionStatement).toEqual('vision')
    expect(boundedContext.type).toEqual('FEATURE')
    expect(boundedContext.implementationTechnology).toEqual('c#')
    expect(boundedContext.responsibilities.length).toEqual(0)
    expect(boundedContext.businessModel).toBeUndefined()
    expect(boundedContext.knowledgeLevel).toBeUndefined()
    expect(boundedContext.evolution).toBeUndefined()
    expect(boundedContext.aggregates.length).toEqual(0)
  })
})
