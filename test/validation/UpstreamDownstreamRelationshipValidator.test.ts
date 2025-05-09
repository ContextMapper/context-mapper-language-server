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

describe('UpstreamDownstreamRelationshipValidationProvider tests', () => {
  test('accept one implementationTechnology', async () => {
    document = await parse(`
      ContextMap {
        FirstContext -> SecondContext {
          implementationTechnology "java"
        }
      }
      BoundedContext FirstContext
      BoundedContext SecondContext
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('accept one implementationTechnology', async () => {
    document = await parse(`
      ContextMap {
        FirstContext -> SecondContext {
          implementationTechnology "java"
          implementationTechnology "c#"
        }
      }
      BoundedContext FirstContext
      BoundedContext SecondContext
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one exposedAggregates', async () => {
    document = await parse(`
      ContextMap {
        FirstContext -> SecondContext {
          exposedAggregates FirstAggregate, SecondAggregate
        }
      }
      BoundedContext FirstContext {
        Aggregate FirstAggregate
      }
      BoundedContext SecondContext {
        Aggregate SecondAggregate
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple exposedAggregates', async () => {
    document = await parse(`
      ContextMap {
        FirstContext -> SecondContext {
          exposedAggregates FirstAggregate, SecondAggregate
          exposedAggregates ThirdAggregate
        }
      }
      BoundedContext FirstContext {
        Aggregate FirstAggregate
      }
      BoundedContext SecondContext {
        Aggregate SecondAggregate
        Aggregate ThirdAggregate
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one downstreamRights', async () => {
    document = await parse(`
      ContextMap {
        FirstContext -> SecondContext {
          downstreamRights INFLUENCER
        }
      }
      BoundedContext FirstContext
      BoundedContext SecondContext
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple downstreamRights', async () => {
    document = await parse(`
      ContextMap {
        FirstContext -> SecondContext {
          downstreamRights INFLUENCER
          downstreamRights INFLUENCER
        }
      }
      BoundedContext FirstContext
      BoundedContext SecondContext
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })
})
