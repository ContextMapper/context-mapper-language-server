import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { isStoryValuation, StoryValuation } from '../../generated/ast.js'
import { AstNode } from 'langium'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightKeyword, highlightString } from '../HighlightingHelper.js'

export class StoryValuationSemanticTokenProvider implements ContextMapperSemanticTokenProvider<StoryValuation> {
  supports (node: AstNode): node is StoryValuation {
    return isStoryValuation(node)
  }

  highlight (node: StoryValuation, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'and that')
    highlightString(node, acceptor, 'promotedValues')

    highlightKeyword(node, acceptor, 'is')
    highlightKeyword(node, acceptor, 'are')
    highlightKeyword(node, acceptor, 'promoted')

    highlightKeyword(node, acceptor, 'accepting that')
    highlightString(node, acceptor, 'harmedValues')

    highlightKeyword(node, acceptor, 'is')
    highlightKeyword(node, acceptor, 'are')
    highlightKeyword(node, acceptor, 'reduced')
    highlightKeyword(node, acceptor, 'harmed')
  }
}
