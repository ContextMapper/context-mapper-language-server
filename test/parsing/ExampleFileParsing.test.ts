import {createContextMapperDslServices} from '../../src/language/ContextMapperDslModule.js'
import {parseHelper} from 'langium/test'
import {ContextMappingModel} from '../../src/language/generated/ast.js'
import {EmptyFileSystem} from 'langium'
import {beforeAll, describe, test} from 'vitest'
import fs from 'fs'
import {parseValidInput} from '../ParsingTestHelper.js'
import path from 'node:path'

let services: ReturnType<typeof createContextMapperDslServices>
let parse: ReturnType<typeof parseHelper<ContextMappingModel>>

beforeAll(() => {
  services = createContextMapperDslServices(EmptyFileSystem)
  parse = parseHelper<ContextMappingModel>(services.ContextMapperDsl)
})

describe('Example file parsing tests', () => {
  test('Parse example files', async () => {
    const exampleFiles = await getFiles(path.resolve(__dirname, '../example-files'))
    for (const exampleFile of exampleFiles) {
      const content = await getFileContent(exampleFile)
      await parseValidInput(parse, content)
    }
  })
})

function getFiles(directory: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        return reject(err)
      }
      return resolve(
        files.map(file => path.resolve(directory, file))
      )
    })
  })
}

function getFileContent(file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, {encoding: 'utf8'}, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}
