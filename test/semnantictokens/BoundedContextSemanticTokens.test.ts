import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { createContextMapperDslServices } from '../../src/language/context-mapper-dsl-module.js'
import { EmptyFileSystem, type LangiumDocument } from 'langium'
import { SemanticTokenProvider } from 'langium/lsp'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { SemanticTokensParams } from 'vscode-languageserver'

/**
 * A Semantic Token data array consists of a sequence of integers.
 * One token corresponds to a sequence of 5 integers, representing: startLine, startChar, length, type, modifier
 */

const TOKEN_DATA_LENGTH = 5

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

    expect(firstToken[0]).toEqual(0) // startLine
    expect(firstToken[1]).toEqual(0) // startChar
    expect(firstToken[2]).toEqual(14) // tokenLength
    expect(firstToken[3]).toEqual(semanticTokenProvider.tokenTypes.keyword) // tokenType
    expect(firstToken[4]).toEqual(0) // tokenModifier

    expect(secondToken[0]).toEqual(0) // startLine
    expect(secondToken[1]).toEqual(15) // startChar
    expect(secondToken[2]).toEqual(12) // tokenLength
    expect(secondToken[3]).toEqual(semanticTokenProvider.tokenTypes.type) // tokenType
    expect(secondToken[4]).toEqual(semanticTokenProvider.tokenModifiers.declaration) // tokenModifier
  })
})
