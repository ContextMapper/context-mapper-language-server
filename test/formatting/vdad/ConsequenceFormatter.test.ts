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

describe('Consequence formatter tests', () => {
  test('check formatting of consequence', async () => {
    document = await parse(`
Stakeholders {
  Stakeholder TestStakeholder
}
ValueRegister TestRegister {
  Value TestValue {
    Stakeholder TestStakeholder {
      consequences good "conseq"
    }
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n      ', 7, 18, 7, 19)
  })

  test('check formatting of multiple consequences', async () => {
    document = await parse(`
Stakeholders {
  Stakeholder TestStakeholder
}
ValueRegister TestRegister {
  Value TestValue {
    Stakeholder TestStakeholder {
      consequences good "conseq"
        neutral "n"
    }
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(2)
    expectTextEditToEqual(textEdit[0], '\n      ', 7, 18, 7, 19)
    expectTextEditToEqual(textEdit[1], '\n      ', 7, 32, 8, 8)
  })
})
