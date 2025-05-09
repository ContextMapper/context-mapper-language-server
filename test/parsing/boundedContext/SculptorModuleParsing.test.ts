import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel, SculptorModule } from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'
import { parseValidInput } from '../../ParsingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(() => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

describe('Sculptor module parsing tests', () => {
  test('parse module without body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        Module TestModule
      }
    `)

    expect(document.parseResult.value.boundedContexts).toHaveLength(1)
    expect(document.parseResult.value.boundedContexts[0].modules).toHaveLength(1)
    const module = document.parseResult.value.boundedContexts[0].modules[0]
    expectEmptyModule(module)
  })

  test('parse module with empty body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        Module TestModule {
        }
      }
    `)

    expect(document.parseResult.value.boundedContexts).toHaveLength(1)
    expect(document.parseResult.value.boundedContexts[0].modules).toHaveLength(1)
    const module = document.parseResult.value.boundedContexts[0].modules[0]
    expectEmptyModule(module)
  })

  test('parse module with full body', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        "doc"
        Module TestModule {
          hint = "hint"
          external
          basePackage = base.package
          Aggregate SecondAggregate
        }
      }
    `)

    expect(document.parseResult.value.boundedContexts).toHaveLength(1)
    expect(document.parseResult.value.boundedContexts[0].modules).toHaveLength(1)
    const module = document.parseResult.value.boundedContexts[0].modules[0]
    expect(module.doc).toEqual('doc')
    expect(module.name).toEqual('TestModule')
    expect(module.external).toEqual(['external'])
    expect(module.basePackage).toEqual(['base.package'])
    expect(module.hint).toEqual(['hint'])
    expect(module.aggregates).toHaveLength(1)
  })
})

function expectEmptyModule (module: SculptorModule): void {
  expect(module).not.toBeUndefined()
  expect(module.name).toEqual('TestModule')
  expect(module.doc).toBeUndefined()
  expect(module.external).toHaveLength(0)
  expect(module.basePackage).toHaveLength(0)
  expect(module.hint).toHaveLength(0)
  expect(module.aggregates).toHaveLength(0)
}
