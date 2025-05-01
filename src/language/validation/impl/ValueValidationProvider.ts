import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { Value } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'
import { enforceZeroOrOneCardinality } from '../ValidationHelper.js'

export class ValueValidationProvider implements ContextMapperValidationProvider<Value> {
  validate (node: Value, acceptor: ValidationAcceptor): void {
    enforceZeroOrOneCardinality(node, 'coreValue', acceptor, 'isCore')
  }
}
