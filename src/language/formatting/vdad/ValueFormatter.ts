import { Value } from '../../generated/ast.js'
import { NodeFormatter } from 'langium/lsp'
import { formatEqualSigns, formatFieldAttributes, indentChildren } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class ValueFormatter extends BracePairFormatter<Value> {
  override format (node: Value, formatter: NodeFormatter<Value>): void {
    super.format(node, formatter)

    formatFieldAttributes([
      'isCore',
      'demonstrator',
      'relatedValue',
      'opposingValue'
    ], formatter)
    formatEqualSigns(formatter)

    indentChildren(node.elicitations, formatter)
  }
}
