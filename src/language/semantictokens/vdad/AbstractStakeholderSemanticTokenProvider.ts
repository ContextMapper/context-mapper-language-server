import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import {
  AbstractStakeholder,
  isAbstractStakeholder,
  isStakeholder,
  isStakeholderGroup,
  Stakeholder, StakeholderGroup
} from '../../generated/ast.js'
import { AstNode } from 'langium'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { highlightMemberAttribute, highlightTypeDeclaration } from '../HighlightingHelper.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'

export class AbstractStakeholderSemanticTokenProvider implements ContextMapperSemanticTokenProvider<AbstractStakeholder> {
  supports (node: AstNode): node is AbstractStakeholder {
    return isAbstractStakeholder(node)
  }

  highlight (node: AbstractStakeholder, acceptor: SemanticTokenAcceptor) {
    if (isStakeholder(node)) {
      this.highlightStakeholder(node, acceptor)
    } else if (isStakeholderGroup(node)) {
      this.highlightStakeholderGroup(node, acceptor)
    }
  }

  private highlightStakeholder (node: Stakeholder, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'Stakeholder')

    if (node.influence) {
      highlightMemberAttribute(node, acceptor, ['influence'], 'influence')
    }

    if (node.interest) {
      highlightMemberAttribute(node, acceptor, ['interest'], 'interest')
    }

    if (node.description) {
      highlightMemberAttribute(node, acceptor, ['description'], 'description', SemanticTokenTypes.string)
    }
  }

  private highlightStakeholderGroup (node: StakeholderGroup, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'StakeholderGroup')
  }
}
