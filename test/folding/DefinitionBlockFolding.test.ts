import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { FoldingRangeProvider } from 'langium/lsp'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { parseValidInput } from '../ParsingTestHelper.js'
import { FoldingRangeParams } from 'vscode-languageserver'

let services: ReturnType<typeof createContextMapperDslServices>
let foldingRangeProvider: FoldingRangeProvider
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(() => {
  services = createContextMapperDslServices(EmptyFileSystem)
  foldingRangeProvider = services.ContextMapperDsl.lsp.FoldingRangeProvider!
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

afterEach(async () => {
  if (document) await clearDocuments(services.shared, [document])
})

describe('Definition block folding tests', () => {
  test('check folding range of definition without body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext
    `)

    const params = createFoldingRangeParams(document)
    const foldingRanges = await foldingRangeProvider.getFoldingRanges(document, params)
    expect(foldingRanges).toHaveLength(0)
  })

  test('check folding range of definition with one line body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
      }
    `)

    const params = createFoldingRangeParams(document)
    const foldingRanges = await foldingRangeProvider.getFoldingRanges(document, params)
    expect(foldingRanges).toHaveLength(0)
  })

  test('check folding range of definition with two line body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        type TEAM
      }
    `)

    const params = createFoldingRangeParams(document)
    const foldingRanges = await foldingRangeProvider.getFoldingRanges(document, params)
    expect(foldingRanges).toHaveLength(1)
    expect(foldingRanges[0].startLine).toEqual(1)
    expect(foldingRanges[0].startCharacter).toEqual(34)
    expect(foldingRanges[0].endLine).toEqual(2)
    expect(foldingRanges[0].endCharacter).toEqual(17)
  })
})

function createFoldingRangeParams (document: LangiumDocument<ContextMappingModel>): FoldingRangeParams {
  return {
    textDocument: {
      uri: document.uri.path
    }
  }
}
