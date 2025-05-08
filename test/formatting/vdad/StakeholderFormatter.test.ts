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

describe('Stakeholder formatter tests', () => {
  test('check formatting of full stakeholder', async () => {
    document = await parse(`
Stakeholders {
  Stakeholder TestStakeholder{
  influence=HIGH
      interest MEDIUM
     description = "des"
}
}
`)

    const params = createFormattingParams(document)
    const textEdit = formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(7)
  })

  test('check indentation of stakeholder attribute', async () => {
    document = await parse(`
Stakeholders {
  Stakeholder TestStakeholder {
  influence HIGH
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n    ', 2, 31, 3, 2)
  })

  test('check indentation of stakeholder attribute in stakeholder group', async () => {
    document = await parse(`
Stakeholders {
  StakeholderGroup TestGroup {
    Stakeholder TestStakeholder {
    influence HIGH
    }
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n      ', 3, 33, 4, 4)
  })
})
