import { beforeAll, describe, expect, test } from 'vitest'
import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { EmptyFileSystem, type LangiumDocument } from 'langium'
import { parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  const doParse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  parse = (input: string) => doParse(input, { validation: true })
})

describe('BoundedContextValidationProvider tests', () => {
  // TODO: test implementedDomainParts & realizedBoundedContexts after regex enforcement impl

  test('accept one refinement', async () => {
    document = await parse(`
      BoundedContext FirstContext 
        refines OtherContext {
        
      }
      BoundedContext OtherContext
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple refinements', async () => {
    document = await parse(`
      BoundedContext FirstContext 
        refines OtherContext
        refines ThirdContext {
        }
      BoundedContext OtherContext
      BoundedContext ThirdContext
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })

  test('accept one domainVisionStatement', async () => {
    document = await parse(`
      BoundedContext FirstContext {
        domainVisionStatement "This is a domain vision statement"
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple domainVisionStatements', async () => {
    document = await parse(`
      BoundedContext FirstContext {
        domainVisionStatement "This is a domain vision statement"
        domainVisionStatement "This is another domain vision statement"
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })

  test('accept one type', async () => {
    document = await parse(`
      BoundedContext FirstContext {
        type UNDEFINED
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple types', async () => {
    document = await parse(`
      BoundedContext FirstContext {
        type UNDEFINED
        type TEAM
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })

  // TODO: test responsibilities after Regex validation impl

  test('accept one implementationTechnology', async () => {
    document = await parse(`
      BoundedContext FirstContext {
        implementationTechnology "This is an implementation technology"
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple implementationTechnologies', async () => {
    document = await parse(`
      BoundedContext FirstContext {
        implementationTechnology "This is an implementation technology"
        implementationTechnology "This is another implementation technology"
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })

  test('accept one knowledgeLevel', async () => {
    document = await parse(`
      BoundedContext FirstContext {
        knowledgeLevel META
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple knowledgeLevels', async () => {
    document = await parse(`
      BoundedContext FirstContext {
        knowledgeLevel META
        knowledgeLevel CONCRETE
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })

  test('accept one businessModel', async () => {
    document = await parse(`
      BoundedContext FirstContext {
        businessModel "This is a business model"
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple businessModels', async () => {
    document = await parse(`
      BoundedContext FirstContext {
        businessModel "This is a business model"
        businessModel "This is another business model"
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })

  test('accept one evolution', async () => {
    document = await parse(`
      BoundedContext FirstContext {
        evolution UNDEFINED
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple evolutions', async () => {
    document = await parse(`
      BoundedContext FirstContext {
        evolution UNDEFINED
        evolution UNDEFINED
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })
})
