import { ContextMapperSemanticTokenProvider } from './ContextMapperSemanticTokenProvider.js'
import { AstNode } from 'langium'
import { AggregateSemanticTokenProvider } from './boundedContext/AggregateSemanticTokenProvider.js'
import { BoundedContextSemanticTokenProvider } from './boundedContext/BoundedContextSemanticTokenProvider.js'
import { SculptorModuleSemanticTokenProvider } from './boundedContext/SculptorModuleSemanticTokenProvider.js'
import { ContextMapSemanticTokenProvider } from './contextMap/ContextMapSemanticTokenProvider.js'
import { RelationshipSemanticTokenProvider } from './contextMap/RelationshipSemanticTokenProvider.js'
import { DomainSemanticTokenProvider } from './domain/DomainSemanticTokenProvider.js'
import { FeatureSemanticTokenProvider } from './requirements/FeatureSemanticTokenProvider.js'
import { RequirementsSemanticTokenProvider } from './requirements/RequirementsSemanticTokenProvider.js'
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
import { ValueSemanticTokenProvider } from './vdad/ValueSemanticTokenProvider.js'
import { ValueWeightingSemanticTokenProvider } from './vdad/ValueWeightingSemanticTokenProvider.js'
import { ContextMappingModelSemanticTokenProvider } from './model/ContextMappingModelSemanticTokenProvider.js'

export class SemanticTokenProviderRegistry {
  private readonly semanticTokenProviders: ContextMapperSemanticTokenProvider<AstNode>[] = [
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
    new ValueWeightingSemanticTokenProvider(),
    new ContextMappingModelSemanticTokenProvider()
  ]

  get (node: AstNode): ContextMapperSemanticTokenProvider<AstNode> | undefined {
    return this.semanticTokenProviders.find(provider => provider.supports(node))
  }
}
