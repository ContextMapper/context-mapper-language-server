import { AstNode, ValidationAcceptor } from 'langium'
import { ContextMapperValidationProviderRegistry } from './ContextMapperValidationProviderRegistry.js'

export class ContextMapperDslValidator {
  private readonly _registry: ContextMapperValidationProviderRegistry

  constructor (contextMapperValidationProviderRegistry: ContextMapperValidationProviderRegistry) {
    this._registry = contextMapperValidationProviderRegistry
  }

  validate (node: AstNode, acceptor: ValidationAcceptor) {
    this._registry.get(node)?.validate(node, acceptor)
  }
}
