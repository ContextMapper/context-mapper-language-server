import { AstNode, ValidationAcceptor } from 'langium'

export interface AbstractContextMapperValidator<T extends AstNode> {
  validate (node: T, acceptor: ValidationAcceptor): void
}
