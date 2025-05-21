import { afterEach, beforeAll, describe, expect, test } from 'vitest'
import path from 'node:path'
import fs from 'node:fs'
import { createContextMapperDslServices } from '../../src/language/ContextMapperDslModule.js'
import { NodeFileSystem } from 'langium/node'
import { clearDocuments } from 'langium/test'
import { ExecuteCommandHandler } from 'langium/lsp'

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

describe('PlantUML component diagram generation - performance test', () => {
  test('test PlantUML generation performance for stage 3 DDD-Sample', async () => {
    const file = path.join(__dirname, '..', 'example-files', 'DDD-Sample-Stage-3.cml')

    const startTime = Date.now()
    const result = await commandHandler.executeCommand('org.contextmapper.GeneratePlantUML', [file, outDir])
    const endTime = Date.now()

    expect(result).toHaveLength(1)
    const outContent = fs.readdirSync(outDir)
    expect(outContent).toHaveLength(1)
    expect(endTime - startTime).toBeLessThanOrEqual(500)
  })
})