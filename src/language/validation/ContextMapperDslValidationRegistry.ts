import { type ValidationChecks, ValidationRegistry } from 'langium'
import { ContextMapperDslServices } from '../ContextMapperDslModule.js'
import { ContextMapperDslAstType } from '../generated/ast.js'
import { ContextMapperValidationProviderRegistry } from './ContextMapperValidationProviderRegistry.js'

export class ContextMapperDslValidationRegistry extends ValidationRegistry {
  constructor (services: ContextMapperDslServices, validationProviderRegistry: ContextMapperValidationProviderRegistry) {
    super(services)
    const validator = services.validation.ContextMapperDslValidator

    const typesToValidate = validationProviderRegistry.getRegisteredTypes()

    // dynamically set validator for all grammar elements
    const checks: ValidationChecks<ContextMapperDslAstType> = Object.fromEntries(
      typesToValidate.map(type => [type, validator.validate])
    )

    super.register(checks, validator)
  }
}
