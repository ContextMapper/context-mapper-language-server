import type { ValidationChecks } from 'langium'
import type { ContextMapperDslAstType } from './generated/ast.js'
import type { ContextMapperDslServices } from './context-mapper-dsl-module.js'
import { ContextMappingModelValidator } from './validation/ContextMappingModelValidator.js'
import { ValueValidator } from './validation/ValueValidator.js'

/**
 * Register custom validation checks.
 */
export function registerValidationChecks (services: ContextMapperDslServices) {
  const registry = services.validation.ValidationRegistry
  const validator = services.validation.ContextMapperDslValidator
  const checks: ValidationChecks<ContextMapperDslAstType> = {
    ContextMappingModel: new ContextMappingModelValidator().validate,
    Value: new ValueValidator().validate
  }
  registry.register(checks, validator)
}

export class ContextMapperDslValidator {

}
