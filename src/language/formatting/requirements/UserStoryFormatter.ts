import { UserStory } from '../../generated/ast.js'
import { Formatting, NodeFormatter } from 'langium/lsp'
import { indentChildren } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class UserStoryFormatter extends BracePairFormatter<UserStory> {
  override format (node: UserStory, formatter: NodeFormatter<UserStory>): void {
    super.format(node, formatter)

    formatter.keywords('As a', 'As an')
      .prepend(Formatting.indent())

    if (node.features.length > 1) {
      indentChildren(node.features, formatter)

      formatter.keywords('so that')
        .prepend(Formatting.newLine())
        .prepend(Formatting.indent())
    }
  }
}
