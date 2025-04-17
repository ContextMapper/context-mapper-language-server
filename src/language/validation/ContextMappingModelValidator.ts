import type { ValidationAcceptor, ValidationChecks } from 'langium'
import type { ContextMapperDslAstType, ContextMappingModel } from '../generated/ast.js'
import { AbstractContextMapperValidator } from './AbstractContextMapperValidator.js'

export class ContextMappingModelValidator implements AbstractContextMapperValidator<ContextMappingModel> {
  getChecks (): ValidationChecks<ContextMapperDslAstType> {
    return {
      ContextMappingModel: this.validate
    }
  }

  validate (model: ContextMappingModel, acceptor: ValidationAcceptor): void {
    checkForZeroOrOneContextMap(model, acceptor)
  }
}

function checkForZeroOrOneContextMap (model: ContextMappingModel, acceptor: ValidationAcceptor): void {
  if (model.contextMaps.length > 1) {
    acceptor('error', 'There must be zero or one context map', {
      node: model,
      property: 'contextMaps'
    })
  }
}
