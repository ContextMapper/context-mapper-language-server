import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { EmptyFileSystem, type LangiumDocument } from 'langium'
import { expandToString as s } from 'langium/generate'
import { clearDocuments, parseHelper } from 'langium/test'
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
  // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
})

afterEach(async () => {
  document && clearDocuments(services.shared, [document])
})

describe('Linking tests', () => {
  test('linking of greetings', async () => {
    document = await parse(`
            ContextMap {
                TestContext [SK] <-> FirstContext
            }
            BoundedContext FirstContext
            BoundedContext TestContext
        `)

    expect(
      // here we first check for validity of the parsed document object by means of the reusable function
      //  'checkDocumentValid()' to sort out (critical) typos first,
      // and then evaluate the cross references we're interested in by checking
      //  the referenced AST element as well as for a potential error message;
      checkDocumentValid(document) ||
                document.parseResult.value.map?.boundedContexts.map(b => b.ref?.name || b.error?.message).join('\n')
    ).toBe(s`
            TestContext
            FirstContext
        `)
  })
})
