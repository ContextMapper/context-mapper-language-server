import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { SculptorModule } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'
import { enforceZeroOrOneCardinality } from '../ValidationHelper.js'

export class SculptorModuleValidationProvider implements ContextMapperValidationProvider<SculptorModule> {
  validate (node: SculptorModule, acceptor: ValidationAcceptor): void {
    enforceZeroOrOneCardinality(node, 'external', acceptor)
    enforceZeroOrOneCardinality(node, 'basePackage', acceptor)
    enforceZeroOrOneCardinality(node, 'hint', acceptor)
  }
}
