import type { ValidationChecks } from 'langium'
import type { ContextMapperDslAstType } from './generated/ast.js'
import type { ContextMapperDslServices } from './context-mapper-dsl-module.js'

/**
 * Register custom validation checks.
 */
export function registerValidationChecks (services: ContextMapperDslServices) {
  const registry = services.validation.ValidationRegistry
  const validator = services.validation.ContextMapperDslValidator
  const checks: ValidationChecks<ContextMapperDslAstType> = {}
  registry.register(checks, validator)
}

/**
 * Implementation of custom validations.
 */
export class ContextMapperDslValidator {

}
