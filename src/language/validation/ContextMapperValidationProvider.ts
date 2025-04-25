import { AstNode, ValidationAcceptor } from 'langium'

export interface ContextMapperValidationProvider<T extends AstNode> {
  supports(node: AstNode): node is T
  validate (node: T, acceptor: ValidationAcceptor): void
}
