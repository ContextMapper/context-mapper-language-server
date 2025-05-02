import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { Stakeholder } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'
import { enforceZeroOrOneCardinality } from '../ValidationHelper.js'

export class StakeholderValidationProvider implements ContextMapperValidationProvider<Stakeholder> {
  validate (node: Stakeholder, acceptor: ValidationAcceptor): void {
    enforceZeroOrOneCardinality(node, 'influence', acceptor)
    enforceZeroOrOneCardinality(node, 'interest', acceptor)
    enforceZeroOrOneCardinality(node, 'description', acceptor)
  }
}
