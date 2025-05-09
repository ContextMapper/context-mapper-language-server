import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { SemanticTokenProvider } from 'langium/lsp'
import { afterEach, beforeAll, describe, test } from 'vitest'
import {
  createSemanticTokenParams, expectSemanticTokensToEqual,
  expectSemanticTokensToHaveLength,
  extractSemanticTokens
} from '../SemanticTokenTestHelper.js'

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

describe('Feature semantic token tests', () => {
  test('check semantic tokens of NormalFeature', async () => {
    document = await parse(`
      UseCase TestUseCase {
        interactions = create an "order" with its "products", "prices" in a "cart"
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 12
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[3], 0, 15, 6, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 7, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 3, 7, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[6], 0, 8, 8, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[7], 0, 9, 10, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 12, 8, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[9], 0, 9, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[10], 0, 3, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[11], 0, 2, 6, semanticTokenProvider.tokenTypes.string, 0)
  })

  test('check semantic tokens of StoryFeature', async () => {
    document = await parse(`
      UseCase TestUseCase {
        interactions = I want to "place" an "order" with its "products", "prices" in a "cart"
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 13
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[3], 0, 15, 9, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 10, 7, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 8, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[6], 0, 3, 7, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[7], 0, 8, 8, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 9, 10, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[9], 0, 12, 8, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[10], 0, 9, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[11], 0, 3, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[12], 0, 2, 6, semanticTokenProvider.tokenTypes.string, 0)
  })
})
