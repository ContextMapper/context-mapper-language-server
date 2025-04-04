import { beforeAll, describe, expect, test } from 'vitest'
import { EmptyFileSystem, type LangiumDocument } from 'langium'
import { parseHelper } from 'langium/test'
import { createContextMapperDslServices } from '../../src/language/context-mapper-dsl-module.js'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { checkDocumentValid } from '../TestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)

  // activate the following if your linking test requires elements from a built-in library, for example
  // await services.shared.workspace.WorkspaceManager.initializeWorkspace([])
})

describe('Parsing tests', () => {
  test('parse simple model', async () => {
    document = await parse(`
            BoundedContext FirstContext
    `)

    const errors = checkDocumentValid(document)
    expect(errors == null).toBeTruthy()

    expect(document.parseResult.value?.boundedContexts?.map(b => b.name))
      .toEqual(['FirstContext'])
  })
})
