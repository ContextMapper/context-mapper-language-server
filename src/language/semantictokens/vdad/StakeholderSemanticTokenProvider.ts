import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { isStakeholders, Stakeholders } from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightAttribute, highlightKeyword } from '../HighlightingHelper.js'

export class StakeholderSemanticTokenProvider implements ContextMapperSemanticTokenProvider<Stakeholders> {
  supports (node: any): node is Stakeholders {
    return isStakeholders(node)
  }

  highlight (node: Stakeholders, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'Stakeholders')

    if (node.contexts.length > 0) {
      highlightAttribute(node, acceptor, ['of'], 'contexts')
    }
  }
}
