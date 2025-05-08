import { StakeholderGroup } from '../../generated/ast.js'
import { NodeFormatter } from 'langium/lsp'
import { indentChildren } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class StakeholderGroupFormatter extends BracePairFormatter<StakeholderGroup> {
  override format (node: StakeholderGroup, formatter: NodeFormatter<StakeholderGroup>): void {
    super.format(node, formatter)

    indentChildren(node.stakeholders, formatter)
  }
}
