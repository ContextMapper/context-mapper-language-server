import { DomainPart, isDomain, isSubdomain, Subdomain } from '../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
import { highlightAttribute, highlightMemberAttribute, highlightTypeDeclaration } from './HighlightingHelper.js'

export class DomainSemanticTokenProvider {
  public highlightDomainPart (node: DomainPart, acceptor: SemanticTokenAcceptor) {
    let keyword = null
    if (isDomain(node)) {
      keyword = 'Domain'
    } else if (isSubdomain(node)) {
      keyword = 'Subdomain'
    }
    if (keyword) {
      highlightTypeDeclaration(node, acceptor, keyword, node.name != null)
    }

    if (node.domainVisionStatement) {
      highlightMemberAttribute(node, acceptor, ['domainVisionStatement'], 'domainVisionStatement', SemanticTokenTypes.string)
    }

    if (isSubdomain(node)) {
      this.highlightSubdomain(node, acceptor)
    }
  }

  public highlightSubdomain (node: Subdomain, acceptor: SemanticTokenAcceptor) {
    if (node.supportedFeatures.length > 0) {
      highlightAttribute(node, acceptor, ['supports'], 'supportedFeatures', true)
    }

    if (node.type) {
      highlightMemberAttribute(node, acceptor, ['type'], 'type')
    }
  }
}
