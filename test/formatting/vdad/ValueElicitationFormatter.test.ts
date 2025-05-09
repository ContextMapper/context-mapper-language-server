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

describe('Value elicitation formatter tests', () => {
  test('check formatting of value elicitation', async () => {
    document = await parse(`
Stakeholders {
  Stakeholder TestStakeholder
}
ValueRegister TestRegister {
  Value TestValue {
    Stakeholder TestStakeholder{
    priority HIGH
  impact=LOW
  }
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(6)
  })

  test('check indentation of value elicitation attribute', async () => {
    document = await parse(`
Stakeholders {
  Stakeholder TestStakeholder
}
ValueRegister TestRegister {
  Value TestValue {
    Stakeholder TestStakeholder {
    priority HIGH
    }
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n      ', 6, 33, 7, 4)
  })

  test('check indentation of value elicitation attribute in value cluster', async () => {
    document = await parse(`
Stakeholders {
  Stakeholder TestStakeholder
}
ValueRegister TestRegister {
  ValueCluster TestCluster {
    core "test"
    Stakeholder TestStakeholder {
    priority HIGH
    }
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n      ', 7, 33, 8, 4)
  })

  test('check indentation of value elicitation attribute in value nested in value cluster', async () => {
    document = await parse(`
Stakeholders {
  Stakeholder TestStakeholder
}
ValueRegister TestRegister {
  ValueCluster TestCluster {
    core "test"
    Value TestValue {
      Stakeholder TestStakeholder {
      priority HIGH
      }
    }
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n        ', 8, 35, 9, 6)
  })
})
