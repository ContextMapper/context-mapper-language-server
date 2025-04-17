import { AstNode } from 'langium'
import { AbstractSemanticTokenProvider, SemanticTokenAcceptor } from 'langium/lsp'
import {
  ContextMappingModel,
  isContextMappingModel
} from '../generated/ast.js'
import { ContextMapSemanticTokenProvider } from './contextMap/ContextMapSemanticTokenProvider.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
import { BoundedContextSemanticTokenProvider } from './boundedContext/BoundedContextSemanticTokenProvider.js'
import { DomainSemanticTokenProvider } from './domain/DomainSemanticTokenProvider.js'
import { AggregateSemanticTokenProvider } from './boundedContext/AggregateSemanticTokenProvider.js'
import { RequirementsSemanticTokenProvider } from './requirements/RequirementsSemanticTokenProvider.js'
import { ValueSemanticTokenProvider } from './vdad/ValueSemanticTokenProvider.js'
import { ContextMapperSemanticTokenProvider } from './ContextMapperSemanticTokenProvider.js'
import { SculptorModuleSemanticTokenProvider } from './boundedContext/SculptorModuleSemanticTokenProvider.js'
import { RelationshipSemanticTokenProvider } from './contextMap/RelationshipSemanticTokenProvider.js'
import { FeatureSemanticTokenProvider } from './requirements/FeatureSemanticTokenProvider.js'
import { StoryValuationSemanticTokenProvider } from './requirements/StoryValuationSemanticTokenProvider.js'
import { AbstractStakeholderSemanticTokenProvider } from './vdad/AbstractStakeholderSemanticTokenProvider.js'
import { ActionSemanticTokenProvider } from './vdad/ActionSemanticTokenProvider.js'
import { ConsequenceSemanticTokenProvider } from './vdad/ConsequenceSemanticTokenProvider.js'
import { StakeholderSemanticTokenProvider } from './vdad/StakeholderSemanticTokenProvider.js'
import { ValueClusterSemanticTokenProvider } from './vdad/ValueClusterSemanticTokenProvider.js'
import { ValueElicitationSemanticTokenProvider } from './vdad/ValueElicitationSemanticTokenProvider.js'
import { ValueEpicSemanticTokenProvider } from './vdad/ValueEpicSemanticTokenProvider.js'
import { ValueNarrativeSemanticTokenProvider } from './vdad/ValueNarrativeSemanticTokenProvider.js'
import { ValueRegisterSemanticTokenProvider } from './vdad/ValueRegisterSemanticTokenProvider.js'
import { ValueWeightingSemanticTokenProvider } from './vdad/ValueWeightingSemanticTokenProvider.js'

export class ContextMapperDslSemanticTokenProvider extends AbstractSemanticTokenProvider {
  private semanticTokenProviders: ContextMapperSemanticTokenProvider<AstNode>[] = [
    new AggregateSemanticTokenProvider(),
    new BoundedContextSemanticTokenProvider(),
    new SculptorModuleSemanticTokenProvider(),
    new ContextMapSemanticTokenProvider(),
    new RelationshipSemanticTokenProvider(),
    new DomainSemanticTokenProvider(),
    new FeatureSemanticTokenProvider(),
    new RequirementsSemanticTokenProvider(),
    new StoryValuationSemanticTokenProvider(),
    new AbstractStakeholderSemanticTokenProvider(),
    new ActionSemanticTokenProvider(),
    new ConsequenceSemanticTokenProvider(),
    new StakeholderSemanticTokenProvider(),
    new ValueClusterSemanticTokenProvider(),
    new ValueElicitationSemanticTokenProvider(),
    new ValueEpicSemanticTokenProvider(),
    new ValueNarrativeSemanticTokenProvider(),
    new ValueRegisterSemanticTokenProvider(),
    new ValueSemanticTokenProvider(),
    new ValueWeightingSemanticTokenProvider()
  ]

  protected override highlightElement (node: AstNode, acceptor: SemanticTokenAcceptor) {
    if (isContextMappingModel(node)) {
      const modelNode = node as ContextMappingModel

      if (modelNode.$cstNode) {
        this.highlightComments(/\/\*[\s\S]*?\*\//g, modelNode, acceptor)
        this.highlightComments(/\/\/[^\n\r]*/g, modelNode, acceptor)
      }
    } else {
      for (const provider of this.semanticTokenProviders) {
        if (provider.supports(node)) {
          provider.highlight(node, acceptor)
          return
        }
      }

      console.error('Uncaught node type', node.$type)
    }
  }

  private highlightComments (regex: RegExp, node: ContextMappingModel, acceptor: SemanticTokenAcceptor) {
    const text = node.$document!!.textDocument.getText()
    for (const match of text.matchAll(regex)) {
      if (match == null || match.index == null) {
        continue
      }
      const position = node.$document!!.textDocument.positionAt(match.index)
      acceptor({
        type: SemanticTokenTypes.comment,
        line: position.line,
        char: position.character,
        length: match[0].length
      })
    }
  }
}
