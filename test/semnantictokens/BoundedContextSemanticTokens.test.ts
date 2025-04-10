import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { createContextMapperDslServices } from '../../src/language/context-mapper-dsl-module.js'
import { EmptyFileSystem, type LangiumDocument } from 'langium'
import { SemanticTokenProvider } from 'langium/lsp'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { SemanticTokensParams } from 'vscode-languageserver'
import { assertSemanticToken, TOKEN_DATA_LENGTH } from './SemanticTokenTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined
let semanticTokenProvider: SemanticTokenProvider

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  semanticTokenProvider = services.ContextMapperDsl.lsp.SemanticTokenProvider!!
})

afterEach(async () => {
  document && await clearDocuments(services.shared, [document])
})

describe('BoundedContext semantic token test', () => {
  test('Test bounded context without body', async () => {
    document = await parse('BoundedContext FirstContext')
    const params: SemanticTokensParams = {
      textDocument: {
        uri: document.uri.path
      }
    }
    const result = await semanticTokenProvider.semanticHighlight(document, params)
    const expectedNumberOfTokens = 2
    expect(result).not.toBeNull()
    expect(expectedNumberOfTokens * TOKEN_DATA_LENGTH).toEqual(result.data.length)

    const firstToken = result.data.slice(0, 5)
    const secondToken = result.data.slice(5, 10)

    assertSemanticToken(
      firstToken,
      0,
      0,
      14,
      semanticTokenProvider.tokenTypes.keyword,
      0
    )

    assertSemanticToken(
      secondToken,
      0,
      15,
      12,
      semanticTokenProvider.tokenTypes.type,
      semanticTokenProvider.tokenModifiers.declaration
    )
  })
})
