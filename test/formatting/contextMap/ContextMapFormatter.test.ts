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

describe('ContextMap formatter tests', () => {
  test('check indentation of full context map', async () => {
    document = await parse(`
ContextMap{
type=UNDEFINED
    state UNDEFINED
contains TestContext
    TestContext <-> OtherContext
}
BoundedContext TestContext
BoundedContext OtherContext
    `)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(7)
  })

  test('check indentation of context map attribute', async () => {
    document = await parse(`
ContextMap {
type=UNDEFINED
}
    `)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(3)
    expect(textEdit[0].newText).toEqual('\n  ')
    expect(textEdit[0].range.start.line).toEqual(1)
    expect(textEdit[0].range.start.character).toEqual(12)
    expect(textEdit[0].range.end.line).toEqual(2)
    expect(textEdit[0].range.end.character).toEqual(0)

    expect(textEdit[1].newText).toEqual(' ')
    expect(textEdit[1].range.start.line).toEqual(2)
    expect(textEdit[1].range.start.character).toEqual(4)
    expect(textEdit[1].range.end.line).toEqual(2)
    expect(textEdit[1].range.end.character).toEqual(4)
    expect(textEdit[2].newText).toEqual(' ')
    expect(textEdit[2].range.start.line).toEqual(2)
    expect(textEdit[2].range.start.character).toEqual(5)
    expect(textEdit[2].range.end.line).toEqual(2)
    expect(textEdit[2].range.end.character).toEqual(5)
  })

  test('check relationship indentation', async () => {
    document = await parse(`
ContextMap TestMap {
TestContext <-> OtherContext
}
BoundedContext TestContext
BoundedContext OtherContext
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expect(textEdit[0].newText).toEqual('\n  ')
    expect(textEdit[0].range.start.line).toEqual(1)
    expect(textEdit[0].range.start.character).toEqual(20)
    expect(textEdit[0].range.end.line).toEqual(2)
    expect(textEdit[0].range.end.character).toEqual(0)
  })
})
