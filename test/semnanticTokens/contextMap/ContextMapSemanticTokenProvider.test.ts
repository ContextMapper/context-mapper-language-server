import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { SemanticTokenProvider } from 'langium/lsp'
import { afterEach, beforeAll, describe, test } from 'vitest'
import {
  createSemanticTokenParams,
  expectSemanticTokensToEqual, expectSemanticTokensToHaveLength,
  extractSemanticTokens
} from '../SemanticTokenTestHelper.js'
import { SemanticTokens } from 'vscode-languageserver-types'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined
let semanticTokenProvider: SemanticTokenProvider

beforeAll(() => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  semanticTokenProvider = services.ContextMapperDsl.lsp.SemanticTokenProvider!
})

afterEach(async () => {
  if (document) await clearDocuments(services.shared, [document])
})

describe('ContextMap semantic token tests', () => {
  test('check semantic tokens of ContextMap with empty body', async () => {
    document = await parse(`
      ContextMap {}
    `)
    const params = createSemanticTokenParams(document)
    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyContextMap(result)
  })

  test('check semantic tokens of ContextMap with full body', async () => {
    document = await parse(`
      ContextMap TestMap {
        state = AS_IS
        type = ORGANIZATIONAL
        contains FirstContext, SecondContext
        
        FirstContext [SK] <-> [SK] SecondContext
      }
      
      BoundedContext FirstContext
      BoundedContext SecondContext
    `)

    const params = createSemanticTokenParams(document)
    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 18
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[0], 1, 6, 10, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[1], 0, 11, 7, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)

    expectSemanticTokensToEqual(tokens[2], 1, 8, 5, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 8, 5, semanticTokenProvider.tokenTypes.enumMember, 0)

    expectSemanticTokensToEqual(tokens[4], 1, 8, 4, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 7, 14, semanticTokenProvider.tokenTypes.enumMember, 0)

    expectSemanticTokensToEqual(tokens[6], 1, 8, 8, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[7], 0, 9, 12, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 14, 13, semanticTokenProvider.tokenTypes.type, 0)
  })
})

function expectEmptyContextMap (result: SemanticTokens) {
  const expectedNumberOfTokens = 1
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[0], 1, 6, 10, semanticTokenProvider.tokenTypes.keyword, 0)
}
