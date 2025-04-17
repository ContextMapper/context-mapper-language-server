import { AbstractContextMapperValidator } from './AbstractContextMapperValidator.js'
import { ContextMapperDslAstType, Value } from '../generated/ast.js'
import { ValidationAcceptor, ValidationChecks } from 'langium'

export class ValueValidator implements AbstractContextMapperValidator<Value> {
  getChecks (): ValidationChecks<ContextMapperDslAstType> {
    return {
      Value: this.validate
    }
  }

  validate (node: Value, acceptor: ValidationAcceptor): void {
    if (node.coreValue.length > 1) {
      acceptor('error', 'There must be zero or one isCore attribute', {
        node,
        property: 'coreValue'
      })
    }
  }
}
