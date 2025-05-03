import { Value } from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import {
  highlightKeyword,
  highlightField,
  highlightTypeDeclaration
} from '../HighlightingHelper.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'

export class ValueSemanticTokenProvider implements ContextMapperSemanticTokenProvider<Value> {
  highlight (node: Value, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'Value')

    if (node.coreValue) {
      highlightKeyword(node, acceptor, 'isCore')
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
