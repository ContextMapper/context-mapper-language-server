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

describe('UseCaseValidationProvider tests', () => {
  test('accept one actor', async () => {
    document = await parse(`
      UseCase TestUseCase {
        actor "Test Actor"
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple actors', async () => {
    document = await parse(`
      UseCase TestUseCase {
        actor "Test Actor"
        actor "Test Actor"
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })

  test('accept one benefit', async () => {
    document = await parse(`
      UseCase TestUseCase {
        benefit "Test Benefit"
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple benefits', async () => {
    document = await parse(`
      UseCase TestUseCase {
        benefit "Test Benefit"
        benefit "Test Benefit"
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })

  test('accept one scope', async () => {
    document = await parse(`
      UseCase TestUseCase {
        scope "Test Scope"
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple scopes', async () => {
    document = await parse(`
      UseCase TestUseCase {
        scope "Test Scope"
        scope "Test Scope"
      }
    `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })

  test('accept one level', async () => {
    document = await parse(`
      UseCase TestUseCase {
        level "Test Level"
      }
    `)

    expect(document.diagnostics).toHaveLength(0)
  })

  test('report multiple levels', async () => {
    document = await parse(`
      UseCase TestUseCase {
        level "Test Level"
        level "Test Level"
      }
   `)

    expect(document.diagnostics).toHaveLength(1)
    expect(document.diagnostics![0].range.start.line).toEqual(2)
  })
})
