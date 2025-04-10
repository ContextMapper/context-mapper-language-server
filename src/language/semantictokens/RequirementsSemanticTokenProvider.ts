import {
  Feature,
  isNormalFeature,
  isStoryFeature,
  isUseCase,
  isUserStory,
  NormalFeature,
  StoryFeature,
  UseCase,
  UserRequirement,
  UserStory
} from '../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import {
  highlightAttribute,
  highlightKeyword,
  highlightMemberAttribute,
  highlightString,
  highlightTypeDeclaration
} from './HighlightingHelper.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
export class RequirementsSemanticTokenProvider {
  public highlightUserRequirement (node: UserRequirement, acceptor: SemanticTokenAcceptor) {
    if (isUseCase(node)) {
      this.highlightUseCase(node, acceptor)
    } else if (isUserStory(node)) {
      this.highlightUserStory(node, acceptor)
    }
  }

  public highlightUseCase (node: UseCase, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'UseCase')

    if (node.role) {
      highlightMemberAttribute(node, acceptor, ['actor'], 'role')
    }

    if (node.secondaryActors.length > 0) {
      highlightMemberAttribute(node, acceptor, ['secondaryActors'], 'secondaryActors', SemanticTokenTypes.string, true)
    }

    if (node.features.length > 0) {
      highlightKeyword(node, acceptor, 'interactions')
    }

    if (node.benefit) {
      highlightMemberAttribute(node, acceptor, ['benefit'], 'benefit', SemanticTokenTypes.string)
    }

    if (node.scope) {
      highlightMemberAttribute(node, acceptor, ['scope'], 'scope', SemanticTokenTypes.string)
    }

    if (node.level) {
      highlightMemberAttribute(node, acceptor, ['level'], 'level', SemanticTokenTypes.string)
    }
  }

  public highlightUserStory (node: UserStory, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'UserStory')

    if (node.splittingStory) {
      highlightAttribute(node, acceptor, ['split by'], 'splittingStory')
    }

    if (node.role) {
      highlightMemberAttribute(node, acceptor, ['As a', 'As an'], 'role', SemanticTokenTypes.string)
    }

    if (node.benefit) {
      highlightMemberAttribute(node, acceptor, ['so that'], 'benefit', SemanticTokenTypes.string)
    }
  }

  public highlightFeature (node: Feature, acceptor: SemanticTokenAcceptor) {
    if (isNormalFeature(node)) {
      this.highlightNormalFeature(node, acceptor)
    } else if (isStoryFeature(node)) {
      this.highlightStoryFeature(node, acceptor)
    }
  }

  public highlightNormalFeature (node: NormalFeature, acceptor: SemanticTokenAcceptor) {
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

  public highlightStoryFeature (node: StoryFeature, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'I want to')
  }
}
