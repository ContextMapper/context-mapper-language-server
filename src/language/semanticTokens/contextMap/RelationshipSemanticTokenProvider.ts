import {
  CustomerSupplierRelationship,
  isCustomerSupplierRelationship,
  isPartnership,
  isSharedKernel,
  isSymmetricRelationship,
  isUpstreamDownstreamRelationship,
  Partnership,
  Relationship,
  SharedKernel,
  SymmetricRelationship,
  UpstreamDownstreamRelationship
} from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { SemanticTokenModifiers, SemanticTokenTypes } from 'vscode-languageserver-types'
import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { highlightField, highlightKeyword, highlightOperator, highlightType } from '../HighlightingHelper.js'

export class RelationshipSemanticTokenProvider implements ContextMapperSemanticTokenProvider<Relationship> {
  highlight (node: Relationship, acceptor: SemanticTokenAcceptor) {
    if (node.name) {
      highlightType(node, acceptor, 'name', [SemanticTokenModifiers.declaration])
    }

    if (node.implementationTechnology) {
      highlightField(node, acceptor, ['implementationTechnology'], 'implementationTechnology', SemanticTokenTypes.string)
    }

    if (isSymmetricRelationship(node)) {
      this.highlightSymmetricRelationship(node, acceptor)
    } else if (isUpstreamDownstreamRelationship(node)) {
      this.highlightUpstreamDownstreamRelationship(node, acceptor)
    }
  }

  private highlightSymmetricRelationship (node: SymmetricRelationship, acceptor: SemanticTokenAcceptor) {
    highlightType(node, acceptor, 'participant1')
    highlightType(node, acceptor, 'participant2')

    if (isPartnership(node)) {
      this.highlightPartnership(node, acceptor)
    } else if (isSharedKernel(node)) {
      this.highlightSharedKernel(node, acceptor)
    }
  }

  private highlightPartnership (node: Partnership, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'P')
    highlightOperator(node, acceptor, '<->')
    highlightKeyword(node, acceptor, 'Partnership')
  }

  private highlightSharedKernel (node: SharedKernel, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'SK')
    highlightOperator(node, acceptor, '<->')
    highlightKeyword(node, acceptor, 'Shared-Kernel')
  }

  private highlightUpstreamDownstreamRelationship (node: UpstreamDownstreamRelationship, acceptor: SemanticTokenAcceptor) {
    highlightType(node, acceptor, 'upstream')
    highlightKeyword(node, acceptor, 'U')
    if (node.upstreamRoles.length > 0) {
      acceptor({
        node,
        type: SemanticTokenTypes.keyword,
        property: 'upstreamRoles'
      })
    }

    highlightType(node, acceptor, 'downstream')
    highlightKeyword(node, acceptor, 'D')
    if (node.downstreamRoles.length > 0) {
      acceptor({
        node,
        type: SemanticTokenTypes.keyword,
        property: 'downstreamRoles'
      })
    }

    highlightOperator(node, acceptor, '->')
    highlightOperator(node, acceptor, '<-')

    if (node.upstreamExposedAggregates.length > 0) {
      highlightField(node, acceptor, ['exposedAggregates'], 'upstreamExposedAggregates', SemanticTokenTypes.type)
    }

    if (node.downstreamGovernanceRights) {
      highlightField(node, acceptor, ['downstreamRights'], 'downstreamGovernanceRights', SemanticTokenTypes.enumMember)
    }

    if (isCustomerSupplierRelationship(node)) {
      this.highlightCustomerSupplierRelationship(node, acceptor)
      return
    }

    highlightKeyword(node, acceptor, 'Upstream-Downstream')
    highlightKeyword(node, acceptor, 'Downstream-Upstream')
  }

  highlightCustomerSupplierRelationship (node: CustomerSupplierRelationship, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'Supplier-Customer')
    highlightKeyword(node, acceptor, 'Customer-Supplier')

    highlightKeyword(node, acceptor, 'S')
    highlightKeyword(node, acceptor, 'C')
  }
}
