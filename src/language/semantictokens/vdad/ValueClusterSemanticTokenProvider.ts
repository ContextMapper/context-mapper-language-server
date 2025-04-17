import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { isValueCluster, ValueCluster } from '../../generated/ast.js'
import { AstNode } from 'langium'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightField, highlightTypeDeclaration } from '../HighlightingHelper.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'

export class ValueClusterSemanticTokenProvider implements ContextMapperSemanticTokenProvider<ValueCluster> {
  supports (node: AstNode): node is ValueCluster {
    return isValueCluster(node)
  }

  highlight (node: ValueCluster, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'ValueCluster')

    if (node.coreValue) {
      highlightField(node, acceptor, ['core'], 'coreValue')
    }
    if (node.coreValue7000) {
      highlightField(node, acceptor, ['core'], 'coreValue7000')
    }

    if (node.demonstrators.length > 0) {
      highlightField(node, acceptor, ['demonstrator'], 'demonstrators', SemanticTokenTypes.string)
    }

    if (node.relatedValues.length > 0) {
      highlightField(node, acceptor, ['relatedValue'], 'relatedValues', SemanticTokenTypes.string)
    }

    if (node.opposingValues.length > 0) {
      highlightField(node, acceptor, ['opposingValue'], 'opposingValues', SemanticTokenTypes.string)
    }
  }
}
