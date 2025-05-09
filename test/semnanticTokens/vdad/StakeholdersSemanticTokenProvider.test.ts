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
import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'

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

describe('Stakeholders semantic token tests', () => {
  test('check semantic tokens of Stakeholders without body', async () => {
    document = await parse(`
      Stakeholders
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyStakeholders(result)
  })

  test('check semantic tokens of Stakeholders without body', async () => {
    document = await parse(`
      Stakeholders {
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyStakeholders(result)
  })

  test('check semantic tokens of Stakeholders without attributes', async () => {
    document = await parse(`
      Stakeholders of BC1, BC2 {
      }
      BoundedContext BC1
      BoundedContext BC2
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 8
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[0], 1, 6, 12, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[1], 0, 13, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 3, 3, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 5, 3, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of Stakeholder without body', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyStakeholder(result)
  })

  test('check semantic tokens of Stakeholder with empty body', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder {
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyStakeholder(result)
  })

  test('check semantic tokens of Stakeholder with full body', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder {
          interest = HIGH
          influence MEDIUM
          description = "description"
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 9
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[3], 1, 10, 8, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 11, 4, semanticTokenProvider.tokenTypes.enumMember, 0)

    expectSemanticTokensToEqual(tokens[5], 1, 10, 9, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[6], 0, 10, 6, semanticTokenProvider.tokenTypes.enumMember, 0)

    expectSemanticTokensToEqual(tokens[7], 1, 10, 11, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 14, 13, semanticTokenProvider.tokenTypes.string, 0)
  })

  test('check semantic tokens of StakeholderGroup without body', async () => {
    document = await parse(`
      Stakeholders {
        StakeholderGroup TestStakeholderGroup
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyStakeholderGroup(result)
  })

  test('check semantic tokens of StakeholderGroup with empty body', async () => {
    document = await parse(`
      Stakeholders {
        StakeholderGroup TestStakeholderGroup {
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyStakeholderGroup(result)
  })

  test('check semantic tokens of StakeholderGroup with full body', async () => {
    document = await parse(`
      Stakeholders {
        StakeholderGroup TestStakeholderGroup {
          Stakeholder TestStakeholder
        }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 5
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[3], 1, 10, 11, semanticTokenProvider.tokenTypes.keyword, 0)
  })
})

function expectEmptyStakeholders (result: SemanticTokens) {
  const expectedNumberOfTokens = 1
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[0], 1, 6, 12, semanticTokenProvider.tokenTypes.keyword, 0)
}

function expectEmptyStakeholder (result: SemanticTokens) {
  const expectedNumberOfTokens = 3
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[1], 1, 8, 11, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[2], 0, 12, 15, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
}

function expectEmptyStakeholderGroup (result: SemanticTokens) {
  const expectedNumberOfTokens = 3
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[1], 1, 8, 16, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[2], 0, 17, 20, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
}
