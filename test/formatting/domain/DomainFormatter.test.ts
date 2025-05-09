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

describe('Domain formatter tests', () => {
  test('check indentation of full domain', async () => {
    document = await parse(`
Domain TestDomain{
 domainVisionStatement "d"
    Subdomain TestSubdomain
}
  
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(3)
  })

  test('check subdomain indentation', async () => {
    document = await parse(`
Domain TestDomain {
Subdomain TestSubdomain
}
    `)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n  ', 1, 19, 2, 0)
  })
})
