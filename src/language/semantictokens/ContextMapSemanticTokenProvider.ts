import { SemanticTokenAcceptor } from 'langium/lsp'
import { AstNode } from 'langium'
import { SemanticTokenModifiers, SemanticTokenTypes } from 'vscode-languageserver-types'
import { ContextMap, isPartnership, isSharedKernel, Partnership, SymmetricRelationship } from '../generated/ast.js'
export class ContextMapSemanticTokenProvider {
  public highlightContextMap (node: AstNode, acceptor: SemanticTokenAcceptor) {
    const contextMapNode = node as ContextMap
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: 'ContextMap'
    })

    if (contextMapNode.name) {
      acceptor({
        node,
        type: SemanticTokenTypes.type,
        modifier: SemanticTokenModifiers.declaration,
        property: 'name'
      })
    }

    if (contextMapNode.type) {
      acceptor({
        node,
        type: SemanticTokenTypes.keyword,
        keyword: 'type'
      })
      acceptor({
        node,
        type: SemanticTokenTypes.parameter,
        property: 'type'
      })
    }

    if (contextMapNode.state) {
      acceptor({
        node,
        type: SemanticTokenTypes.keyword,
        keyword: 'state'
      })
      acceptor({
        node,
        type: SemanticTokenTypes.parameter,
        property: 'state'
      })
    }

    if (contextMapNode.boundedContexts) {
      acceptor({
        node,
        type: SemanticTokenTypes.keyword,
        keyword: 'contains'
      })
      acceptor({
        node,
        type: SemanticTokenTypes.type,
        property: 'boundedContexts'
      })
    }
  }

  public highlightRelationship (node: AstNode, acceptor: SemanticTokenAcceptor) {
    if (isPartnership(node)) {
      this.highlightPartnership(node, acceptor)
    }
  }

  private highlightSymmetricRelationship (node: AstNode, acceptor: SemanticTokenAcceptor) {
    const symmetricRelationshipNode = node as SymmetricRelationship

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

    if (symmetricRelationshipNode.name) {
      acceptor({
        node,
        type: SemanticTokenTypes.operator,
        keyword: ':'
      })
      acceptor({
        node,
        type: SemanticTokenTypes.type,
        modifier: SemanticTokenModifiers.declaration,
        property: 'name'
      })
    }

    if (symmetricRelationshipNode.implementationTechnology) {
      acceptor({
        node,
        type: SemanticTokenTypes.keyword,
        keyword: 'implementationTechnology'
      })
      acceptor({
        node,
        type: SemanticTokenTypes.operator,
        keyword: '='
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

  private highlightPartnership (node: AstNode, acceptor: SemanticTokenAcceptor) {
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: '[\'P\']'
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

  private highlightSharedKernel (node: AstNode, acceptor: SemanticTokenAcceptor) {
    acceptor({
      node,
      type: SemanticTokenTypes.keyword,
      keyword: '[\'SK\']'
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
}
