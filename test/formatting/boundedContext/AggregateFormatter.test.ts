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

describe('Aggregate formatter tests', () => {
  test('check formatting of full aggregate', async () => {
    document = await parse(`
BoundedContext TestContext {
  Aggregate TestAggregate {
     responsibilities "r","e"
      userStories TestStory
   owner=TestContext
knowledgeLevel META
 likelihoodForChange NORMAL
 contentVolatility NORMAL
  availabilityCriticality HIGH
  consistencyCriticality HIGH
storageSimilarity HUGE
 securityCriticality HIGH
  securityZone="t"
      securityAccessGroup "s"
}
}
UserStory TestStory
`)
    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(18)
  })

  test('check indentation of aggregate attribute', async () => {
    document = await parse(`
BoundedContext TestContext {
  Aggregate TestAggregate {
  responsibilities "r", "e"
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n    ', 2, 27, 3, 2)
  })

  test('check indentation of aggregate attribute within module', async () => {
    document = await parse(`
BoundedContext TestContext {
  Module TestModule {
    Aggregate TestAggregate {
    responsibilities "r", "e"
    }
  }
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n      ', 3, 29, 4, 4)
  })

  test('check indentation of aggregate doc', async () => {
    document = await parse(`
BoundedContext TestContext {
    "doc"
  Aggregate TestAggregate
}
`)

    const params = createFormattingParams(document)
    const textEdit = await formatter.formatDocument(document, params)

    expect(textEdit).toHaveLength(1)
    expectTextEditToEqual(textEdit[0], '\n  ', 1, 28, 2, 4)
  })
})
