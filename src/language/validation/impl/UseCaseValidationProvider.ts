import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { isUseCase, UserRequirement } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'
import { enforceZeroOrOneCardinality, enforceZeroOrOneCardinalityOfListAttribute } from '../ValidationHelper.js'

export class UseCaseValidationProvider implements ContextMapperValidationProvider<UserRequirement> {
  validate (node: UserRequirement, acceptor: ValidationAcceptor): void {
    if (isUseCase(node)) {
      enforceZeroOrOneCardinality(node, 'role', acceptor, ['actor'])
      enforceZeroOrOneCardinalityOfListAttribute(node, 'secondaryActors', acceptor)
      enforceZeroOrOneCardinalityOfListAttribute(node, 'features', acceptor, ['interactions'])
      enforceZeroOrOneCardinality(node, 'benefit', acceptor)
      enforceZeroOrOneCardinality(node, 'scope', acceptor)
      enforceZeroOrOneCardinality(node, 'level', acceptor)
    }
  }
}
