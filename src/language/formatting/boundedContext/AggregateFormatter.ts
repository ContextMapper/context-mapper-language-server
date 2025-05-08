import { Aggregate } from '../../generated/ast.js'
import { Formatting, NodeFormatter } from 'langium/lsp'
import { formatEqualSigns, formatFieldAttributes, formatListSeparators } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class AggregateFormatter extends BracePairFormatter<Aggregate> {
  override format (node: Aggregate, formatter: NodeFormatter<Aggregate>): void {
    super.format(node, formatter)

    formatter.property('doc')
      .prepend(Formatting.newLine())

    formatFieldAttributes([
      'responsibilities',
      'useCases',
      'userStories',
      'userRequirements',
      'features',
      'owner',
      'knowledgeLevel',
      'likelihoodForChange',
      'storageVolatility',
      'contentVolatility',
      'availabilityCriticality',
      'consistencyCriticality',
      'storageSimilarity',
      'securityCriticality',
      'securityZone',
      'securityAccessGroup'
    ], formatter)
    formatEqualSigns(formatter)
    formatListSeparators(formatter)
  }
}
