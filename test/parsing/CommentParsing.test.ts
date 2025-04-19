import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { clearDocuments, parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem, LangiumDocument } from 'langium'
import { afterEach, beforeAll, describe, test } from 'vitest'
import { parseValidInput } from './ParsingTestHelper.js'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>
let document: LangiumDocument<ContextMappingModel> | undefined

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

afterEach(async () => {
  document && await clearDocuments(services.shared, [document])
})

describe('Comment semantic token tests', () => {
  test('parse multiline comment at snippet start', async () => {
    document = await parseValidInput(parse, `
      /*
        This is a multiline comment
      */
      ContextMap {}
    `)
  })

  test('parse multiline comment at snippet end', async () => {
    document = await parseValidInput(parse, `
      ContextMap {}
      /*
        This is a multiline comment
      */
    `)
  })

  test('parse single-line comment at snippet start', async () => {
    document = await parseValidInput(parse, `
      // This is a single-line comment
      ContextMap {}
    `)
  })

  test('parse single-line comment at snippet end', async () => {
    document = await parseValidInput(parse, `
      ContextMap {}
      // This is a single-line comment
    `)
  })

  test('parse multiple multiline comments', async () => {
    document = await parseValidInput(parse, `
      /*
        TestContext description
      */
      BoundedContext TestContext 
      /*
        AnotherContext description
      */
      BoundedContext AnotherContext
    `)
  })

  test('parse multiple single-line comments', async () => {
    document = await parseValidInput(parse, `
      // TestContext description
      BoundedContext TestContext 
      
      // AnotherContext description
      BoundedContext AnotherContext
    `)
  })

  test('parse multiline comment in nested structure', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        /*
          This is a multiline comment
        */
        Module TestModule
      }
    `)
  })

  test('parse single-line comment in nested structure', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        // This is a multiline comment
        Module TestModule
      }
    `)
  })

  test('parse single-line comment after a field', async () => {
    document = await parseValidInput(parse, `
      BoundedContext TestContext {
        type TEAM // This is a single-line comment
      }
    `)
  })
})
