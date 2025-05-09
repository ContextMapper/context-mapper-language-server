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

describe('Action formatter tests', () => {
  test('check formatting of action', async () => {
    document = await parse(`
Stakeholders {
  Stakeholder TestStakeholder
}
ValueRegister TestRegister {
  Value TestValue {
    Stakeholder TestStakeholder {
      consequences
      good "conseq" action "t" MONITOR
    }
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n      ', 8, 19, 8, 20)
  })

  test('check formatting of action with multiple consequences', async () => {
    document = await parse(`
Stakeholders {
  Stakeholder TestStakeholder
}
ValueRegister TestRegister {
  Value TestValue {
    Stakeholder TestStakeholder {
      consequences
      good "conseq" action "t" MONITOR
      neutral "n" action "s" ACT
    }
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(2)
    expectTextEditToEqual(textEdit[0], '\n      ', 8, 19, 8, 20)
    expectTextEditToEqual(textEdit[1], '\n      ', 9, 17, 9, 18)
  })
})
