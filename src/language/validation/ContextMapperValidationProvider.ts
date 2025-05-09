import { AstNode, ValidationAcceptor } from 'langium'

export interface ContextMapperValidationProvider<T extends AstNode> {
  validate (_node: T, _acceptor: ValidationAcceptor): void
}
