import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { Stakeholders } from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightAttribute, highlightKeyword } from '../HighlightingHelper.js'

export class StakeholdersSemanticTokenProvider implements ContextMapperSemanticTokenProvider<Stakeholders> {
  highlight (node: Stakeholders, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'Stakeholders')

    if (node.contexts.length > 0) {
      highlightAttribute(node, acceptor, ['of'], 'contexts')
    }
  }
}
