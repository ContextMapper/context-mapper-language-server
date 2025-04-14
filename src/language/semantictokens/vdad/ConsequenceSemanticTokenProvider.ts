import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { Consequence, isConsequence } from '../../generated/ast.js'
import { AstNode } from 'langium'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightKeyword, highlightString } from '../HighlightingHelper.js'

export class ConsequenceSemanticTokenProvider implements ContextMapperSemanticTokenProvider<Consequence> {
  supports (node: AstNode): node is Consequence {
    return isConsequence(node)
  }

  highlight (node: Consequence, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, node.type)
    highlightString(node, acceptor, 'consequence')
  }
}
