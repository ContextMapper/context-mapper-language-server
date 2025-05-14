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

  async execute (generator: ContextMapperGenerator, args: unknown[], cancelToken: CancellationToken): Promise<string | undefined> {
    const filePath = args[0] as string

    const model = await this.extractModel(filePath)
    if (cancelToken.isCancellationRequested) {
      return undefined
    }

    if (model == null) {
      return undefined
    }
    args.shift()
    return await generator.generate(model, filePath, args, cancelToken)
  }

  private async extractModel (filePath: string): Promise<ContextMappingModel | undefined> {
    const extensions = ContextMapperDslLanguageMetaData.fileExtensions as readonly string[]
    if (!extensions.includes(path.extname(filePath))) {
      console.error('Unsupported file extension on file', filePath)
      return undefined
    }

    if (!fs.existsSync(filePath)) {
      console.error(`File ${filePath} does not exist.`)
      return undefined
    }

    const document = await this.getServices().shared.workspace.LangiumDocuments.getOrCreateDocument(URI.file(path.resolve(filePath)))
    await this.getServices().shared.workspace.DocumentBuilder.build([document], { validation: true })

    const validationErrors = (document.diagnostics ?? []).filter(e => e.severity === 1)
    if (validationErrors.length > 0) {
      console.error(`File ${filePath} is invalid`)
      return undefined
    }

    return document.parseResult.value as ContextMappingModel
  }

  private getServices () {
    return this.serviceRegistry.getServices(URI.file(`any.${ContextMapperDslLanguageMetaData.fileExtensions[0]}`)) as ContextMapperDslServices
  }
}
