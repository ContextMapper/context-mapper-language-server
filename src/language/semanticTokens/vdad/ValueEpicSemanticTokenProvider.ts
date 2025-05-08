import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { ValueEpic } from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightKeyword, highlightString, highlightType, highlightTypeDeclaration } from '../HighlightingHelper.js'

export class ValueEpicSemanticTokenProvider implements ContextMapperSemanticTokenProvider<ValueEpic> {
  highlight (node: ValueEpic, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'ValueEpic')

    highlightKeyword(node, acceptor, 'As a')
    highlightType(node, acceptor, 'stakeholder')
    highlightKeyword(node, acceptor, 'I value')
    highlightString(node, acceptor, 'value')
    highlightKeyword(node, acceptor, 'as demonstrated in')

    highlightKeyword(node, acceptor, 'realization of')
    highlightString(node, acceptor, 'realizedValues')

    highlightKeyword(node, acceptor, 'reduction of')
    highlightString(node, acceptor, 'reducedValues')
  }
}
