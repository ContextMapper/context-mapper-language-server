import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { ExecuteCommandHandler } from 'langium/lsp'
import { clearDocuments } from 'langium/test'
import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import { NodeFileSystem } from 'langium/node'
import fs from 'node:fs'
import path from 'node:path'

const outDir = path.join(__dirname, 'out')

let services: ReturnType<typeof createContextMapperDslServices>
let commandHandler: ExecuteCommandHandler

beforeAll(() => {
  services = createContextMapperDslServices(NodeFileSystem)
  commandHandler = services.shared.lsp.ExecuteCommandHandler!
})

afterEach(async () => {
  await clearDocuments(services.shared, services.shared.workspace.LangiumDocuments.all.toArray())
  fs.rmSync(outDir, { recursive: true })
})

describe('Command execution tests', () => {
  test('test plantUML command', async () => {
    const file = path.join(__dirname, '..', 'example-files', 'DDD-Sample-Stage-3.cml')

    const result = await commandHandler.executeCommand('org.contextmapper.GeneratePlantUML', [file, outDir])
    expect(result).not.toBeUndefined()

    const outContent = fs.readdirSync(outDir)
    expect(outContent).toHaveLength(1)
  })
})