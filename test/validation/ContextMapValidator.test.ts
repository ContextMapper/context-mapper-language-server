import { beforeAll, describe, expect, test } from 'vitest'
import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { EmptyFileSystem, type LangiumDocument } from 'langium'
import { parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(() => {
  services = createContextMapperDslServices(EmptyFileSystem)
  const doParse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  parse = (input: string) => doParse(input, { validation: true })
})

describe('ContextMapValidationProvider tests', () => {
  test('accept no attribute', async () => {
    document = await parse(`
      ContextMap {
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('accept one type attribute', async () => {
    document = await parse(`
      ContextMap {
        type UNDEFINED
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('accept one state attribute', async () => {
    document = await parse(`
      ContextMap {
        state AS_IS
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple type attributes', async () => {
    document = await parse(`
      ContextMap {
        type UNDEFINED
        type SYSTEM_LANDSCAPE
      }
    `)

    expect(document.diagnostics).not.toBeUndefined()
    expect(document.diagnostics).toHaveLength(1)
    const diagnostic = document.diagnostics![0]
    expect(diagnostic.range.start.line).toEqual(2)
  })

  test('report multiple state attributes', async () => {
    document = await parse(`
      ContextMap {
        state AS_IS
        state TO_BE
      }
    `)

    expect(document.diagnostics).not.toBeUndefined()
    expect(document.diagnostics).toHaveLength(1)
    const diagnostic = document.diagnostics![0]
    expect(diagnostic.range.start.line).toEqual(2)
  })
})
