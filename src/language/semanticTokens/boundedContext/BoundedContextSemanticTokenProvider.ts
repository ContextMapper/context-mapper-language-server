import { SemanticTokenAcceptor } from 'langium/lsp'
import { BoundedContext } from '../../generated/ast.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
import {
  highlightAttribute,
  highlightField,
  highlightTypeDeclaration
} from '../HighlightingHelper.js'
import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'

export class BoundedContextSemanticTokenProvider implements ContextMapperSemanticTokenProvider<BoundedContext> {
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
      highlightField(node, acceptor, ['domainVisionStatement'], 'domainVisionStatement', SemanticTokenTypes.string)
    }

    if (node.type) {
      highlightField(node, acceptor, ['type'], 'type')
    }

    if (node.responsibilities) {
      highlightField(node, acceptor, ['responsibilities'], 'responsibilities', SemanticTokenTypes.string)
    }

    if (node.implementationTechnology) {
      highlightField(node, acceptor, ['implementationTechnology'], 'implementationTechnology', SemanticTokenTypes.string)
    }

    if (node.knowledgeLevel) {
      highlightField(node, acceptor, ['knowledgeLevel'], 'knowledgeLevel')
    }

    if (node.businessModel) {
      highlightField(node, acceptor, ['businessModel'], 'businessModel', SemanticTokenTypes.string)
    }

    if (node.evolution) {
      highlightField(node, acceptor, ['evolution'], 'evolution')
    }
  }
}
