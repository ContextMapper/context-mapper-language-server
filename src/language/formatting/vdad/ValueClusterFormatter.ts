import { ValueCluster } from '../../generated/ast.js'
import { NodeFormatter } from 'langium/lsp'
import { formatEqualSigns, formatFieldAttributes, indentChildren } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class ValueClusterFormatter extends BracePairFormatter<ValueCluster> {
  override format (node: ValueCluster, formatter: NodeFormatter<ValueCluster>): void {
    super.format(node, formatter)

    formatFieldAttributes([
      'core',
      'demonstrator',
      'relatedValue',
      'opposingValue'
    ], formatter)
    formatEqualSigns(formatter)

    indentChildren(node.values, formatter)
    indentChildren(node.elicitations, formatter)
  }
}
