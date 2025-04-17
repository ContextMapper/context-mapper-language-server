import type { ValidationAcceptor } from 'langium'
import type { ContextMappingModel } from '../generated/ast.js'
import { ContextMapperValidator } from './ContextMapperValidator.js'

export class ContextMappingModelValidator implements ContextMapperValidator<ContextMappingModel> {
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
