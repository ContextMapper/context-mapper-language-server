import { DefaultNodeKindProvider } from 'langium/lsp'
import { AstNode, AstNodeDescription } from 'langium'
import { SymbolKind } from 'vscode-languageserver-types'

export class ContextMapperDslNodeKindProvider extends DefaultNodeKindProvider {
  override getSymbolKind (_node: AstNode | AstNodeDescription): SymbolKind {
    return SymbolKind.Object
  }
}
