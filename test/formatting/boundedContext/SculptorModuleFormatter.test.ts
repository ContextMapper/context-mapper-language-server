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

describe('Sculptor module formatter tests', () => {
  test('check formatting of full module', async () => {
    document = await parse(`
BoundedContext TestContext {
  Module TestModule{
  external
      basePackage=test.pkg
     hint = "h"
 Aggregate TestAggregate}
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(8)
  })

  test('check indentation of module aggregate', async () => {
    document = await parse(`
BoundedContext TestContext {
  Module TestModule {
 Aggregate TestAggregate
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n    ', 2, 21, 3, 1)
  })

  test('check indentation of module attribute', async () => {
    document = await parse(`
BoundedContext TestContext {
  Module TestModule {
  external
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n    ', 2, 21, 3, 2)
  })

  test('check indentation of module doc', async () => {
    document = await parse(`
BoundedContext TestContext {
"doc"
  Module TestModule
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n  ', 1, 28, 2, 0)
  })
})
