import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { CompletionProvider } from 'langium/lsp'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { fail } from 'node:assert'
import { uinteger } from 'vscode-languageserver-types'

let services: ReturnType<typeof createContextMapperDslServices>
let completionProvider: CompletionProvider
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  completionProvider = services.ContextMapperDsl.lsp.CompletionProvider!
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

afterEach(async () => {
  await clearDocuments(services.shared, services.shared.workspace.LangiumDocuments.all.toArray())
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

    const params = createCompletionParams(docToComplete, 2, 28)
    const completionList = await completionProvider.getCompletion(docToComplete, params)
    if (completionList == null) {
      fail('Expected completion provider to return completion list')
      return
    }
    expect(completionList.items).toHaveLength(1)
    expect(completionList.items[0].label).toEqual('TestContext')
  })

  test('check completion of bounded context property', async () => {
    const documentToComplete = await parse(`
      BoundedContext TestContext {
        typ
      }
    `)

    const params = createCompletionParams(documentToComplete, 2, 11)
    const completionList = await completionProvider.getCompletion(documentToComplete, params)
    if (completionList == null) {
      fail('Expected completion provider to return completion list')
      return
    }
    expect(completionList.items).toHaveLength(1)
    expect(completionList.items[0].label).toEqual('type')
  })

  test('check completion of bounded context property with existing property', async () => {
    const documentToComplete = await parse(`
      ContextMap {
        state UNDEFINED
        ty
      }
    `)

    const params = createCompletionParams(documentToComplete, 3, 10)
    const completionList = await completionProvider.getCompletion(documentToComplete, params)
    if (completionList == null) {
      fail('Expected completion provider to return completion list')
      return
    }
    expect(completionList.items).toHaveLength(1)
    expect(completionList.items[0].label).toEqual('type')
  })

  test('check completion of relationship arrows', async () => {
    const docToComplete = await parse(`
      ContextMap {
        AnotherContext 
      }
      BoundedContext TestContext
      BoundedContext AnotherContext
    `)

    const params = createCompletionParams(docToComplete, 2, 23)
    const completionList = await completionProvider.getCompletion(docToComplete, params)
    if (completionList == null) {
      fail('Expected completion provider to return completion list')
      return
    }

    const suggestions = completionList.items.map(item => item.label)
    expect(suggestions).toContain('<->')
  })
})

function createCompletionParams (document: LangiumDocument<ContextMappingModel>, positionLine: uinteger, positionChar: uinteger): any {
  return {
    textDocument: {
      uri: document.uri.path
    },
    position: {
      line: positionLine,
      character: positionChar
    }
  }
}
