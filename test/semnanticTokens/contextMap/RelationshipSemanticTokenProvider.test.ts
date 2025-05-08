import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { SemanticTokenProvider } from 'langium/lsp'
import { afterEach, beforeAll, describe, test } from 'vitest'
import { parseValidInput } from '../../ParsingTestHelper.js'
import {
  createSemanticTokenParams, expectSemanticTokensToEqual,
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

describe('Relationship semantic token tests', () => {
  test('check semantic tokens of Partnership with full body', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [P] <-> [P] FirstContext : RelName {
            implementationTechnology "Java"
          }
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 13
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 13, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 3, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 5, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 3, 12, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[6], 0, 15, 7, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)

    expectSemanticTokensToEqual(tokens[7], 1, 12, 24, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 25, 6, semanticTokenProvider.tokenTypes.string, 0)
  })

  test('check semantic tokens of Partnership variation 1', async () => {
    document = await parse(`
      ContextMap {
          TestContext [P] <-> [P] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 10
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 13, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 3, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 5, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 3, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of Partnership variation 2', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          [P] TestContext <-> [P] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 10
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 11, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 3, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 12, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 5, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 3, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of Partnership variation 3', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [P] <-> FirstContext [P]
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 10
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 13, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 3, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 4, 12, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 14, 1, semanticTokenProvider.tokenTypes.keyword, 0)
  })

  test('check semantic tokens of Partnership variation 4', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          [P] TestContext <-> FirstContext [P]
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 10
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 11, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 3, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 12, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 4, 12, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 14, 1, semanticTokenProvider.tokenTypes.keyword, 0)
  })

  test('check semantic tokens of Partnership variation 5', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext Partnership FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 8
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 12, 11, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 12, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of SharedKernel with full body', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext <-> FirstContext : RelName {
            implementationTechnology "Java"
          }
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 11
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 12, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 4, 12, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 15, 7, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)

    expectSemanticTokensToEqual(tokens[5], 1, 12, 24, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[6], 0, 25, 6, semanticTokenProvider.tokenTypes.string, 0)
  })

  test('check semantic tokens of SharedKernel variation 1', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [SK] <-> [SK] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 10
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 13, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 4, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 5, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 4, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of SharedKernel variation 2', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          [SK] TestContext <-> [SK] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 10
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 11, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 4, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 12, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 5, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 4, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of SharedKernel variation 3', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [SK] <-> FirstContext [SK]
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 10
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 13, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 4, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 4, 12, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 14, 2, semanticTokenProvider.tokenTypes.keyword, 0)
  })

  test('check semantic tokens of SharedKernel variation 4', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          [SK] TestContext <-> FirstContext [SK]
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 10
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 11, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 4, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 12, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 4, 12, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 14, 2, semanticTokenProvider.tokenTypes.keyword, 0)
  })

  test('check semantic tokens of SharedKernel variation 5', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext Shared-Kernel FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 8
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 12, 13, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 14, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of SharedKernel variation 6', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext <-> FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 8
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 12, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 4, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of CustomSupplier relationship with full body', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [S,OHS] -> [C,CF] FirstContext : RelName {
            implementationTechnology "Java"
            downstreamRights INFLUENCER
            exposedAggregates = TestAggregate
          }
      }
      BoundedContext FirstContext
      BoundedContext TestContext {
        Aggregate TestAggregate
      }
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 21
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 13, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 2, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 5, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 4, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[6], 0, 2, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[7], 0, 4, 12, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 15, 7, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)

    expectSemanticTokensToEqual(tokens[9], 1, 12, 24, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[10], 0, 25, 6, semanticTokenProvider.tokenTypes.string, 0)

    expectSemanticTokensToEqual(tokens[11], 1, 12, 16, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[12], 0, 17, 10, semanticTokenProvider.tokenTypes.enumMember, 0)

    expectSemanticTokensToEqual(tokens[13], 1, 12, 17, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[14], 0, 20, 13, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of CustomerSupplier variation 1', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [S] -> [C] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 10
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 13, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 3, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 4, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 3, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of CustomerSupplier variation 2', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [C] <- [S] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 10
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 13, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 3, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 4, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 3, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of CustomerSupplier variation 3', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext Customer-Supplier FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 8
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 12, 17, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 18, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of CustomerSupplier variation 4', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext Supplier-Customer FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 8
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 12, 17, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 18, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of UpstreamDownstream relationship with full body', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [U,OHS] -> [D,CF] FirstContext : RelName {
            downstreamRights INFLUENCER
            exposedAggregates = TestAggregate
            implementationTechnology "Java"
          }
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 19
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 13, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 2, 3, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 5, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 4, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[6], 0, 2, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[7], 0, 4, 12, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[8], 0, 15, 7, semanticTokenProvider.tokenTypes.type, semanticTokenProvider.tokenModifiers.declaration)

    expectSemanticTokensToEqual(tokens[9], 1, 12, 16, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[10], 0, 17, 10, semanticTokenProvider.tokenTypes.enumMember, 0)

    expectSemanticTokensToEqual(tokens[11], 1, 12, 17, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[12], 0, 20, 13, semanticTokenProvider.tokenTypes.type, 0)

    expectSemanticTokensToEqual(tokens[13], 1, 12, 24, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[14], 0, 25, 6, semanticTokenProvider.tokenTypes.string, 0)
  })

  test('check semantic tokens of UpstreamDownstream variation 1', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [U] -> [D] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 10
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 13, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 3, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 4, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 3, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of UpstreamDownstream variation 2', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext [D] <- [U] FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 10
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 13, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 3, 2, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[4], 0, 4, 1, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[5], 0, 3, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of UpstreamDownstream variation 3', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext Upstream-Downstream FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 8
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 12, 19, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 20, 12, semanticTokenProvider.tokenTypes.type, 0)
  })

  test('check semantic tokens of UpstreamDownstream variation 4', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
          TestContext Downstream-Upstream FirstContext
      }
      BoundedContext FirstContext
      BoundedContext TestContext
    `)
    const params = createSemanticTokenParams(document)

    const result = await semanticTokenProvider.semanticHighlight(document, params)

    const expectedNumberOfTokens = 8
    expectSemanticTokensToHaveLength(result, expectedNumberOfTokens)
    const tokens = extractSemanticTokens(result, expectedNumberOfTokens)

    expectSemanticTokensToEqual(tokens[1], 1, 10, 11, semanticTokenProvider.tokenTypes.type, 0)
    expectSemanticTokensToEqual(tokens[2], 0, 12, 19, semanticTokenProvider.tokenTypes.keyword, 0)
    expectSemanticTokensToEqual(tokens[3], 0, 20, 12, semanticTokenProvider.tokenTypes.type, 0)
  })
})
