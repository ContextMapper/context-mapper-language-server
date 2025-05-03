import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { ContextMappingModel } from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { SemanticTokenTypes } from 'vscode-languageserver-types'

const ML_COMMENT_REGEX = /\/\*[\s\S]*?\*\//g
const SL_COMMENT_REGEX = /\/\/[^\n\r]*/g

export class ContextMappingModelSemanticTokenProvider implements ContextMapperSemanticTokenProvider<ContextMappingModel> {
  highlight (node: ContextMappingModel, acceptor: SemanticTokenAcceptor): void {
    if (node.$cstNode) {
      this.highlightComments(ML_COMMENT_REGEX, node, acceptor)
      this.highlightComments(SL_COMMENT_REGEX, node, acceptor)
    }
  }

  private highlightComments (regex: RegExp, node: ContextMappingModel, acceptor: SemanticTokenAcceptor) {
    if (node.$document == null) {
      throw new Error('Document not found')
    }
    const text = node.$document.textDocument.getText()
    for (const match of text.matchAll(regex)) {
      if (match?.index == null) {
        continue
      }
      const position = node.$document.textDocument.positionAt(match.index)
      acceptor({
        type: SemanticTokenTypes.comment,
        line: position.line,
        char: position.character,
        length: match[0].length
      })
    }
  }
}
