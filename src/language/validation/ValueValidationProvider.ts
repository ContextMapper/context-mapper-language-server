import { ContextMapperValidationProvider } from './ContextMapperValidationProvider.js'
import { isValue, Value } from '../generated/ast.js'
import { AstNode, ValidationAcceptor } from 'langium'

export class ValueValidationProvider implements ContextMapperValidationProvider<Value> {
  supports (node: AstNode): node is Value {
    return isValue(node)
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
