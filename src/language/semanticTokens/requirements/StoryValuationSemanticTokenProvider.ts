import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { StoryValuation } from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightKeyword, highlightString } from '../HighlightingHelper.js'

export class StoryValuationSemanticTokenProvider implements ContextMapperSemanticTokenProvider<StoryValuation> {
  highlight (node: StoryValuation, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'and that')
    highlightString(node, acceptor, 'promotedValues')

    highlightKeyword(node, acceptor, 'is')
    highlightKeyword(node, acceptor, 'are')
    highlightKeyword(node, acceptor, 'promoted')

    highlightKeyword(node, acceptor, 'accepting that')
    highlightString(node, acceptor, 'harmedValues')

    // is/are already covered
    highlightKeyword(node, acceptor, 'reduced')
    highlightKeyword(node, acceptor, 'harmed')
  }
}
