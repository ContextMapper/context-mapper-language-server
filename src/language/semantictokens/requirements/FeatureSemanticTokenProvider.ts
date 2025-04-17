import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { Feature, isFeature, isNormalFeature, isStoryFeature, NormalFeature, StoryFeature } from '../../generated/ast.js'
import { AstNode } from 'langium'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightKeyword, highlightString } from '../HighlightingHelper.js'

export class FeatureSemanticTokenProvider implements ContextMapperSemanticTokenProvider<Feature> {
  supports (node: AstNode): node is Feature {
    return isFeature(node)
  }

  public highlight (node: Feature, acceptor: SemanticTokenAcceptor) {
    if (isNormalFeature(node)) {
      this.highlightNormalFeature(node, acceptor)
    } else if (isStoryFeature(node)) {
      this.highlightStoryFeature(node, acceptor)
    }
  }

  private highlightNormalFeature (node: NormalFeature, acceptor: SemanticTokenAcceptor) {
    highlightString(node, acceptor, 'verb')

    if (node.entityArticle) {
      highlightKeyword(node, acceptor, node.entityArticle)
    }

    highlightString(node, acceptor, 'entity')

    if (node.entityAttributesPreposition) {
      highlightKeyword(node, acceptor, node.entityAttributesPreposition)
    }

    if (node.entityAttributes.length > 0) {
      highlightString(node, acceptor, 'entityAttributes')
    }

    if (node.containerEntityPreposition) {
      highlightKeyword(node, acceptor, node.containerEntityPreposition)
    }

    if (node.containerEntityArticle) {
      highlightKeyword(node, acceptor, node.containerEntityArticle)
    }

    if (node.containerEntity) {
      highlightString(node, acceptor, 'containerEntity')
    }
  }

  private highlightStoryFeature (node: StoryFeature, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'I want to')
  }
}
