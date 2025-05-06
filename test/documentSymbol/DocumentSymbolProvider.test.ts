import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { DocumentSymbolProvider } from 'langium/lsp'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { SymbolKind } from 'vscode-languageserver-types'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined
let documentSymbolProvider: DocumentSymbolProvider

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  documentSymbolProvider = services.ContextMapperDsl.lsp.DocumentSymbolProvider!
})

afterEach(async () => {
  document && await clearDocuments(services.shared, [document])
})

describe('Document symbol provider tests', () => {
  test('test symbol hierarchy', async () => {
    document = await parse(`
      BoundedContext TestContext {
        Module TestModule {
          Aggregate TestAggregate {
            type TEAM
          }
        }
      }
    `)

    const params = {
      textDocument: {
        uri: document.uri.path
      }
    }
    const symbols = await documentSymbolProvider.getSymbols(document, params)
    expect(symbols).not.toBeUndefined()
    expect(symbols).toHaveLength(1)
    expect(symbols[0].name).toEqual('TestContext')
    expect(symbols[0].kind).toEqual(SymbolKind.Object)
    expect(symbols[0].children).toHaveLength(1)
    expect(symbols[0].children![0].name).toEqual('TestModule')
    expect(symbols[0].children![0].kind).toEqual(SymbolKind.Object)
    expect(symbols[0].children![0].children).toHaveLength(1)
    expect(symbols[0].children![0].children![0].name).toEqual('TestAggregate')
    expect(symbols[0].children![0].children![0].kind).toEqual(SymbolKind.Object)
    expect(symbols[0].children![0].children![0].children).toBeUndefined()
  })
})
