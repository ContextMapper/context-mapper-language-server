import { ContextMap } from '../../generated/ast.js'
import { NodeFormatter } from 'langium/lsp'
import { formatEqualSigns, formatFieldAttributes, formatListSeparators, indentChildren } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class ContextMapFormatter extends BracePairFormatter<ContextMap> {
  override format (node: ContextMap, formatter: NodeFormatter<ContextMap>): void {
    super.format(node, formatter)

    formatFieldAttributes(['type', 'state', 'contains'], formatter)
    formatEqualSigns(formatter)
    formatListSeparators(formatter)

    indentChildren(node.relationships, formatter)
  }
}
