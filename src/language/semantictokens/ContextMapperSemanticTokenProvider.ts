import { AstNode } from 'langium'
import { SemanticTokenAcceptor } from 'langium/lsp'

export interface ContextMapperSemanticTokenProvider<T extends AstNode> {
  supports(node: AstNode): node is T;
  highlight(node: T, acceptor: SemanticTokenAcceptor): void
}
