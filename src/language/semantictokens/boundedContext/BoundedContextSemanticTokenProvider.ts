import { SemanticTokenAcceptor } from 'langium/lsp'
import { BoundedContext, isBoundedContext } from '../../generated/ast.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
import {
  highlightAttribute,
  highlightMemberAttribute,
  highlightTypeDeclaration
} from '../HighlightingHelper.js'
import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { AstNode } from 'langium'

export class BoundedContextSemanticTokenProvider implements ContextMapperSemanticTokenProvider<BoundedContext> {
  supports (node: AstNode): node is BoundedContext {
    return isBoundedContext(node)
  }

  highlight (node: BoundedContext, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'BoundedContext')

    if (node.implementedDomainParts.length > 0) {
      highlightAttribute(node, acceptor, ['implements'], 'implementedDomainParts')
    }

    if (node.realizedBoundedContexts.length > 0) {
      highlightAttribute(node, acceptor, ['realizes'], 'realizedBoundedContexts')
    }

    if (node.refinedBoundedContext) {
      highlightAttribute(node, acceptor, ['refines'], 'refinedBoundedContext')
    }

    if (node.domainVisionStatement) {
      highlightMemberAttribute(node, acceptor, ['domainVisionStatement'], 'domainVisionStatement', SemanticTokenTypes.string)
    }

    if (node.type) {
      highlightMemberAttribute(node, acceptor, ['type'], 'type')
    }

    if (node.responsibilities) {
      highlightMemberAttribute(node, acceptor, ['responsibilities'], 'responsibilities', SemanticTokenTypes.string)
    }

    if (node.implementationTechnology) {
      highlightMemberAttribute(node, acceptor, ['implementationTechnology'], 'implementationTechnology', SemanticTokenTypes.string)
    }

    if (node.knowledgeLevel) {
      highlightMemberAttribute(node, acceptor, ['knowledgeLevel'], 'knowledgeLevel')
    }

    if (node.businessModel) {
      highlightMemberAttribute(node, acceptor, ['businessModel'], 'businessModel', SemanticTokenTypes.string)
    }

    if (node.evolution) {
      highlightMemberAttribute(node, acceptor, ['evolution'], 'evolution')
    }
  }
}
