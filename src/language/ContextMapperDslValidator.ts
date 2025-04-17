import { AstNode, type ValidationChecks, ValidationRegistry } from 'langium'
import { ContextMappingModelValidator } from './validation/ContextMappingModelValidator.js'
import { ValueValidator } from './validation/ValueValidator.js'
import { AbstractContextMapperValidator } from './validation/AbstractContextMapperValidator.js'
import type { ContextMapperDslAstType } from './generated/ast.js'

const validators: AbstractContextMapperValidator<AstNode>[] = [
  new ContextMappingModelValidator(),
  new ValueValidator()
]

/**
 * Register custom validation checks.
 */
export function registerValidationChecks (registry: ValidationRegistry, validator: ContextMapperDslValidator) {
  const validatorChecks: ValidationChecks<ContextMapperDslAstType>[] = []
  for (const validator of validators) {
    validatorChecks.push(validator.getChecks())
  }
  const checks: ValidationChecks<ContextMapperDslAstType> = Object.assign({}, ...validatorChecks)
  registry.register(checks, validator)
}

export class ContextMapperDslValidator {

}
