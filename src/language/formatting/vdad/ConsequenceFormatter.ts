import { ContextMapperFormatter } from '../ContextMapperFormatter.js'
import { Consequence } from '../../generated/ast.js'
import { Formatting, NodeFormatter } from 'langium/lsp'

export class ConsequenceFormatter implements ContextMapperFormatter<Consequence> {
  format (node: Consequence, formatter: NodeFormatter<Consequence>): void {
    formatter.keywords('good', 'bad', 'neutral')
      .prepend(Formatting.newLine())
  }
}
