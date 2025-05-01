import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { isUseCase, UserRequirement } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'
import { enforceZeroOrOneCardinality } from '../ValidationHelper.js'

export class UseCaseValidationProvider implements ContextMapperValidationProvider<UserRequirement> {
  validate (node: UserRequirement, acceptor: ValidationAcceptor): void {
    if (isUseCase(node)) {
      enforceZeroOrOneCardinality(node, 'role', acceptor, 'actor')
      // TODO: regex enforce secondaryActors
      // TODO: regex enforce features
      enforceZeroOrOneCardinality(node, 'benefit', acceptor)
      enforceZeroOrOneCardinality(node, 'scope', acceptor)
      enforceZeroOrOneCardinality(node, 'level', acceptor)
    }
  }
}
