import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { Formatter } from 'langium/lsp'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { createFormattingParams, expectTextEditToEqual } from '../FormattingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined
let formatter: Formatter

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  formatter = services.ContextMapperDsl.lsp.Formatter!
})

afterEach(async () => {
  document && await clearDocuments(services.shared, [document])
})

describe('User story formatter tests', () => {
  test('check formatting of one-feature story', async () => {
    document = await parse(`
UserStory TestStory split by OtherStory{
As a "tester" I want to create an "order" so that "ben"}
UserStory OtherStory
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(3)
    expectTextEditToEqual(textEdit[1], '\n  ', 1, 40, 2, 0)
  })

  test('check formatting of one-feature story', async () => {
    document = await parse(`
UserStory TestStory split by OtherStory {
  As a "tester" I want to create an "order" "test" an "order" so that "ben"
}
UserStory OtherStory
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(3)
    expectTextEditToEqual(textEdit[0], '\n  ', 2, 15, 2, 16)
    expectTextEditToEqual(textEdit[1], '\n  ', 2, 43, 2, 44)
    expectTextEditToEqual(textEdit[2], '\n  ', 2, 61, 2, 62)
  })
})
