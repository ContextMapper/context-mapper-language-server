import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { ExecuteCommandHandler } from 'langium/lsp'
import { clearDocuments } from 'langium/test'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { NodeFileSystem } from 'langium/node'
import fs from 'node:fs'
import path from 'node:path'
import { fail } from 'node:assert'

const outDir = path.join(__dirname, 'out')

let services: ReturnType<typeof createContextMapperDslServices>
let commandHandler: ExecuteCommandHandler

beforeAll(() => {
  services = createContextMapperDslServices(NodeFileSystem)
  commandHandler = services.shared.lsp.ExecuteCommandHandler!
})

afterEach(async () => {
  await clearDocuments(services.shared, services.shared.workspace.LangiumDocuments.all.toArray())
  fs.rmSync(outDir, {
    recursive: true,
    force: true
  })
})

describe('Command execution tests', () => {
  test('test plantUML command', async () => {
    const file = path.join(__dirname, '..', 'example-files', 'DDD-Sample-Stage-3.cml')

    const result = await commandHandler.executeCommand('org.contextmapper.GeneratePlantUML', [file, outDir])
    expect(result).not.toBeUndefined()

    const outContent = fs.readdirSync(outDir)
    expect(outContent).toHaveLength(1)
  })

  test('test plantUML command with invalid file extension', async () => {
    const file = path.join(__dirname, '..', 'invalid-files', 'test.txt')

    try {
      await commandHandler.executeCommand('org.contextmapper.GeneratePlantUML', [file, outDir])
      fail('Expected generator to fail')
    } catch (e) {
      expect(e).not.toBeUndefined()
    }

    const outContentExists = fs.existsSync(outDir)
    expect(outContentExists).toEqual(false)
  })

  test('test plantUML command with invalid file', async () => {
    const file = path.join(__dirname, '..', 'invalid-files', 'invalid.cml')

    try {
      await commandHandler.executeCommand('org.contextmapper.GeneratePlantUML', [file, outDir])
      fail('Expected generator to fail')
    } catch (e) {
      expect(e).not.toBeUndefined()
    }

    const outContentExists = fs.existsSync(outDir)
    expect(outContentExists).toEqual(false)
  })

  test('test plantUML command with non-existing file', async () => {
    const file = path.join(__dirname, '..', 'invalid-files', 'non-existing.cml')

    try {
      await commandHandler.executeCommand('org.contextmapper.GeneratePlantUML', [file, outDir])
      fail('Expected generator to fail')
    } catch (e) {
      expect(e).not.toBeUndefined()
    }

    const outContentExists = fs.existsSync(outDir)
    expect(outContentExists).toEqual(false)
  })
})