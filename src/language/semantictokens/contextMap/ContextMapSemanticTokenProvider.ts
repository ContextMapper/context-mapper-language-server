import { SemanticTokenAcceptor } from 'langium/lsp'
import {
  ContextMap,
  isContextMap
} from '../../generated/ast.js'
import { highlightAttribute, highlightField, highlightTypeDeclaration } from '../HighlightingHelper.js'
import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { AstNode } from 'langium'

export class ContextMapSemanticTokenProvider implements ContextMapperSemanticTokenProvider<ContextMap> {
  supports (node: AstNode): node is ContextMap {
    return isContextMap(node)
  }

  public highlight (node: ContextMap, acceptor: SemanticTokenAcceptor) {
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
