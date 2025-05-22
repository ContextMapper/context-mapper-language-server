import { CancellationToken } from 'vscode-languageserver'
import { ContextMappingModel } from '../../generated/ast.js'
import { ContextMapperGenerator } from './ContextMapperGenerator.js'

export class DummyGenerator implements ContextMapperGenerator {
  generate (model: ContextMappingModel, filePath: string, args: unknown[], cancelToken: CancellationToken): Promise<string[]> {
    return Promise.resolve(['Dummy says hi'])
  }
}