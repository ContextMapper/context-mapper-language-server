import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  const doParse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
  parse = (input: string) => doParse(input, { validation: true })
})

describe('SculptorModuleValidationProvider tests', () => {
  test('accept one external attribute', async () => {
    document = await parse(`
      BoundedContext TextContext {
        Module TestModule {
          external
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple external attributes', async () => {
    document = await parse(`
      BoundedContext TextContext {
        Module TestModule {
          external
          external
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one basePackage', async () => {
    document = await parse(`
      BoundedContext TextContext {
        Module TestModule {
          basePackage = test.package
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple basePackages', async () => {
    document = await parse(`
      BoundedContext TextContext {
        Module TestModule {
          basePackage = test.package
          basePackage = test.package
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })

  test('accept one hint', async () => {
    document = await parse(`
      BoundedContext TextContext {
        Module TestModule {
          hint = "hint"
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple hints', async () => {
    document = await parse(`
      BoundedContext TextContext {
        Module TestModule {
          hint = "hint"
          hint = "hint"
        }
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(3)
  })
})
