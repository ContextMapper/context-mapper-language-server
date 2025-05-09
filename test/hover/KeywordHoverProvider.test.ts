import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'
import { HoverProvider } from 'langium/lsp'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined
let hoverProvider: HoverProvider

beforeAll(() => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  hoverProvider = services.ContextMapperDsl.lsp.HoverProvider!
})

describe('Keyword hover provider tests', () => {
  test('check keyword hover documentation', async () => {
    document = await parse(`
      BoundedContext TestContext
    `)

    const params = {
      textDocument: {
        uri: document.uri.path
      },
      position: {
        line: 1,
        character: 13
      }
    }
    const result = await hoverProvider.getHoverContent(document, params)
    expect(result).not.toBeUndefined()
  })

  test('check jsdoc reference hover documentation', async () => {
    document = await parse(`
      ContextMap {
        TestContext <-> AnotherContext
      }
      BoundedContext TestContext
      /**
       * Another comment
       */
      BoundedContext AnotherContext
    `)

    const params = {
      textDocument: {
        uri: document.uri.path
      },
      position: {
        line: 2,
        character: 31
      }
    }
    const result = await hoverProvider.getHoverContent(document, params)
    expect(result).not.toBeUndefined()
  })
})
