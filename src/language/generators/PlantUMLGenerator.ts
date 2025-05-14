import { ContextMapperGenerator } from './ContextMapperGenerator.js'
import path from 'node:path'
import fs from 'node:fs'
import { ContextMappingModel } from '../generated/ast.js'
import { ComponentDiagramGenerator } from './plantuml/ComponentDiagramGenerator.js'
import { CancellationToken } from 'vscode-languageserver'

export class PlantUMLGenerator implements ContextMapperGenerator {
  async generate (model: ContextMappingModel, filePath: string, args: unknown[], cancelToken: CancellationToken): Promise<string | undefined> {
    // there must not be any extra spaces especially at the start, since the path will be treated as relative otherwise
    const destination = (args[0] as string)?.trim()
    if (destination == null || destination === '') {
      console.log('Destination must be specified')
      return undefined
    }

    if (cancelToken.isCancellationRequested) {
      return undefined
    }
    const fileName = filePath.split('/').pop()!.split('.')[0]

    if (!fs.existsSync(destination)) {
      await fs.promises.mkdir(destination, { recursive: true })
    }

    await this.generateComponentDiagram(model, destination, fileName)

    console.log('Successfully generated PlantUML diagrams')
    return destination
  }

  private async generateComponentDiagram (model: ContextMappingModel, destination: string, fileName: string) {
    if (model.contextMap.length === 0) {
      return
    }

    const generator = new ComponentDiagramGenerator()
    const diagram = generator.createDiagram(model.contextMap[0])
    await this.createFile(destination, fileName, diagram)
  }

  private async createFile (destination: string, fileName: string, content: string) {
    const filePath = `${path.join(destination, fileName)}.puml`
    await fs.promises.writeFile(filePath, content)
  }
}