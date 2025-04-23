import { AstNode } from 'langium'
import { ContextMapperValidationProvider } from './ContextMapperValidationProvider.js'
import { ValueValidationProvider } from './ValueValidationProvider.js'
import { ContextMappingModelValidationProvider } from './ContextMappingModelValidationProvider.js'

export class ContextMapperValidationProviderRegistry {
  private readonly _providers: ContextMapperValidationProvider<AstNode>[] = [
    new ValueValidationProvider(),
    new ContextMappingModelValidationProvider()
  ]

  get (node: AstNode): ContextMapperValidationProvider<AstNode> | undefined {
    return this._providers.find(p => p.supports(node))
  }
}
