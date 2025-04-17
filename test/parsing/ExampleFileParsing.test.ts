import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { parseHelper } from 'langium/test'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { EmptyFileSystem } from 'langium'
import { beforeAll, describe, expect, test } from 'vitest'
import fs from 'fs'
import { parseValidInput } from './ParsingTestHelper.js'
import path from 'node:path'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>

beforeAll(async () => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

describe('Example file parsing tests', () => {
  test('Parse example files', async () => {
    const dir = path.resolve(__dirname, 'example-files')
    fs.readdir(dir, (err, files) => {
      expect(err).toBeNull()
      files.forEach(file => {
        fs.readFile(path.resolve(dir, file), { encoding: 'utf8' }, async (err, data) => {
          console.log('test parsing of file:', file)
          expect(err).toBeNull()
          await parseValidInput(parse, data)
        })
      })
    })
  })
})
