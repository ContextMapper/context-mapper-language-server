import { SemanticTokenAcceptor } from 'langium/lsp'
import { ContextMap } from '../../generated/ast.js'
import { highlightAttribute, highlightField, highlightTypeDeclaration } from '../HighlightingHelper.js'
import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'

export class ContextMapSemanticTokenProvider implements ContextMapperSemanticTokenProvider<ContextMap> {
  highlight (node: ContextMap, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'ContextMap', node.name != null)

    if (node.type) {
      highlightField(node, acceptor, ['type'], 'type')
    }

    if (node.state) {
      highlightField(node, acceptor, ['state'], 'state')
    }

    if (node.boundedContexts.length > 0) {
      highlightAttribute(node, acceptor, ['contains'], 'boundedContexts')
    }
  }
}
