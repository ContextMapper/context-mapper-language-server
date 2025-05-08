import { AstNode } from 'langium'
import { AbstractSemanticTokenProvider, LangiumServices, SemanticTokenAcceptor } from 'langium/lsp'
import { SemanticTokenProviderRegistry } from './SemanticTokenProviderRegistry.js'

export class ContextMapperDslSemanticTokenProvider extends AbstractSemanticTokenProvider {
  private readonly semanticTokenProviderRegistry: SemanticTokenProviderRegistry

  constructor (services: LangiumServices, registry: SemanticTokenProviderRegistry) {
    super(services)
    this.semanticTokenProviderRegistry = registry
  }

  protected override highlightElement (node: AstNode, acceptor: SemanticTokenAcceptor) {
    const semanticTokenProvider = this.semanticTokenProviderRegistry.get(node)
    if (semanticTokenProvider) {
      semanticTokenProvider.highlight(node, acceptor)
    } else {
      console.error('Node type with no token provider', node.$type)
    }
  }
}
