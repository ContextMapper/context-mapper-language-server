import { AstNode, ValidationAcceptor } from 'langium'

export interface ContextMapperValidator<T extends AstNode> {
  validate (node: T, acceptor: ValidationAcceptor): void
}
