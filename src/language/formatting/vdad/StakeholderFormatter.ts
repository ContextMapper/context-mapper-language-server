import { Stakeholder } from '../../generated/ast.js'
import { NodeFormatter } from 'langium/lsp'
import { formatEqualSigns, formatFieldAttributes } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class StakeholderFormatter extends BracePairFormatter<Stakeholder> {
  override format (node: Stakeholder, formatter: NodeFormatter<Stakeholder>): void {
    super.format(node, formatter)

    formatFieldAttributes([
      'influence',
      'interest',
      'description'
    ], formatter)
    formatEqualSigns(formatter)
  }
}
