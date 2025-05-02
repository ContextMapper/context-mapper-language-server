import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { ValueEpic } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'

export class ValueEpicValidationProvider implements ContextMapperValidationProvider<ValueEpic> {
  validate (node: ValueEpic, acceptor: ValidationAcceptor): void {
    if (node.reducedValues.length === 0) {
      acceptor('error', 'At least one reduced value is required', {
        node,
        property: 'reducedValues'
      })
    }

    if (node.realizedValues.length === 0) {
      acceptor('error', 'At least one realized value is required', {
        node,
        property: 'realizedValues'
      })
    }
  }
}
