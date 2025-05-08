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

describe('ContextMappingModel formatter tests', () => {
  test('check formatting of full model', async () => {
    document = await parse(`
  ContextMap {
}
BoundedContext TestContext
    Domain TestDomain
  ValueRegister TestRegister {
  }
  Stakeholders {
}
  UseCase TestUseCase
    UserStory TestStory
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(7)
    expectTextEditToEqual(textEdit[0], '\n', 0, 0, 1, 2)
  })

  test('check indentation of top-level element', async () => {
    document = await parse(`
    BoundedContext TestContext
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n', 0, 0, 1, 4)
  })
})
