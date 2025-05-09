import { afterEach, beforeAll, describe, test } from 'vitest'
import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { EmptyFileSystem, type LangiumDocument } from 'langium'
import { SemanticTokenProvider } from 'langium/lsp'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../../src/language/generated/ast.js'
import {
  expectSemanticTokensToEqual,
  expectSemanticTokensToHaveLength, createSemanticTokenParams,
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

describe('BoundedContext semantic token tests', () => {
  test('check semantic tokens for bounded context without body', async () => {
    document = await parse('BoundedContext TestContext')
    const params = createSemanticTokenParams(document)
    const result = await semanticTokenProvider.semanticHighlight(document, params)
    expectEmptyBoundedContext(result)
  })

  test('check semantic tokens for bounded context with empty body', async () => {
    document = await parse('BoundedContext TestContext {}')
    const params = createSemanticTokenParams(document)
    const result = await semanticTokenProvider.semanticHighlight(document, params)
    expectEmptyBoundedContext(result)
  })

  test('check semantic tokens bounded context with full body', async () => {
    document = await parse(`
    BoundedContext TestContext {
      type = UNDEFINED
      implementationTechnology = "java"
      responsibilities = "resp1", "resp2"
      businessModel = "model"
      domainVisionStatement = "Test"
      knowledgeLevel = CONCRETE
      evolution GENESIS
    }
    `)
    const params = createSemanticTokenParams(document)
    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 17
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[2], 1, 6, 4, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 7, 9, semanticTokenProvider.tokenTypes.enumMember, 0)

    expectSemanticTokensToEqual(tokens[4], 1, 6, 24, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 27, 6, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[6], 1, 6, 16, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[7], 0, 19, 7, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 9, 7, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[9], 1, 6, 13, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[10], 0, 16, 7, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[11], 1, 6, 21, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[12], 0, 24, 6, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[13], 1, 6, 14, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[14], 0, 17, 8, semanticTokenProvider.tokenTypes.enumMember, 0)

    expectSemanticTokensToEqual(tokens[15], 1, 6, 9, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[16], 0, 10, 7, semanticTokenProvider.tokenTypes.enumMember, 0)
  })

  test('check semantic tokens bounded context with attributes', async () => {
    document = await parse(`
      BoundedContext TestContext 
        implements TestDomain
        realizes OtherContext 
        refines NextContext {
      }
      BoundedContext OtherContext
      BoundedContext NextContext
      Domain TestDomain
    `)
    const params = createSemanticTokenParams(document)
    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 14
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[2], 1, 8, 10, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 11, 10, semanticTokenProvider.tokenTypes.type, 0)

    expectSemanticTokensToEqual(tokens[4], 1, 8, 8, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 9, 12, semanticTokenProvider.tokenTypes.type, 0)

    expectSemanticTokensToEqual(tokens[6], 1, 8, 7, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[7], 0, 8, 11, semanticTokenProvider.tokenTypes.type, 0)
  })
})

function expectEmptyBoundedContext (result: SemanticTokens) {
  const expectedNumberOfTokens = 2
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)

  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(
    tokens[0],
    0,
    0,
    14,
    semanticTokenProvider.tokenTypes.keyword,
    0
  )

  expectSemanticTokensToEqual(
    tokens[1],
    0,
    15,
    11,
    semanticTokenProvider.tokenTypes.type,
    semanticTokenProvider.tokenModifiers.declaration
  )
}
