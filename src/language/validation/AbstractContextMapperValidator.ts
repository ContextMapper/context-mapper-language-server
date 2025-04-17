import { AstNode, ValidationAcceptor, type ValidationChecks } from 'langium'
import type { ContextMapperDslAstType } from '../generated/ast.js'

export interface AbstractContextMapperValidator<T extends AstNode> {
  getChecks (): ValidationChecks<ContextMapperDslAstType>
  validate (node: T, acceptor: ValidationAcceptor): void
}
