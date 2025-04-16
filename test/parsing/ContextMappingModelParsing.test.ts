import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'
import { parseValidInput } from './ParsingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

describe('ContextMappingModel tests', () => {
  test('parse empty file', async () => {
    document = await parseValidInput(parse, '')

    expect(document.parseResult.value.valueRegisters).toHaveLength(0)
    expect(document.parseResult.value.contextMaps).toHaveLength(0)
    expect(document.parseResult.value.boundedContexts).toHaveLength(0)
    expect(document.parseResult.value.domains).toHaveLength(0)
    expect(document.parseResult.value.stakeholders).toHaveLength(0)
    expect(document.parseResult.value.userRequirements).toHaveLength(0)
  })
})
