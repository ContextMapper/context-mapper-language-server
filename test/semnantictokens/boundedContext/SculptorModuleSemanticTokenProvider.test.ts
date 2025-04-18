import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { SemanticTokenProvider } from 'langium/lsp'
import { afterEach, beforeAll, describe, test } from 'vitest'
import { SemanticTokens } from 'vscode-languageserver-types'
import {
  createSemanticTokenParams,
  expectSemanticTokensToEqual,
  expectSemanticTokensToHaveLength,
  extractSemanticTokens
} from '../SemanticTokenTestHelper.js'

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

describe('SculptorModule semantic token tests', () => {
  test('check semantic tokens of SculptorModule without body', async () => {
    document = await parse(`
      BoundedContext TestContext {
        Module TestModule
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptySculptorModule(result)
  })

  test('check semantic tokens of SculptorModule with empty body', async () => {
    document = await parse(`
      BoundedContext TestContext {
        Module TestModule {
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptySculptorModule(result)
  })

  test('check semantic tokens of SculptorModule with full body', async () => {
    document = await parse(`
      BoundedContext TestContext {
        "doc"
        Module TestModule {
          hint = "hint"
          external
          basePackage = base.package
          Aggregate SecondAggregate
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 12
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[2], 1, 8, 5, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[3], 1, 8, 6, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 7, 10, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)

    expectSemanticTokensToEqual(tokens[5], 1, 10, 4, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[6], 0, 7, 6, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[7], 1, 10, 8, semanticTokenProvider.tokenTypes.keyword, 0)

    expectSemanticTokensToEqual(tokens[8], 1, 10, 11, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[9], 0, 14, 12, semanticTokenProvider.tokenTypes.namespace, 0)

    expectSemanticTokensToEqual(tokens[10], 1, 10, 9, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[11], 0, 10, 15, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
  })
})

function expectEmptySculptorModule (result: SemanticTokens) {
  const expectedNumberOfTokens = 4
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[2], 1, 8, 6, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[3], 0, 7, 10, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
}
