import { AstNode } from 'langium'
import { SemanticTokenAcceptor } from 'langium/lsp'

export interface ContextMapperSemanticTokenProvider<T extends AstNode> {
  highlight(node: T, acceptor: SemanticTokenAcceptor): void
}
