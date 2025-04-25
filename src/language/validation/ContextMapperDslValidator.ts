import { ValidationAcceptor } from 'langium'
import type { ContextMappingModel, Value } from '../generated/ast.js'
import { ContextMapperValidationProviderRegistry } from './ContextMapperValidationProviderRegistry.js'

export class ContextMapperDslValidator {
  private readonly _registry: ContextMapperValidationProviderRegistry

  constructor (contextMapperValidationProviderRegistry: ContextMapperValidationProviderRegistry) {
    this._registry = contextMapperValidationProviderRegistry
  }

  checkContextMappingModel (model: ContextMappingModel, acceptor: ValidationAcceptor) {
    this._registry.get(model)?.validate(model, acceptor)
  }

  checkValue (value: Value, acceptor: ValidationAcceptor) {
    this._registry.get(value)?.validate(value, acceptor)
  }
}
