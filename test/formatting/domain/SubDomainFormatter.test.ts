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

describe('Subdomain formatter tests', () => {
  test('check indentation of full subdomain', async () => {
    document = await parse(`
Domain TestDomain {
  Subdomain TestSubdomain supports TestCase,TestStory{
  type=UNDEFINED
      domainVisionStatement "d"
  }
}
UseCase TestCase
UserStory TestStory
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(6)
  })

  test('check indentation of subdomain attribute', async () => {
    document = await parse(`
Domain TestDomain {
  Subdomain TestSubdomain {
  type UNDEFINED
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expect(textEdit[0].newText).toEqual('\n    ')
    expect(textEdit[0].range.start.line).toEqual(2)
    expect(textEdit[0].range.start.character).toEqual(27)
    expect(textEdit[0].range.end.line).toEqual(3)
    expect(textEdit[0].range.end.character).toEqual(2)
  })
})
