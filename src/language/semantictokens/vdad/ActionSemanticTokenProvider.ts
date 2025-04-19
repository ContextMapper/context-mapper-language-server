import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { Action, isAction } from '../../generated/ast.js'
import { AstNode } from 'langium'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightKeyword, highlightString } from '../HighlightingHelper.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'

export class ActionSemanticTokenProvider implements ContextMapperSemanticTokenProvider<Action> {
  supports (node: AstNode): node is Action {
    return isAction(node)
  }

  highlight (node: Action, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'action')
    highlightString(node, acceptor, 'action')

    const typeKeywords = ['ACT', 'MONITOR']
    if (typeKeywords.includes(node.type)) {
      acceptor({
        node,
        type: SemanticTokenTypes.keyword,
        property: 'type'
      })
    } else {
      highlightString(node, acceptor, 'type')
    }
  }
}
