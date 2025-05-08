import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { ValueRegister } from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightAttribute, highlightTypeDeclaration } from '../HighlightingHelper.js'

export class ValueRegisterSemanticTokenProvider implements ContextMapperSemanticTokenProvider<ValueRegister> {
  highlight (node: ValueRegister, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'ValueRegister')

    if (node.context) {
      highlightAttribute(node, acceptor, ['for'], 'context')
    }
  }
}
