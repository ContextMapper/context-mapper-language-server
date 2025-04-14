import { beforeAll, describe, expect, test } from 'vitest'
import { createContextMapperDslServices } from '../../src/language/context-mapper-dsl-module.js'
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

  // activate the following if your linking test requires elements from a built-in library, for example
  // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
})

describe('ContextMappingModelValidator tests', () => {
  test('accept no context map', async () => {
    document = await parse(`
            BoundedContext FirstContext
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('accept one context map', async () => {
    document = await parse(`
            ContextMap {
              FirstContext [SK] <-> [SK] SecondContext
            }
            BoundedContext FirstContext
            BoundedContext SecondContext
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple context maps', async () => {
    document = await parse(`
            ContextMap {
              FirstContext [SK] <-> [SK] SecondContext
            }
            ContextMap {
              
            }
            BoundedContext FirstContext
            BoundedContext SecondContext
    `)

    expect(document.diagnostics).not.toBeUndefined()
    expect(document.diagnostics).toHaveLength(1)
    const diagnostic = document.diagnostics![0]
    expect(diagnostic.range.start.line).toEqual(1)
  })
})
