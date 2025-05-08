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

describe('Brace pair formatter tests', () => {
  test('check brace spacing', async () => {
    const document = await parse(`
BoundedContext TestContext{
 }
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(2)
    expectTextEditToEqual(textEdit[0], ' ', 1, 26, 1, 26)
    expectTextEditToEqual(textEdit[1], '\n', 1, 27, 2, 1)
  })

  test('check indentation of brace pair', async () => {
    const document = await parse(`
ValueRegister TestRegister {
  Value TestValue{}
}
    `)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(2)
    expectTextEditToEqual(textEdit[0], ' ', 2, 17, 2, 17)
    expectTextEditToEqual(textEdit[1], '\n  ', 2, 18, 2, 18)
  })
})
