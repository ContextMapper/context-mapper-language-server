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

describe('ContextMap formatter tests', () => {
  test('check indentation of full context map', async () => {
    document = await parse(`
ContextMap{
type=UNDEFINED
    state UNDEFINED
contains TestContext
    TestContext <-> OtherContext
}
BoundedContext TestContext
BoundedContext OtherContext
    `)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(7)
  })

  test('check indentation of context map attribute', async () => {
    document = await parse(`
ContextMap {
type=UNDEFINED
}
    `)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(3)
    expectTextEditToEqual(textEdit[0], '\n  ', 1, 12, 2, 0)
    expectTextEditToEqual(textEdit[1], ' ', 2, 4, 2, 4)
    expectTextEditToEqual(textEdit[2], ' ', 2, 5, 2, 5)
  })

  test('check relationship indentation', async () => {
    document = await parse(`
ContextMap TestMap {
TestContext <-> OtherContext
}
BoundedContext TestContext
BoundedContext OtherContext
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n  ', 1, 20, 2, 0)
  })
})
