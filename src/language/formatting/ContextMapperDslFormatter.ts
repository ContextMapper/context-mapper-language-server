import { AstNode } from 'langium'
import { AbstractFormatter } from 'langium/lsp'
import { ContextMapperFormatterRegistry } from './ContextMapperFormatterRegistry.js'

export class ContextMapperDslFormatter extends AbstractFormatter {
  private readonly formatterRegistry: ContextMapperFormatterRegistry

  constructor (formatterRegistry: ContextMapperFormatterRegistry) {
    super()
    this.formatterRegistry = formatterRegistry
  }

  protected override format (node: AstNode): void {
    this.formatterRegistry.get(node)?.format(node, this.getNodeFormatter(node))
  }
}
