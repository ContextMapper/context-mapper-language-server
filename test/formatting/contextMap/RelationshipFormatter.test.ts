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

beforeAll(() => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  formatter = services.ContextMapperDsl.lsp.Formatter!
})

afterEach(async () => {
  if (document) await clearDocuments(services.shared, [document])
})

describe('Relationship formatter tests', () => {
  test('check indentation of full relationship', async () => {
    document = await parse(`
ContextMap {
  OtherContext<->TestContext: RelName{
  implementationTechnology="tec"
}
}
BoundedContext TestContext
BoundedContext OtherContext
`)

    const params = createFormattingParams(document)
    const textEdit = formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(8)
  })

  test('check indentation of relationship attribute', async () => {
    document = await parse(`
ContextMap {
  OtherContext <-> TestContext {
implementationTechnology "tec"
  }
}
BoundedContext TestContext
BoundedContext OtherContext
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n    ', 2, 32, 3, 0)
  })

  test('check spacing in relationship', async () => {
    document = await parse(`
ContextMap {
  OtherContext[U,OHS]->[D]TestContext
}
BoundedContext TestContext
BoundedContext OtherContext
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(3)
    expectTextEditToEqual(textEdit[0], ' ', 2, 17, 2, 17)
    expectTextEditToEqual(textEdit[1], ' ', 2, 21, 2, 21)
    expectTextEditToEqual(textEdit[2], ' ', 2, 23, 2, 23)
  })
})
