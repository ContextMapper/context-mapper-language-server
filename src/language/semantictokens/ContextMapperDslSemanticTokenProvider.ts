import { AstNode } from 'langium'
import { AbstractSemanticTokenProvider, SemanticTokenAcceptor } from 'langium/lsp'
import { isContextMap, isRelationship } from '../generated/ast.js'
import { ContextMapSemanticTokenProvider } from './ContextMapSemanticTokenProvider.js'

export class ContextMapperDslSemanticTokenProvider extends AbstractSemanticTokenProvider {
  private contextMapTokenProvider = new ContextMapSemanticTokenProvider()

  protected override highlightElement (node: AstNode, acceptor: SemanticTokenAcceptor) {
    if (isContextMap(node)) {
      this.contextMapTokenProvider.highlightContextMap(node, acceptor)
    }
    if (isRelationship(node)) {
      this.contextMapTokenProvider.highlightRelationship(node, acceptor)
    }
  }
}
