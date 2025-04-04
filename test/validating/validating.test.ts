import { beforeAll, describe, expect, test } from 'vitest'
import { EmptyFileSystem, type LangiumDocument } from 'langium'
import { parseHelper } from 'langium/test'
import type { Diagnostic } from 'vscode-languageserver-types'
import { createContextMapperDslServices } from '../../src/language/context-mapper-dsl-module.js'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { checkDocumentValid } from '../TestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  const doParse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  parse = (input: string) => doParse(input, { validation: true })

  // activate the following if your linking test requires elements from a built-in library, for example
  // await services.shared.workspace.WorkspaceManager.initializeWorkspace([]);
})

describe('Validating', () => {
  test('check no errors', async () => {
    document = await parse(`
            BoundedContext Test
    `)

    const errors = checkDocumentValid(document)
    expect(errors == null).toBeTruthy()

    expect(document?.diagnostics?.map(diagnosticToString)).toHaveLength(0)
  })
})

function diagnosticToString (d: Diagnostic) {
  return `[${d.range.start.line}:${d.range.start.character}..${d.range.end.line}:${d.range.end.character}]: ${d.message}`
}
