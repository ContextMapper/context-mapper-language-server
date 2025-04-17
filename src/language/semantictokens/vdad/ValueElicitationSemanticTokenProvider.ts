import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { isValueElicitation, ValueElicitation } from '../../generated/ast.js'
import { AstNode } from 'langium'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightKeyword, highlightField, highlightType } from '../HighlightingHelper.js'

export class ValueElicitationSemanticTokenProvider implements ContextMapperSemanticTokenProvider<ValueElicitation> {
  supports (node: AstNode): node is ValueElicitation {
    return isValueElicitation(node)
  }

  highlight (node: ValueElicitation, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'Stakeholder')
    highlightKeyword(node, acceptor, 'Stakeholders')
    highlightType(node, acceptor, 'stakeholder')

    if (node.priority) {
      highlightField(node, acceptor, ['priority'], 'priority')
    }

    if (node.impact) {
      highlightField(node, acceptor, ['impact'], 'impact')
    }

    if (node.consequences.length > 0) {
      highlightKeyword(node, acceptor, 'consequences')
    }
  }
}
