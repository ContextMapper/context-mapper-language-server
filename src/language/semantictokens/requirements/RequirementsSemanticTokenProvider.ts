import {
  isUseCase, isUserRequirement,
  isUserStory,
  UseCase,
  UserRequirement,
  UserStory
} from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import {
  highlightAttribute,
  highlightKeyword,
  highlightField,
  highlightTypeDeclaration
} from '../HighlightingHelper.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { AstNode } from 'langium'

export class RequirementsSemanticTokenProvider implements ContextMapperSemanticTokenProvider<UserRequirement> {
  supports (node: AstNode): node is UserRequirement {
    return isUserRequirement(node)
  }

  highlight (node: UserRequirement, acceptor: SemanticTokenAcceptor) {
    if (isUseCase(node)) {
      this.highlightUseCase(node, acceptor)
    } else if (isUserStory(node)) {
      this.highlightUserStory(node, acceptor)
    }
  }

  private highlightUseCase (node: UseCase, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'UseCase')

    if (node.role) {
      highlightField(node, acceptor, ['actor'], 'role', SemanticTokenTypes.string)
    }

    if (node.secondaryActors.length > 0) {
      highlightField(node, acceptor, ['secondaryActors'], 'secondaryActors', SemanticTokenTypes.string)
    }

    if (node.features.length > 0) {
      highlightKeyword(node, acceptor, 'interactions')
    }

    if (node.benefit) {
      highlightField(node, acceptor, ['benefit'], 'benefit', SemanticTokenTypes.string)
    }

    if (node.scope) {
      highlightField(node, acceptor, ['scope'], 'scope', SemanticTokenTypes.string)
    }

    if (node.level) {
      highlightField(node, acceptor, ['level'], 'level', SemanticTokenTypes.string)
    }
  }

  private highlightUserStory (node: UserStory, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'UserStory')

    if (node.splittingStory) {
      highlightAttribute(node, acceptor, ['split by'], 'splittingStory')
    }

    if (node.role) {
      highlightField(node, acceptor, ['As a', 'As an'], 'role', SemanticTokenTypes.string)
    }

    if (node.benefit) {
      highlightField(node, acceptor, ['so that'], 'benefit', SemanticTokenTypes.string)
    }
  }
}
