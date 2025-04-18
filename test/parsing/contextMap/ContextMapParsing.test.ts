import { createContextMapperDslServices } from '../../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'
import { parseValidInput } from '../ParsingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

describe('Context Map parsing tests', () => {
  test('parse empty context map', async () => {
    document = await parseValidInput(parse, `
      ContextMap {
      }
   `)

    expect(document.parseResult.value.contextMaps).toHaveLength(1)
    const contextMap = document.parseResult.value.contextMaps[0]
    expect(contextMap).not.toBeUndefined()
    expect(contextMap.name).toBeUndefined()
    expect(contextMap.boundedContexts).toHaveLength(0)
    expect(contextMap.type).toBeUndefined()
    expect(contextMap.state).toBeUndefined()
    expect(contextMap.relationships).toHaveLength(0)
  })

  test('parse context map with name', async () => {
    document = await parseValidInput(parse, `
      ContextMap TestMap {
      }
    `)

    expect(document.parseResult.value.contextMaps).toHaveLength(1)
    const contextMap = document.parseResult.value.contextMaps[0]
    expect(contextMap).not.toBeUndefined()
    expect(contextMap.name).toEqual('TestMap')
  })

  test('parse context map with full body', async () => {
    document = await parseValidInput(parse, `
      ContextMap TestMap {
        state = AS_IS
        type = ORGANIZATIONAL
        contains FirstContext, SecondContext
        
        FirstContext [SK] <-> [SK] SecondContext
      }
      
      BoundedContext FirstContext
      BoundedContext SecondContext
    `)

    expect(document.parseResult.value.contextMaps).toHaveLength(1)
    const contextMap = document.parseResult.value.contextMaps[0]
    expect(contextMap).not.toBeUndefined()
    expect(contextMap.name).toEqual('TestMap')
    expect(contextMap.state).toEqual('AS_IS')
    expect(contextMap.type).toEqual('ORGANIZATIONAL')
    expect(contextMap.boundedContexts).toHaveLength(2)
    expect(contextMap.relationships).toHaveLength(1)
  })

  test('parse context map contains variation', async () => {
    document = await parseValidInput(parse, `
      ContextMap TestMap {
        contains FirstContext
        contains SecondContext
      }
      
      BoundedContext FirstContext
      BoundedContext SecondContext
    `)

    expect(document.parseResult.value.contextMaps).toHaveLength(1)
    const contextMap = document.parseResult.value.contextMaps[0]
    expect(contextMap).not.toBeUndefined()
    expect(contextMap.boundedContexts).toHaveLength(2)
  })
})
