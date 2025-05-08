import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { Consequence } from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightKeyword, highlightString } from '../HighlightingHelper.js'

export class ConsequenceSemanticTokenProvider implements ContextMapperSemanticTokenProvider<Consequence> {
  highlight (node: Consequence, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, node.type)
    highlightString(node, acceptor, 'consequence')
  }
}
