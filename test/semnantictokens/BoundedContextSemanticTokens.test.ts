import { afterEach, beforeAll, describe, test } from 'vitest'
import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { EmptyFileSystem, type LangiumDocument } from 'langium'
import { SemanticTokenProvider } from 'langium/lsp'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import {
  assertSemanticToken,
  assertSemanticTokenLength, createSemanticTokenParams,
  extractSemanticTokens
} from './SemanticTokenTestHelper.js'
import { SemanticTokens } from 'vscode-languageserver-types'

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
  test('check bounded context without body', async () => {
    document = await parse('BoundedContext TestContext')
    const params = createSemanticTokenParams(document)
    const result = await semanticTokenProvider.semanticHighlight(document, params)
    assertEmptyBoundedContext(result)
  })

  test('check bounded context with empty body', async () => {
    document = await parse('BoundedContext TestContext {}')
    const params = createSemanticTokenParams(document)
    const result = await semanticTokenProvider.semanticHighlight(document, params)
    assertEmptyBoundedContext(result)
  })

  test('check bounded context with member attributes', async () => {
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
    assertSemanticTokenLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    assertSemanticToken(tokens[2], 1, 6, 4, semanticTokenProvider.tokenTypes.keyword, 0)
    assertSemanticToken(tokens[3], 0, 7, 9, semanticTokenProvider.tokenTypes.enumMember, 0)

    assertSemanticToken(tokens[4], 1, 6, 24, semanticTokenProvider.tokenTypes.keyword, 0)
    assertSemanticToken(tokens[5], 0, 27, 6, semanticTokenProvider.tokenTypes.string, 0)

    assertSemanticToken(tokens[6], 1, 6, 16, semanticTokenProvider.tokenTypes.keyword, 0)
    assertSemanticToken(tokens[7], 0, 19, 7, semanticTokenProvider.tokenTypes.string, 0)
    assertSemanticToken(tokens[8], 0, 9, 7, semanticTokenProvider.tokenTypes.string, 0)

    assertSemanticToken(tokens[9], 1, 6, 13, semanticTokenProvider.tokenTypes.keyword, 0)
    assertSemanticToken(tokens[10], 0, 16, 7, semanticTokenProvider.tokenTypes.string, 0)

    assertSemanticToken(tokens[11], 1, 6, 21, semanticTokenProvider.tokenTypes.keyword, 0)
    assertSemanticToken(tokens[12], 0, 24, 6, semanticTokenProvider.tokenTypes.string, 0)

    assertSemanticToken(tokens[13], 1, 6, 14, semanticTokenProvider.tokenTypes.keyword, 0)
    assertSemanticToken(tokens[14], 0, 17, 8, semanticTokenProvider.tokenTypes.enumMember, 0)

    assertSemanticToken(tokens[15], 1, 6, 9, semanticTokenProvider.tokenTypes.keyword, 0)
    assertSemanticToken(tokens[16], 0, 10, 7, semanticTokenProvider.tokenTypes.enumMember, 0)
  })
})

function assertEmptyBoundedContext (result: SemanticTokens) {
  const expectedNumberOfTokens = 2
  assertSemanticTokenLength(result, expectedNumberOfTokens)

  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  assertSemanticToken(
    tokens[0],
    0,
    0,
    14,
    semanticTokenProvider.tokenTypes.keyword,
    0
  )

  assertSemanticToken(
    tokens[1],
    0,
    15,
    11,
    semanticTokenProvider.tokenTypes.type,
    semanticTokenProvider.tokenModifiers.declaration
  )
}
