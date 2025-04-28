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
import { parseValidInput } from '../../ParsingTestHelper.js'

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

describe('User Requirements semantic token tests', () => {
  test('check semantic tokens of UseCase without body', async () => {
    document = await parse(`
      UseCase TestUseCase
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyUseCase(result)
  })

  test('check semantic tokens of UseCase with empty body', async () => {
    document = await parse(`
      UseCase TestUseCase
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyUseCase(result)
  })

  test('check semantic tokens of UseCase with full body', async () => {
    document = await parseValidInput(parse, `
      UseCase TestUseCase {
        secondaryActors = "actor1", "actor2"
        actor "role"
        benefit = "benefit"
        level = "level"
        scope = "scope"
        interactions
          create an "order",
          "edit" an "order"
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 20
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    // secondaryActors
    expectSemanticTokensToEqual(tokens[2], 1, 8, 15, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 18, 8, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 10, 8, semanticTokenProvider.tokenTypes.string, 0)

    // actor
    expectSemanticTokensToEqual(tokens[5], 1, 8, 5, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[6], 0, 6, 6, semanticTokenProvider.tokenTypes.string, 0)

    // benefit
    expectSemanticTokensToEqual(tokens[7], 1, 8, 7, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 10, 9, semanticTokenProvider.tokenTypes.string, 0)

    // level
    expectSemanticTokensToEqual(tokens[9], 1, 8, 5, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[10], 0, 8, 7, semanticTokenProvider.tokenTypes.string, 0)

    // scope
    expectSemanticTokensToEqual(tokens[11], 1, 8, 5, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[12], 0, 8, 7, semanticTokenProvider.tokenTypes.string, 0)

    // interactions
    expectSemanticTokensToEqual(tokens[13], 1, 8, 12, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[14], 1, 10, 6, semanticTokenProvider.tokenTypes.keyword, 0)
  })

  test('check semantic tokens of UserStory without body', async () => {
    document = await parseValidInput(parse, `
      UserStory TestUserStory
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyUserStory(result)
  })

  test('check semantic tokens of UserStory with empty body', async () => {
    document = await parseValidInput(parse, `
      UserStory TestUserStory {
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyUserStory(result)
  })

  test('check semantic tokens of UserStory with full body', async () => {
    document = await parseValidInput(parse, `
      UserStory TestUserStory
        split by AnotherUserStory 
      {
        As a "user" I want to create an "order" so that "I can buy stuff" and that "consumption" is promoted, accepting that "savings" are reduced
      }    
      UserStory AnotherUserStory
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 22
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[2], 1, 8, 8, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 9, 16, semanticTokenProvider.tokenTypes.type, 0)

    expectSemanticTokensToEqual(tokens[4], 2, 8, 4, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 5, 6, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[10], 0, 8, 7, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[11], 0, 8, 17, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[12], 0, 18, 8, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[13], 0, 9, 13, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[14], 0, 14, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[15], 0, 3, 8, semanticTokenProvider.tokenTypes.keyword, 0)

    expectSemanticTokensToEqual(tokens[16], 0, 10, 14, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[17], 0, 15, 9, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[18], 0, 10, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[19], 0, 4, 7, semanticTokenProvider.tokenTypes.keyword, 0)
  })
})

function expectEmptyUseCase (result: SemanticTokens) {
  const expectedNumberOfTokens = 2
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[0], 1, 6, 7, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[1], 0, 8, 11, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
}

function expectEmptyUserStory (result: SemanticTokens) {
  const expectedNumberOfTokens = 2
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[0], 1, 6, 9, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[1], 0, 10, 13, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
}
