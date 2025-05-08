import { Stakeholders } from '../../generated/ast.js'
import { NodeFormatter } from 'langium/lsp'
import { formatListSeparators, indentChildren } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class StakeholdersFormatter extends BracePairFormatter<Stakeholders> {
  override format (node: Stakeholders, formatter: NodeFormatter<Stakeholders>): void {
    super.format(node, formatter)

    formatListSeparators(formatter)
    indentChildren(node.stakeholders, formatter)
  }
}
