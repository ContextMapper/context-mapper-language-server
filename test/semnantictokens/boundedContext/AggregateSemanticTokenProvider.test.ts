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

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  semanticTokenProvider = services.ContextMapperDsl.lsp.SemanticTokenProvider!!
})

afterEach(async () => {
  document && await clearDocuments(services.shared, [document])
})

describe('Aggregate semantic token tests', () => {
  test('check semantic tokens for Aggregate without body', async () => {
    document = await parse(`
      BoundedContext TestContext {
        Aggregate TestAggregate
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyAggregate(result)
  })

  test('check semantic tokens for Aggregate with empty body', async () => {
    document = await parse(`
      BoundedContext TestContext {
        Aggregate TestAggregate {}
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyAggregate(result)
  })

  test('check semantic tokens for Aggregate with full body', async () => {
    document = await parse(`
      BoundedContext TestContext {
        Aggregate TestAggregate {
          responsibilities "resp1", "resp2"
          owner = TestContext
          useCases TestUseCase
          knowledgeLevel = META
          contentVolatility = RARELY
          likelihoodForChange = NORMAL
          availabilityCriticality = HIGH
          consistencyCriticality = HIGH
          securityZone "testZone"
          securityCriticality = LOW
          securityAccessGroup = "testGroup"
          storageSimilarity = TINY
        }
      }
      UseCase TestUseCase
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 31
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[2], 1, 8, 9, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 10, 13, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)

    // responsibilities
    expectSemanticTokensToEqual(tokens[4], 1, 10, 16, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 17, 7, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[6], 0, 9, 7, semanticTokenProvider.tokenTypes.string, 0)

    // owner
    expectSemanticTokensToEqual(tokens[7], 1, 10, 5, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 8, 11, semanticTokenProvider.tokenTypes.type, 0)

    // useCases
    expectSemanticTokensToEqual(tokens[9], 1, 10, 8, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[10], 0, 9, 11, semanticTokenProvider.tokenTypes.type, 0)

    // knowledgeLevel
    expectSemanticTokensToEqual(tokens[11], 1, 10, 14, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[12], 0, 17, 4, semanticTokenProvider.tokenTypes.enumMember, 0)

    // contentVolatility
    expectSemanticTokensToEqual(tokens[13], 1, 10, 17, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[14], 0, 20, 6, semanticTokenProvider.tokenTypes.enumMember, 0)

    // likelihoodForChange
    expectSemanticTokensToEqual(tokens[15], 1, 10, 19, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[16], 0, 22, 6, semanticTokenProvider.tokenTypes.enumMember, 0)

    // availabilityCriticality
    expectSemanticTokensToEqual(tokens[17], 1, 10, 23, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[18], 0, 26, 4, semanticTokenProvider.tokenTypes.enumMember, 0)

    // consistencyCriticality
    expectSemanticTokensToEqual(tokens[19], 1, 10, 22, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[20], 0, 25, 4, semanticTokenProvider.tokenTypes.enumMember, 0)

    // securityZone
    expectSemanticTokensToEqual(tokens[21], 1, 10, 12, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[22], 0, 13, 10, semanticTokenProvider.tokenTypes.string, 0)

    // securityCriticality
    expectSemanticTokensToEqual(tokens[23], 1, 10, 19, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[24], 0, 22, 3, semanticTokenProvider.tokenTypes.enumMember, 0)

    // securityAccessGroup
    expectSemanticTokensToEqual(tokens[25], 1, 10, 19, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[26], 0, 22, 11, semanticTokenProvider.tokenTypes.string, 0)

    // storageSimilarity
    expectSemanticTokensToEqual(tokens[27], 1, 10, 17, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[28], 0, 20, 4, semanticTokenProvider.tokenTypes.enumMember, 0)
  })
})

function expectEmptyAggregate (result: SemanticTokens) {
  const expectedNumberOfTokens = 4
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[2], 1, 8, 9, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[3], 0, 10, 13, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
}
