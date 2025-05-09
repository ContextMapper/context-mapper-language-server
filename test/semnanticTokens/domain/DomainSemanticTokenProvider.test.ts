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

describe('Domain semantic token tests', () => {
  test('check semantic tokens of Domain without body', async () => {
    document = await parse(`
      Domain TestDomain
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyDomain(result)
  })

  test('check semantic tokens of Domain with empty body', async () => {
    document = await parse(`
      Domain TestDomain {
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyDomain(result)
  })

  test('check semantic tokens of Domain with full body', async () => {
    document = await parse(`
      Domain TestDomain {
          domainVisionStatement = "vision"
          Subdomain FirstSubdomain
          Subdomain SecondSubdomain
        }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 8
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[0], 1, 6, 6, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[1], 0, 7, 10, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)

    expectSemanticTokensToEqual(tokens[2], 1, 10, 21, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 24, 8, semanticTokenProvider.tokenTypes.string, 0)
  })

  test('check semantic tokens of Subdomain without body', async () => {
    document = await parse(`
      Domain TestDomain {
        Subdomain TestSubdomain
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptySubdomain(result)
  })

  test('check semantic tokens of Subdomain with empty body', async () => {
    document = await parse(`
      Domain TestDomain {
        Subdomain TestSubdomain {
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptySubdomain(result)
  })

  test('check semantic tokens of Subdomain with full body', async () => {
    document = await parse(`
      Domain TestDomain {
          Subdomain TestSubdomain
            supports TestUseCase 
          {
            domainVisionStatement "vision"
            type = CORE_DOMAIN
          }
        }
        UseCase TestUseCase
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 12
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[2], 1, 10, 9, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 10, 13, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)

    expectSemanticTokensToEqual(tokens[4], 1, 12, 8, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 9, 11, semanticTokenProvider.tokenTypes.type, 0)

    expectSemanticTokensToEqual(tokens[6], 2, 12, 21, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[7], 0, 22, 8, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[8], 1, 12, 4, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[9], 0, 7, 11, semanticTokenProvider.tokenTypes.enumMember, 0)
  })
})

function expectEmptyDomain (result: SemanticTokens) {
  const expectedNumberOfTokens = 2
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[0], 1, 6, 6, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[1], 0, 7, 10, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
}

function expectEmptySubdomain (result: SemanticTokens) {
  const expectedNumberOfTokens = 4
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[2], 1, 8, 9, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[3], 0, 10, 13, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
}
