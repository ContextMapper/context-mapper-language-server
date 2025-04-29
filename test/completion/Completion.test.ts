import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { CompletionProvider } from 'langium/lsp'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { fail } from 'node:assert'

let services: ReturnType<typeof createContextMapperDslServices>
let completionProvider: CompletionProvider
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  completionProvider = services.ContextMapperDsl.lsp.CompletionProvider!
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

afterEach(async () => {
  document && await clearDocuments(services.shared, [document])
})

describe('Completion tests', () => {
  test('completion should not include elements from other documents', async () => {
    await parse(`
      BoundedContext TestContext2
    `, {
      validation: true
    })
    await parse(`
      BoundedContext TestContext3
    `)

    const docToComplete = await parse(`
      ContextMap {
        AnotherContext <-> T
      }
      BoundedContext TestContext
      BoundedContext AnotherContext
    `)

    const params = {
      textDocument: {
        uri: docToComplete.uri.path
      },
      position: {
        line: 2,
        character: 28
      }
    }
    const completionList = await completionProvider.getCompletion(docToComplete, params)
    if (completionList == null) {
      fail('Expected completion provider to return completion list')
    }
    expect(completionList.items).toHaveLength(1)
    expect(completionList.items[0].label).toEqual('TestContext')
  })
})
