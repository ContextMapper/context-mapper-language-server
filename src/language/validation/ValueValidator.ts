import { AbstractContextMapperValidator } from './AbstractContextMapperValidator.js'
import { Value } from '../generated/ast.js'
import { ValidationAcceptor } from 'langium'

export class ValueValidator implements AbstractContextMapperValidator<Value> {
  validate (node: Value, acceptor: ValidationAcceptor): void {
    if (node.coreValue.length > 1) {
      acceptor('error', 'There must be zero or one isCore attribute', {
        node,
        property: 'coreValue'
      })
    }
  }
}
