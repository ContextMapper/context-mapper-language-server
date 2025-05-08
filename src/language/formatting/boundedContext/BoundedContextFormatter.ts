import { BoundedContext } from '../../generated/ast.js'
import { NodeFormatter } from 'langium/lsp'
import {
  formatAttributes,
  formatBracePair,
  formatEqualSigns,
  formatFieldAttributes,
  formatListSeparators,
  indentChildren
} from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class BoundedContextFormatter extends BracePairFormatter<BoundedContext> {
  override format (node: BoundedContext, formatter: NodeFormatter<BoundedContext>): void {
    super.format(node, formatter)

    formatBracePair(formatter)

    indentChildren(node.modules, formatter)
    indentChildren(node.aggregates, formatter)

    formatAttributes([
      'implements',
      'realizes',
      'refines'
    ], formatter)

    formatFieldAttributes([
      'domainVisionStatement',
      'type',
      'responsibilities',
      'implementationTechnology',
      'knowledgeLevel',
      'businessModel',
      'evolution'
    ], formatter)
    formatEqualSigns(formatter)
    formatListSeparators(formatter)
  }
}
