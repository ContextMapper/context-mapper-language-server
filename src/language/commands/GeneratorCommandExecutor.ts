import { ServiceRegistry, URI } from 'langium'
import path from 'node:path'
import fs from 'node:fs'
import { ContextMapperGenerator } from '../generators/ContextMapperGenerator.js'
import { ContextMappingModel } from '../generated/ast.js'
import { ContextMapperDslLanguageMetaData } from '../generated/module.js'
import { ContextMapperDslServices } from '../ContextMapperDslModule.js'
import { CancellationToken } from 'vscode-languageserver'

export class GeneratorCommandExecutor {
  private readonly serviceRegistry: ServiceRegistry

  constructor (serviceRegistry: ServiceRegistry) {
    this.serviceRegistry = serviceRegistry
  }

  async execute (generator: ContextMapperGenerator, args: unknown[], cancelToken: CancellationToken): Promise<string[]> {
    const filePath = args[0] as string

    const model = await this.extractModel(filePath)
    if (cancelToken.isCancellationRequested) {
      return []
    }

    args.shift() // remove source file from args array
    return await generator.generate(model, filePath, args, cancelToken)
  }

  private async extractModel (filePath: string): Promise<ContextMappingModel> {
    const extensions = ContextMapperDslLanguageMetaData.fileExtensions as readonly string[]
    if (!extensions.includes(path.extname(filePath))) {
      throw new Error(`Unsupported file extension on file ${filePath}`)
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filePath} does not exist.`)
    }

    const document = await this.getServices().shared.workspace.LangiumDocuments.getOrCreateDocument(URI.file(path.resolve(filePath)))
    await this.getServices().shared.workspace.DocumentBuilder.build([document], { validation: true })

    const validationErrors = (document.diagnostics ?? []).filter(e => e.severity === 1)
    if (validationErrors.length > 0) {
      throw new Error(`File ${filePath} is invalid`)
    }

    return document.parseResult.value as ContextMappingModel
  }

  private getServices () {
    return this.serviceRegistry.getServices(URI.file(`any.${ContextMapperDslLanguageMetaData.fileExtensions[0]}`)) as ContextMapperDslServices
  }
}
