import { SculptorModule } from '../../generated/ast.js'
import { Formatting, NodeFormatter } from 'langium/lsp'
import { formatEqualSigns, formatFieldAttributes, indentChildren } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class SculptorModuleFormatter extends BracePairFormatter<SculptorModule> {
  override format (node: SculptorModule, formatter: NodeFormatter<SculptorModule>): void {
    super.format(node, formatter)

    formatter.property('doc')
      .prepend(Formatting.newLine())

    formatFieldAttributes([
      'external',
      'basePackage',
      'hint'
    ], formatter)
    formatEqualSigns(formatter)

    indentChildren(node.aggregates, formatter)
  }
}
