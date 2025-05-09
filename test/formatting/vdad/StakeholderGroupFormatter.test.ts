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

describe('Stakeholder group formatter tests', () => {
  test('check indentation of stakeholder group stakeholders', async () => {
    document = await parse(`
Stakeholders {
  StakeholderGroup TestGroup {
  Stakeholder TestStakeholder
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n    ', 2, 30, 3, 2)
  })
})
