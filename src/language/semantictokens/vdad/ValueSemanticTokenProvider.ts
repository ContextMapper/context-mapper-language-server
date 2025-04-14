import {
  isValue,
  Value
} from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import {
  highlightKeyword,
  highlightMemberAttribute,
  highlightTypeDeclaration
} from '../HighlightingHelper.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { AstNode } from 'langium'

export class ValueSemanticTokenProvider implements ContextMapperSemanticTokenProvider<Value> {
  supports (node: AstNode): node is Value {
    return isValue(node)
  }

  highlight (node: Value, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'Value')

    if (node.coreValue) {
      highlightKeyword(node, acceptor, 'isCore')
    }

    if (node.demonstrators.length > 0) {
      highlightMemberAttribute(node, acceptor, ['demonstrator'], 'demonstrators', SemanticTokenTypes.string)
    }

    if (node.relatedValues.length > 0) {
      highlightMemberAttribute(node, acceptor, ['relatedValue'], 'relatedValues', SemanticTokenTypes.string)
    }

    if (node.opposingValues.length > 0) {
      highlightMemberAttribute(node, acceptor, ['opposingValue'], 'opposingValues', SemanticTokenTypes.string)
    }
  }
}
