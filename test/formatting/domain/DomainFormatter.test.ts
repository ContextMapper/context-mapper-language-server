import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { Formatter } from 'langium/lsp'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { createFormattingParams } from '../FormattingTestHelper.js'

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
    expect(textEdit[0].newText).toEqual('\n  ')
    expect(textEdit[0].range.start.line).toEqual(1)
    expect(textEdit[0].range.start.character).toEqual(19)
    expect(textEdit[0].range.end.line).toEqual(2)
    expect(textEdit[0].range.end.character).toEqual(0)
  })
})
