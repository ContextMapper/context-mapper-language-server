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
import { parseValidInput } from '../../parsing/ParsingTestHelper.js'

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

describe('ValueRegister semantic token tests', () => {
  test('check semantic tokens of ValueRegister without body', async () => {
    document = await parse(`
      ValueRegister TestRegister
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyValueRegister(result)
  })

  test('check semantic tokens of ValueRegister with empty body', async () => {
    document = await parse(`
      ValueRegister TestRegister {
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyValueRegister(result)
  })

  test('check semantic tokens of ValueRegister with attribute', async () => {
    document = await parse(`
      ValueRegister TestRegister for TestContext {
      }
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 6
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[2], 0, 13, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 4, 11, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of Value without body', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        Value TestValue
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyValue(result)
  })

  test('check semantic tokens of Value with empty body', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        Value TestValue {
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyValue(result)
  })

  test('check semantic tokens of Value with full body', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestValue {
          relatedValue = "relVal"
          isCore
          opposingValue "oppo"
          demonstrator = "dem"
          
          Stakeholder TestStakeholder
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 16
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[5], 1, 8, 5, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[6], 0, 6, 9, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)

    expectSemanticTokensToEqual(tokens[7], 1, 10, 12, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 15, 8, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[9], 1, 10, 6, semanticTokenProvider.tokenTypes.keyword, 0)

    expectSemanticTokensToEqual(tokens[10], 1, 10, 13, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[11], 0, 14, 6, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[12], 1, 10, 12, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[13], 0, 15, 5, semanticTokenProvider.tokenTypes.string, 0)
  })

  test('check semantic tokens of ValueCluster without body', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        ValueCluster TestValueCluster
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyValueCluster(result)
  })

  test('check semantic tokens of ValueCluster with empty body', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        ValueCluster TestValueCluster {
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyValueCluster(result)
  })

  test('check semantic tokens of ValueCluster with full body', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        ValueCluster TestCluster {
          core "testCore"
          relatedValue = "relVal"
          demonstrator = "dem"
          opposingValue "oppo"
          
          Stakeholder TestStakeholder
          Value TestValue
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 19
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[7], 1, 10, 4, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 5, 10, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[9], 1, 10, 12, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[10], 0, 15, 8, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[11], 1, 10, 12, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[12], 0, 15, 5, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[13], 1, 10, 13, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[14], 0, 14, 6, semanticTokenProvider.tokenTypes.string, 0)
  })

  test('check semantic tokens of ValueCluster with coreValue7000', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        ValueCluster TestCluster {
          core CARE
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const numberOfExpectedTokens = 6
    expectSemanticTokensToHaveLength(result, numberOfExpectedTokens)
    const tokens = extractSemanticTokens(result, numberOfExpectedTokens)

    expectSemanticTokensToEqual(tokens[4], 1, 10, 4, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 5, 4, semanticTokenProvider.tokenTypes.enumMember, 0)
  })

  test('check semantic tokens of ValueEpic without body', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        ValueEpic TestValueEpic
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyValueEpic(result)
  })

  test('check semantic tokens of ValueEpic without body', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        ValueEpic TestValueEpic {
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyValueEpic(result)
  })

  test('check semantic tokens of ValueEpic with full body', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        ValueEpic TestEpic {
          As a TestStakeholder I value "val" as demonstrated in
          reduction of "redVal1"
          realization of "relVal1"
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 16
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[7], 1, 10, 4, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 5, 15, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[9], 0, 16, 7, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[10], 0, 8, 5, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[11], 0, 6, 18, semanticTokenProvider.tokenTypes.keyword, 0)

    expectSemanticTokensToEqual(tokens[12], 1, 10, 12, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[13], 0, 13, 9, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[14], 1, 10, 14, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[15], 0, 15, 9, semanticTokenProvider.tokenTypes.string, 0)
  })

  test('check semantic tokens of ValueNarrative', async () => {
    document = await parse(`
      ValueRegister TestRegister {
        ValueNarrative TestNarrative {
          When the SOI executes "feat",
          stakeholders expect it to promote, protect or create "promoValue",
          possibly degrading or prohibiting "harmValue"
          with the following externally observable and/or internally auditable behavior: "conditions"
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 12
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[4], 1, 10, 21, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 22, 6, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[6], 1, 10, 52, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[7], 0, 53, 12, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[8], 1, 10, 33, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[9], 0, 34, 11, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[10], 1, 10, 78, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[11], 0, 79, 12, semanticTokenProvider.tokenTypes.string, 0)
  })

  test('check semantic tokens of ValueWeighting', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        ValueWeighting TestWeighting {
          In the context of the SOI,
          stakeholder TestStakeholder values "val1" more than "val2"
          expecting benefits such as "benefits"
          running the risk of harms such as "harms"
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 18
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[5], 1, 8, 14, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[6], 0, 15, 13, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)

    expectSemanticTokensToEqual(tokens[7], 1, 10, 26, semanticTokenProvider.tokenTypes.keyword, 0)

    expectSemanticTokensToEqual(tokens[8], 1, 10, 11, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[9], 0, 12, 15, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[10], 0, 16, 6, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[11], 0, 7, 6, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[12], 0, 7, 9, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[13], 0, 10, 6, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[14], 1, 10, 26, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[15], 0, 27, 10, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[16], 1, 10, 33, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[17], 0, 34, 7, semanticTokenProvider.tokenTypes.string, 0)
  })

  test('check semantic tokens of ValueElicitation without body', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestVal {
          Stakeholder TestStakeholder
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyValueElicitation(result)
  })

  test('check semantic tokens of ValueElicitation with empty body', async () => {
    document = await parse(`
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestVal {
          Stakeholder TestStakeholder {
          }
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    expectEmptyValueElicitation(result)
  })

  test('check semantic tokens of ValueElicitation with full body', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestVal {
          Stakeholder TestStakeholder {
            impact = MEDIUM
            consequences good "conseq"
            priority = LOW
          }
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 16
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[9], 1, 12, 6, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[10], 0, 9, 6, semanticTokenProvider.tokenTypes.enumMember, 0)

    expectSemanticTokensToEqual(tokens[11], 1, 12, 12, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[12], 0, 13, 4, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[13], 0, 5, 8, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[14], 1, 12, 8, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[15], 0, 11, 3, semanticTokenProvider.tokenTypes.enumMember, 0)
  })

  test('check semantic tokens of ValueElicitation with Consequence Action', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestVal {
          Stakeholder TestStakeholder {
            impact = MEDIUM
            consequences good "conseq" action "do" ACT
            priority = LOW
          }
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 19
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[14], 0, 9, 6, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[15], 0, 7, 4, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[16], 0, 5, 3, semanticTokenProvider.tokenTypes.keyword, 0)
  })

  test('check semantic tokens of ValueElicitation with Consequence Action using custom type', async () => {
    document = await parseValidInput(parse, `
      Stakeholders {
        Stakeholder TestStakeholder
      }
      ValueRegister TestRegister {
        Value TestVal {
          Stakeholder TestStakeholder {
            impact = MEDIUM
            consequences good "conseq" action "do" "TEST"
            priority = LOW
          }
        }
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 19
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[14], 0, 9, 6, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[15], 0, 7, 4, semanticTokenProvider.tokenTypes.string, 0)
    expectSemanticTokensToEqual(tokens[16], 0, 5, 6, semanticTokenProvider.tokenTypes.string, 0)
  })
})

function expectEmptyValueRegister (result: SemanticTokens) {
  const expectedNumberOfTokens = 2
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[0], 1, 6, 13, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[1], 0, 14, 12, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
}

function expectEmptyValue (result: SemanticTokens) {
  const expectedNumberOfTokens = 4
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[2], 1, 8, 5, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[3], 0, 6, 9, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
}

function expectEmptyValueCluster (result: SemanticTokens) {
  const expectedNumberOfTokens = 4
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[2], 1, 8, 12, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[3], 0, 13, 16, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
}

function expectEmptyValueEpic (result: SemanticTokens) {
  const expectedNumberOfTokens = 4
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[2], 1, 8, 9, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[3], 0, 10, 13, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)
}

function expectEmptyValueElicitation (result: SemanticTokens) {
  const expectedNumberOfTokens = 9
  expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
  const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

  expectSemanticTokensToEqual(tokens[7], 1, 10, 11, semanticTokenProvider.tokenTypes.keyword, 0)
  expectSemanticTokensToEqual(tokens[8], 0, 12, 15, semanticTokenProvider.tokenTypes.type, 0)
}
