import { AstNode } from 'langium'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { SemanticTokenModifiers, SemanticTokenTypes } from 'vscode-languageserver-types'

export function highlightString (node: AstNode, acceptor: SemanticTokenAcceptor, property: string) {
  acceptor({
    node,
    type: SemanticTokenTypes.string,
    property
  })
}

export function highlightKeyword (node: AstNode, acceptor: SemanticTokenAcceptor, keyword: string) {
  acceptor({
    node,
    type: SemanticTokenTypes.keyword,
    keyword
  })
}

export function highlightType (node: AstNode, acceptor: SemanticTokenAcceptor, property: string, modifiers: string[] = []) {
  acceptor({
    node,
    type: SemanticTokenTypes.type,
    property,
    modifier: modifiers
  })
}

export function highlightTypeDeclaration (node: AstNode, acceptor: SemanticTokenAcceptor, keyword: string, hasName: Boolean = true) {
  highlightKeyword(node, acceptor, keyword)
  if (hasName) {
    highlightType(node, acceptor, 'name', [SemanticTokenModifiers.declaration])
  }
}

export function highlightMemberAttribute (node: AstNode, acceptor: SemanticTokenAcceptor, keywords: string[], property: string, type: SemanticTokenTypes = SemanticTokenTypes.enumMember) {
  keywords.forEach(keyword => highlightKeyword(node, acceptor, keyword))
  acceptor({
    node,
    type,
    property
  })
}

export function highlightAttribute (node: AstNode, acceptor: SemanticTokenAcceptor, keywords: string[], property: string, type: SemanticTokenTypes = SemanticTokenTypes.type) {
  keywords.forEach(keyword => highlightKeyword(node, acceptor, keyword))
  acceptor({
    node,
    type,
    property
  })
}
