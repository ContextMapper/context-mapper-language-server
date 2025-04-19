import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { SemanticTokenProvider } from 'langium/lsp'
import { afterEach, beforeAll, describe, test } from 'vitest'
import {
  createSemanticTokenParams, expectSemanticTokensToEqual,
  expectSemanticTokensToHaveLength,
  extractSemanticTokens
} from './SemanticTokenTestHelper.js'

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

describe('Comment semantic token tests', () => {
  test('check semantic tokens for multiline comment at snippet start', async () => {
    document = await parse(`
      /*
        This is a multiline comment
      */
      ContextMap {}
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 2
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[0], 1, 6, 47, semanticTokenProvider.tokenTypes.comment, 0)
  })

  test('check semantic tokens for multiline comment at snippet end', async () => {
    document = await parse(`
      ContextMap {}
      /*
        This is a multiline comment
      */
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 2
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 6, 47, semanticTokenProvider.tokenTypes.comment, 0)
  })

  test('check semantic tokens for single-line comment at snippet start', async () => {
    document = await parse(`
      // This is a single-line comment
      ContextMap {}
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 2
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[0], 1, 6, 32, semanticTokenProvider.tokenTypes.comment, 0)
  })

  test('check semantic tokens for single-line comment at snippet end', async () => {
    document = await parse(`
      ContextMap {}
      // This is a single-line comment
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 2
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 6, 32, semanticTokenProvider.tokenTypes.comment, 0)
  })

  test('check semantic tokens for multiple multiline comments', async () => {
    document = await parse(`
      /*
        TestContext description
      */
      BoundedContext TestContext 
      /*
        AnotherContext description
      */
      BoundedContext AnotherContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 6
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[0], 1, 6, 43, semanticTokenProvider.tokenTypes.comment, 0)
    expectSemanticTokensToEqual(tokens[3], 1, 6, 46, semanticTokenProvider.tokenTypes.comment, 0)
  })

  test('check semantic tokens for multiple single-line comments', async () => {
    document = await parse(`
      // TestContext description
      BoundedContext TestContext 
      
      // AnotherContext description
      BoundedContext AnotherContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 6
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[0], 1, 6, 26, semanticTokenProvider.tokenTypes.comment, 0)
    expectSemanticTokensToEqual(tokens[3], 2, 6, 29, semanticTokenProvider.tokenTypes.comment, 0)
  })

  test('check semantic tokens for multiline comment in nested structure', async () => {
    document = await parse(`
      BoundedContext TestContext {
        /*
          This is a multiline comment
        */
        Module TestModule
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 5
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[2], 1, 8, 51, semanticTokenProvider.tokenTypes.comment, 0)
  })

  test('check semantic tokens for single-line comment in nested structure', async () => {
    document = await parse(`
      BoundedContext TestContext {
        // This is a multiline comment
        Module TestModule
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 5
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[2], 1, 8, 30, semanticTokenProvider.tokenTypes.comment, 0)
  })

  test('check semantic tokens for single-line comment after a field', async () => {
    document = await parse(`
      BoundedContext TestContext {
        type TEAM // This is a single-line comment
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 5
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[4], 0, 5, 32, semanticTokenProvider.tokenTypes.comment, 0)
  })
})
