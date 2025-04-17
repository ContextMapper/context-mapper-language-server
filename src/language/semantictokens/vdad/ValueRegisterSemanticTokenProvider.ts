import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { isValueRegister, ValueRegister } from '../../generated/ast.js'
import { AstNode } from 'langium'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightAttribute, highlightKeyword } from '../HighlightingHelper.js'

export class ValueRegisterSemanticTokenProvider implements ContextMapperSemanticTokenProvider<ValueRegister> {
  supports (node: AstNode): node is ValueRegister {
    return isValueRegister(node)
  }

  highlight (node: ValueRegister, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'ValueRegister')

    if (node.context) {
      highlightAttribute(node, acceptor, ['of'], 'context')
    }
  }
}
