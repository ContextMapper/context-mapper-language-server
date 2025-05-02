import { AstNode, ValidationAcceptor } from 'langium'

export interface ContextMapperValidationProvider<T extends AstNode> {
  validate (node: T, acceptor: ValidationAcceptor): void
}
