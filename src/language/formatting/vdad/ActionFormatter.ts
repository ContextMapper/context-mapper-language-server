import { ContextMapperFormatter } from '../ContextMapperFormatter.js'
import { Action } from '../../generated/ast.js'
import { Formatting, NodeFormatter } from 'langium/lsp'

export class ActionFormatter implements ContextMapperFormatter<Action> {
  format (node: Action, formatter: NodeFormatter<Action>): void {
    formatter.keywords('action')
      .prepend(Formatting.newLine())
  }
}
