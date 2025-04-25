import { type ValidationChecks, ValidationRegistry } from 'langium'
import { ContextMapperDslServices } from '../ContextMapperDslModule.js'
import type { ContextMapperDslAstType } from '../generated/ast.js'

export class ContextMapperDslValidationRegistry extends ValidationRegistry {
  constructor (services: ContextMapperDslServices) {
    super(services)
    const validator = services.validation.ContextMapperDslValidator
    const checks: ValidationChecks<ContextMapperDslAstType> = {
      ContextMappingModel: validator.checkContextMappingModel,
      Value: validator.checkValue
    }
    super.register(checks, validator)
  }
}
