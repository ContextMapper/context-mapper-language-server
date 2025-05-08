import { AstNode } from 'langium'
import { NodeFormatter } from 'langium/lsp'

export interface ContextMapperFormatter<T extends AstNode> {
  format(node: T, formatter: NodeFormatter<T>): void
}
