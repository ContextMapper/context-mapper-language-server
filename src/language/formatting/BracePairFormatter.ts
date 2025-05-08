import { ContextMapperFormatter } from './ContextMapperFormatter.js'
import { NodeFormatter } from 'langium/lsp'
import { formatBracePair } from './FormattingHelper.js'
import { AstNode } from 'langium'

export class BracePairFormatter<T extends AstNode> implements ContextMapperFormatter<T> {
  format (node: T, formatter: NodeFormatter<T>): void {
    formatBracePair(formatter)
  }
}
