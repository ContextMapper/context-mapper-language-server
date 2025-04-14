import {
  CustomerSupplierRelationship,
  isCustomerSupplierRelationship,
  isPartnership, isRelationship, isSharedKernel,
  isSymmetricRelationship,
  isUpstreamDownstreamRelationship, Partnership,
  Relationship, SharedKernel,
  SymmetricRelationship, UpstreamDownstreamRelationship
} from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { SemanticTokenModifiers, SemanticTokenTypes } from 'vscode-languageserver-types'
import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'

export class RelationshipSemanticTokenProvider implements ContextMapperSemanticTokenProvider<Relationship> {
  supports (node: Relationship): node is Relationship {
    return isRelationship(node)
  }

  highlight (node: Relationship, acceptor: SemanticTokenAcceptor) {
    if (isSymmetricRelationship(node)) {
      this.highlightSymmetricRelationship(node, acceptor)
    } else if (isUpstreamDownstreamRelationship(node)) {
      this.highlightUpstreamDownstreamRelationship(node, acceptor)
    }
  }

  private highlightSymmetricRelationship (node: SymmetricRelationship, acceptor: SemanticTokenAcceptor) {
    acceptor({
      node,
      type: SemanticTokenTypes.type,
      property: 'participant1'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.type,
      property: 'participant2'
    })

    if (node.name) {
      acceptor({
        node,
        type: SemanticTokenTypes.type,
        modifier: SemanticTokenModifiers.declaration,
        property: 'name'
      })
    }

    if (node.implementationTechnology) {
      acceptor({
        node,
        type: SemanticTokenTypes.keyword,
        keyword: 'implementationTechnology'
      })
      acceptor({
        node,
        type: SemanticTokenTypes.property,
        property: 'implementationTechnology'
      })
    }

    if (isPartnership(node)) {
      this.highlightPartnership(node, acceptor)
    } else if (isSharedKernel(node)) {
      this.highlightSharedKernel(node, acceptor)
    }
  }

  private highlightPartnership (node: Partnership, acceptor: SemanticTokenAcceptor) {
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'P'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: '<->'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'Partnership'
    })
  }

  private highlightSharedKernel (node: SharedKernel, acceptor: SemanticTokenAcceptor) {
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'SK'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: '<->'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'Shared-Kernel'
    })
  }

  private highlightUpstreamDownstreamRelationship (node: UpstreamDownstreamRelationship, acceptor: SemanticTokenAcceptor) {
    if (isCustomerSupplierRelationship(node)) {
      this.highlightCustomerSupplierRelationship(node, acceptor)
      return
    }

    if (node.name) {
      acceptor({
        node,
        type: SemanticTokenTypes.type,
        modifier: SemanticTokenModifiers.declaration,
        property: 'name'
      })
    }

    acceptor({
      node,
      type: SemanticTokenTypes.type,
      property: 'downstream'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'D'
    })

    acceptor({
      node,
      type: SemanticTokenTypes.type,
      property: 'upstream'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'U'
    })

    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'Upstream-Downstream'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'Downstream-Upstream'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: '<-'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: '->'
    })

    if (node.downstreamRoles.length > 0) {
      acceptor({
        node,
        type: SemanticTokenTypes.property,
        property: 'downstreamRoles'
      })
    }

    if (node.upstreamRoles.length > 0) {
      acceptor({
        node,
        type: SemanticTokenTypes.property,
        property: 'upstreamRoles'
      })
    }

    if (node.implementationTechnology) {
      acceptor({
        node,
        type: SemanticTokenTypes.keyword,
        keyword: 'implementationTechnology'
      })
      acceptor({
        node,
        type: SemanticTokenTypes.property,
        property: 'implementationTechnology'
      })
    }

    if (node.upstreamExposedAggregates.length > 0) {
      acceptor({
        node,
        type: SemanticTokenTypes.keyword,
        keyword: 'exposedAggregates'
      })
      acceptor({
        node,
        type: SemanticTokenTypes.type,
        property: 'upstreamExposedAggregates'
      })
    }

    if (node.downstreamGovernanceRights) {
      acceptor({
        node,
        type: SemanticTokenTypes.keyword,
        keyword: 'downstreamRights'
      })
      acceptor({
        node,
        type: SemanticTokenTypes.property,
        property: 'downstreamGovernanceRights'
      })
    }
  }

  highlightCustomerSupplierRelationship (node: CustomerSupplierRelationship, acceptor: SemanticTokenAcceptor) {
    acceptor({
      node,
      type: SemanticTokenTypes.type,
      property: 'upstream'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'U'
    })
    if (node.upstreamRoles.length > 0) {
      acceptor({
        node,
        type: SemanticTokenTypes.property,
        property: 'upstreamRoles'
      })
    }
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: '->'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'Supplier-Customer'
    })

    acceptor({
      node,
      type: SemanticTokenTypes.type,
      property: 'downstream'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'D'
    })
    if (node.downstreamRoles.length > 0) {
      acceptor({
        node,
        type: SemanticTokenTypes.property,
        property: 'downstreamRoles'
      })
    }
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: '<-'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'Customer-Supplier'
    })

    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'C'
    })
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'S'
    })
  }
}
