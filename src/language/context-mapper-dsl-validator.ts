import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { ContextMapperDslAstType, Person } from './generated/ast.js';
import type { ContextMapperDslServices } from './context-mapper-dsl-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: ContextMapperDslServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.ContextMapperDslValidator;
    const checks: ValidationChecks<ContextMapperDslAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class ContextMapperDslValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
