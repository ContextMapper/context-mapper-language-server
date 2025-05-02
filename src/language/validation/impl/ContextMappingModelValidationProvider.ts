import type { ValidationAcceptor } from 'langium'
import { ContextMappingModel } from '../../generated/ast.js'
import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { enforceZeroOrOneCardinality } from '../ValidationHelper.js'

export class ContextMappingModelValidationProvider implements ContextMapperValidationProvider<ContextMappingModel> {
  validate (model: ContextMappingModel, acceptor: ValidationAcceptor): void {
    enforceZeroOrOneCardinality(model, 'contextMap', acceptor)
  }
}
