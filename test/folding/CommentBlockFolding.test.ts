import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { FoldingRangeProvider } from 'langium/lsp'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { parseValidInput } from '../ParsingTestHelper.js'
import { FoldingRangeParams } from 'vscode-languageserver'

let services: ReturnType<typeof createContextMapperDslServices>
let foldingRangeProvider: FoldingRangeProvider
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  foldingRangeProvider = services.ContextMapperDsl.lsp.FoldingRangeProvider!
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

afterEach(async () => {
  document && await clearDocuments(services.shared, [document])
})

describe('Comment block folding tests', () => {
  test('check folding range of comment block', async () => {
    document = await parseValidInput(parse, `
      /*
      This is a comment block
      */
      BoundedContext TestContext
    `)

    const params = createFoldingRangeParams(document)
    const foldingRanges = await foldingRangeProvider.getFoldingRanges(document, params)
    expect(foldingRanges).toHaveLength(1)
    expect(foldingRanges[0].startLine).toEqual(1)
    expect(foldingRanges[0].startCharacter).toEqual(8)
    expect(foldingRanges[0].endLine).toEqual(3)
    expect(foldingRanges[0].endCharacter).toEqual(0)
  })

  test('check folding range of multiline comment', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        /* This is a
          looooonger
          multiline comment
        */
        Aggregate TestAggregate
      }
    `)

    const params = createFoldingRangeParams(document)
    const foldingRanges = await foldingRangeProvider.getFoldingRanges(document, params)
    expect(foldingRanges).toHaveLength(2)
    expect(foldingRanges[1].startLine).toEqual(2)
    expect(foldingRanges[1].startCharacter).toEqual(20)
    expect(foldingRanges[1].endLine).toEqual(5)
    expect(foldingRanges[1].endCharacter).toEqual(0)
  })

  test('check folding range of single-line comment', async () => {
    document = await parseValidInput(parse, `
      // This is a single-line comment
      BoundedContext TestContext
    `)

    const params = createFoldingRangeParams(document)
    const foldingRanges = await foldingRangeProvider.getFoldingRanges(document, params)
    expect(foldingRanges).toHaveLength(0)
  })

  test('check folding range of single line comment block', async () => {
    document = await parseValidInput(parse, `
      /* This is a single-line comment */
      BoundedContext TestContext
    `)

    const params = createFoldingRangeParams(document)
    const foldingRanges = await foldingRangeProvider.getFoldingRanges(document, params)
    expect(foldingRanges).toHaveLength(0)
  })
})

function createFoldingRangeParams (document: LangiumDocument<ContextMappingModel>): FoldingRangeParams {
  return {
    textDocument: {
      uri: document.uri.path
    }
  }
}
