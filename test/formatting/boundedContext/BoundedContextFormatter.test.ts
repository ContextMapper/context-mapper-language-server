import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { Formatter } from 'langium/lsp'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
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

describe('BoundedContext formatter tests', () => {
  test('check formatting of full bounded context', async () => {
    document = await parse(`
        BoundedContext TestContext implements TestDomain realizes AnotherContext refines AnotherContext{
            domainVisionStatement "vision"
            type=TEAM
            responsibilities "resp"
            implementationTechnology "tech"
            knowledgeLevel META
            businessModel "model"
            evolution GENESIS
            
      Aggregate TestAggregate
        Module TestModule}
      
      BoundedContext AnotherContext
      Domain TestDomain
    `)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(16)
  })

  test('check formatting of out-of-line attribute', async () => {
    document = await parse(`
BoundedContext TestContext {
  domainVisionStatement "vision"
    type TEAM
}`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n  ', 2, 32, 3, 4)
  })

  test('check equals-spacing', async () => {
    document = await parse(`
BoundedContext TestContext {
  type=TEAM
}
    `)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(2)
    expectTextEditToEqual(textEdit[0], ' ', 2, 6, 2, 6)
    expectTextEditToEqual(textEdit[1], ' ', 2, 7, 2, 7)
  })
})
