import { AstNode } from 'langium'
import { AbstractSemanticTokenProvider, SemanticTokenAcceptor } from 'langium/lsp'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
import { isContextMap } from '../generated/ast.js'

export class ContextMapperDslSemanticTokenProvider extends AbstractSemanticTokenProvider {
  protected override highlightElement (node: AstNode, acceptor: SemanticTokenAcceptor) {
    if (isContextMap(node)) {
      acceptor({
        node,
        type: SemanticTokenTypes.keyword,
        keyword: 'ContextMap'
      })
    }
  }
}
