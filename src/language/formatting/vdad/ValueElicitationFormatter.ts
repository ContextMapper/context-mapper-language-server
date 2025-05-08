import { ValueElicitation } from '../../generated/ast.js'
import { NodeFormatter } from 'langium/lsp'
import { formatEqualSigns, formatFieldAttributes, indentChildren } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class ValueElicitationFormatter extends BracePairFormatter<ValueElicitation> {
  override format (node: ValueElicitation, formatter: NodeFormatter<ValueElicitation>): void {
    super.format(node, formatter)

    formatFieldAttributes([
      'priority',
      'impact',
      'consequences'
    ], formatter)
    formatEqualSigns(formatter)

    indentChildren(node.consequences, formatter)
  }
}
