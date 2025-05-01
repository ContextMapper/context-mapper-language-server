import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { ValueEpic } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'

export class ValueEpicValidationProvider implements ContextMapperValidationProvider<ValueEpic> {
  validate (node: ValueEpic, acceptor: ValidationAcceptor): void {
    // TODO: regex enforce realizedValues
    // TODO: regex enforce reducedValues
  }
}
