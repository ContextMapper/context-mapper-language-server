import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { isValueWeigthing, ValueWeigthing } from '../../generated/ast.js'
import { AstNode } from 'langium'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightKeyword, highlightString, highlightType, highlightTypeDeclaration } from '../HighlightingHelper.js'

export class ValueWeightingSemanticTokenProvider implements ContextMapperSemanticTokenProvider<ValueWeigthing> {
  supports (node: AstNode): node is ValueWeigthing {
    return isValueWeigthing(node)
  }

  highlight (node: ValueWeigthing, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'ValueWeighting')

    highlightKeyword(node, acceptor, 'In the context of the SOI,')

    highlightKeyword(node, acceptor, 'stakeholder')
    highlightType(node, acceptor, 'stakeholder')
    highlightKeyword(node, acceptor, 'values')
    highlightString(node, acceptor, 'value1')
    highlightKeyword(node, acceptor, 'more than')
    highlightString(node, acceptor, 'value2')

    highlightKeyword(node, acceptor, 'expecting benefits such as')
    highlightString(node, acceptor, 'benefits')

    highlightKeyword(node, acceptor, 'running the risk of harms such as')
    highlightString(node, acceptor, 'harms')
  }
}
