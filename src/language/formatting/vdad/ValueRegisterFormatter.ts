import { ValueRegister } from '../../generated/ast.js'
import { NodeFormatter } from 'langium/lsp'
import { indentChildren } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class ValueRegisterFormatter extends BracePairFormatter<ValueRegister> {
  override format (node: ValueRegister, formatter: NodeFormatter<ValueRegister>): void {
    super.format(node, formatter)

    indentChildren(node.valueClusters, formatter)
    indentChildren(node.values, formatter)
    indentChildren(node.valueEpics, formatter)
    indentChildren(node.valueNarratives, formatter)
    indentChildren(node.valueWeightings, formatter)
  }
}
