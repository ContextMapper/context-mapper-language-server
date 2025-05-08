import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { SculptorModule } from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import {
  highlightKeyword,
  highlightField,
  highlightString,
  highlightTypeDeclaration
} from '../HighlightingHelper.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'

export class SculptorModuleSemanticTokenProvider implements ContextMapperSemanticTokenProvider<SculptorModule> {
  highlight (node: SculptorModule, acceptor: SemanticTokenAcceptor) {
    if (node.doc) {
      highlightString(node, acceptor, 'doc')
    }
    highlightTypeDeclaration(node, acceptor, 'Module')

    if (node.external) {
      highlightKeyword(node, acceptor, 'external')
    }

    if (node.basePackage) {
      highlightField(node, acceptor, ['basePackage'], 'basePackage', SemanticTokenTypes.namespace)
    }

    if (node.hint) {
      highlightField(node, acceptor, ['hint'], 'hint', SemanticTokenTypes.string)
    }
  }
}
