import { ValidationAcceptor, type ValidationChecks, ValidationRegistry } from 'langium'
import { ContextMappingModelValidator } from './validation/ContextMappingModelValidator.js'
import { ValueValidator } from './validation/ValueValidator.js'
import type { ContextMapperDslAstType, ContextMappingModel, Value } from './generated/ast.js'

/**
 * Register custom validation checks.
 */
export function registerValidationChecks (registry: ValidationRegistry, validator: ContextMapperDslValidator) {
  const checks: ValidationChecks<ContextMapperDslAstType> = {
    ContextMappingModel: validator.checkContextMappingModel,
    Value: validator.checkValue
  }
  registry.register(checks, validator)
}

export class ContextMapperDslValidator {
  private contextMappingModelValidator = new ContextMappingModelValidator()
  private valueValidator = new ValueValidator()

  checkContextMappingModel (model: ContextMappingModel, acceptor: ValidationAcceptor) {
    this.contextMappingModelValidator.validate(model, acceptor)
  }

  checkValue (value: Value, acceptor: ValidationAcceptor) {
    this.valueValidator.validate(value, acceptor)
  }
}
