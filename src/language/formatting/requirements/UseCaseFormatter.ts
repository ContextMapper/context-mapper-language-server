import { UseCase } from '../../generated/ast.js'
import { NodeFormatter } from 'langium/lsp'
import { formatEqualSigns, formatFieldAttributes, formatListSeparators, indentChildren } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class UseCaseFormatter extends BracePairFormatter<UseCase> {
  override format (node: UseCase, formatter: NodeFormatter<UseCase>): void {
    super.format(node, formatter)

    formatFieldAttributes([
      'actor',
      'secondaryActors',
      'interactions',
      'benefit',
      'scope',
      'level'
    ], formatter)
    formatEqualSigns(formatter)
    formatListSeparators(formatter)

    indentChildren(node.features, formatter)
  }
}
