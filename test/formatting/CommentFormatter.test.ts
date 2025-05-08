import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { Formatter } from 'langium/lsp'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { createFormattingParams, expectTextEditToEqual } from './FormattingTestHelper.js'

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

describe('Comment formatter tests', () => {
  test('check formatting of top-level single-comment', async () => {
    document = await parse(`
   // Value Registry
   ValueRegister TestRegister
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(2)
    expectTextEditToEqual(textEdit[0], '', 1, 0, 1, 3)
  })

  test('check formatting of top-level multiline comment', async () => {
    document = await parse(`
  /*
   * Value Registry
  */
  ValueRegister TestRegister
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(4)
    expectTextEditToEqual(textEdit[0], '', 1, 0, 1, 2)
    expectTextEditToEqual(textEdit[1], '', 2, 0, 2, 2)
    expectTextEditToEqual(textEdit[2], '', 3, 0, 3, 2)
  })

  test('check formatting of nested single-line comment', async () => {
    document = await parse(`
ValueRegister TestRegister {
    // Value Test
    Value TestValue
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(2)
    expectTextEditToEqual(textEdit[0], '', 2, 0, 2, 4)
  })

  test('check formatting of nested multiline comment', async () => {
    document = await parse(`
ValueRegister TestRegister {
      /*
       Test Value
      */
      Value Test
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(4)
    expectTextEditToEqual(textEdit[0], '', 2, 0, 2, 6)
    expectTextEditToEqual(textEdit[1], '', 3, 0, 3, 6)
    expectTextEditToEqual(textEdit[2], '', 4, 0, 4, 6)
  })
})
