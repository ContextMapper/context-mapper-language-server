import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { ValueElicitation } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'
import { enforceZeroOrOneCardinality } from '../ValidationHelper.js'

export class ValueElicitationValidationProvider implements ContextMapperValidationProvider<ValueElicitation> {
  validate (node: ValueElicitation, acceptor: ValidationAcceptor): void {
    enforceZeroOrOneCardinality(node, 'priority', acceptor)
    enforceZeroOrOneCardinality(node, 'impact', acceptor)
    // TODO: regex enforce consequences
  }
}
