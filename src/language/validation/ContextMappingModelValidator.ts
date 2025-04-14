import type { ValidationAcceptor } from 'langium'
import type { ContextMappingModel } from '../generated/ast.js'
import { AbstractContextMapperValidator } from './AbstractContextMapperValidator.js'

export class ContextMappingModelValidator implements AbstractContextMapperValidator<ContextMappingModel> {
  validate (model: ContextMappingModel, acceptor: ValidationAcceptor): void {
    checkForZeroOrOneContextMap(model, acceptor)
  }
}

export function checkForZeroOrOneContextMap (model: ContextMappingModel, acceptor: ValidationAcceptor): void {
  if (model.contextMaps.length > 1) {
    acceptor('error', 'There must be zero or one context map', {
      node: model,
      property: 'contextMaps'
    })
  }
}
