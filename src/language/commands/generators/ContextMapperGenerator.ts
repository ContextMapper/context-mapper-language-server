import { ContextMappingModel } from '../../generated/ast.js'
import { CancellationToken } from 'vscode-languageserver'

export interface ContextMapperGenerator {
  generate(model: ContextMappingModel, filePath: string, args: unknown[], cancelToken: CancellationToken): Promise<string[]>
}