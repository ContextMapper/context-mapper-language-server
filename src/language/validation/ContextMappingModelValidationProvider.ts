import type { AstNode, ValidationAcceptor } from 'langium'
import { ContextMappingModel, isContextMappingModel } from '../generated/ast.js'
import { ContextMapperValidationProvider } from './ContextMapperValidationProvider.js'

export class ContextMappingModelValidationProvider implements ContextMapperValidationProvider<ContextMappingModel> {
  supports (node: AstNode): node is ContextMappingModel {
    return isContextMappingModel(node)
  }

  validate (model: ContextMappingModel, acceptor: ValidationAcceptor): void {
    this.checkForZeroOrOneContextMap(model, acceptor)
  }

  private checkForZeroOrOneContextMap (model: ContextMappingModel, acceptor: ValidationAcceptor): void {
    if (model.contextMaps.length > 1) {
      acceptor('error', 'There must be zero or one context map', {
        node: model,
        property: 'contextMaps'
      })
    }
  }
}
