import { Relationship } from '../../generated/ast.js'
import { Formatting, NodeFormatter } from 'langium/lsp'
import { formatEqualSigns, formatFieldAttributes, formatListSeparators } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class RelationshipFormatter extends BracePairFormatter<Relationship> {
  override format (node: Relationship, formatter: NodeFormatter<Relationship>): void {
    super.format(node, formatter)

    formatter.keywords('->', '<-', '<->', ':')
      .surround(Formatting.oneSpace({ allowMore: false }))

    formatter.keywords('U', 'D', 'OHS', 'PL', 'ACL', 'CF', 'SK', 'P')
      .surround(Formatting.noSpace())

    formatFieldAttributes(['implementationTechnology', 'exposedAggregates', 'downstreamRights'], formatter)

    formatEqualSigns(formatter)
    formatListSeparators(formatter)
  }
}
