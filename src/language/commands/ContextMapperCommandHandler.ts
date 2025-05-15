import { AbstractExecuteCommandHandler, ExecuteCommandAcceptor, ExecuteCommandFunction } from 'langium/lsp'
import { LangiumDefaultSharedCoreServices } from 'langium'
import { GeneratorCommandExecutor } from './GeneratorCommandExecutor.js'
import { PlantUMLGenerator } from '../generators/PlantUMLGenerator.js'
import { ContextMapperGenerator } from '../generators/ContextMapperGenerator.js'

export class ContextMapperCommandHandler extends AbstractExecuteCommandHandler {
  private readonly generatorCommandExecutor: GeneratorCommandExecutor

  constructor (services: LangiumDefaultSharedCoreServices) {
    super()
    this.generatorCommandExecutor = new GeneratorCommandExecutor(services.ServiceRegistry)
  }

  override registerCommands (acceptor: ExecuteCommandAcceptor): void {
    acceptor('org.contextmapper.GeneratePlantUML', this.wrapCommand(new PlantUMLGenerator()))
  }


  private wrapCommand (generator: ContextMapperGenerator) {
    const wrapper: ExecuteCommandFunction = (args, cancelToken) => this.generatorCommandExecutor.execute(generator, args, cancelToken)
    return wrapper
  }
}