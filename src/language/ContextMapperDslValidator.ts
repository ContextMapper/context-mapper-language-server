import { AstNode, ValidationRegistry } from 'langium'
import { ContextMappingModelValidator } from './validation/ContextMappingModelValidator.js'
import { ValueValidator } from './validation/ValueValidator.js'
import { AbstractContextMapperValidator } from './validation/AbstractContextMapperValidator.js'

const validators: AbstractContextMapperValidator<AstNode>[] = [
  new ContextMappingModelValidator(),
  new ValueValidator()
]

/**
 * Register custom validation checks.
 */
export function registerValidationChecks (registry: ValidationRegistry) {
  for (const validator of validators) {
    registry.register(validator.getChecks, validator)
  }
}

export class ContextMapperDslValidator {

}
