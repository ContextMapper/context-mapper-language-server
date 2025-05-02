import { ValidationAcceptor } from 'langium'
import { ContextMap } from '../../generated/ast.js'
import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { enforceZeroOrOneCardinality } from '../ValidationHelper.js'

export class ContextMapValidationProvider implements ContextMapperValidationProvider<ContextMap> {
  validate (node: ContextMap, acceptor: ValidationAcceptor): void {
    enforceZeroOrOneCardinality(node, 'type', acceptor)
    enforceZeroOrOneCardinality(node, 'state', acceptor)
  }
}
