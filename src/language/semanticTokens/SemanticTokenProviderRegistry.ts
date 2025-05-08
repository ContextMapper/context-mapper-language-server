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
import { StakeholdersSemanticTokenProvider } from './vdad/StakeholdersSemanticTokenProvider.js'
import { ValueClusterSemanticTokenProvider } from './vdad/ValueClusterSemanticTokenProvider.js'
import { ValueElicitationSemanticTokenProvider } from './vdad/ValueElicitationSemanticTokenProvider.js'
import { ValueEpicSemanticTokenProvider } from './vdad/ValueEpicSemanticTokenProvider.js'
import { ValueNarrativeSemanticTokenProvider } from './vdad/ValueNarrativeSemanticTokenProvider.js'
import { ValueRegisterSemanticTokenProvider } from './vdad/ValueRegisterSemanticTokenProvider.js'
import { ValueSemanticTokenProvider } from './vdad/ValueSemanticTokenProvider.js'
import { ValueWeightingSemanticTokenProvider } from './vdad/ValueWeightingSemanticTokenProvider.js'
import { ContextMappingModelSemanticTokenProvider } from './model/ContextMappingModelSemanticTokenProvider.js'
import {
  Action,
  Aggregate,
  BoundedContext,
  Consequence,
  ContextMap,
  ContextMappingModel,
  CustomerSupplierRelationship,
  Domain,
  NormalFeature,
  Partnership,
  SculptorModule,
  SharedKernel,
  Stakeholder,
  StakeholderGroup,
  Stakeholders,
  StoryFeature,
  StoryValuation,
  Subdomain,
  UpstreamDownstreamRelationship,
  UseCase,
  UserStory,
  Value,
  ValueCluster,
  ValueElicitation,
  ValueEpic,
  ValueNarrative,
  ValueRegister,
  ValueWeighting
} from '../generated/ast.js'

export class SemanticTokenProviderRegistry {
  private readonly _domainProvider = new DomainSemanticTokenProvider()
  private readonly _relationshipProvider = new RelationshipSemanticTokenProvider()
  private readonly _featureProvider = new FeatureSemanticTokenProvider()
  private readonly _userRequirementProvider = new RequirementsSemanticTokenProvider()
  private readonly _stakeholderProvider = new AbstractStakeholderSemanticTokenProvider()

  private readonly semanticTokenProviders = new Map<string, ContextMapperSemanticTokenProvider<AstNode>>([
    [Aggregate, new AggregateSemanticTokenProvider()],
    [BoundedContext, new BoundedContextSemanticTokenProvider()],
    [SculptorModule, new SculptorModuleSemanticTokenProvider()],
    [ContextMap, new ContextMapSemanticTokenProvider()],
    [Partnership, this._relationshipProvider],
    [SharedKernel, this._relationshipProvider],
    [CustomerSupplierRelationship, this._relationshipProvider],
    [UpstreamDownstreamRelationship, this._relationshipProvider],
    [Domain, this._domainProvider],
    [Subdomain, this._domainProvider],
    [NormalFeature, this._featureProvider],
    [StoryFeature, this._featureProvider],
    [UseCase, this._userRequirementProvider],
    [UserStory, this._userRequirementProvider],
    [StoryValuation, new StoryValuationSemanticTokenProvider()],
    [Stakeholder, this._stakeholderProvider],
    [StakeholderGroup, this._stakeholderProvider],
    [Action, new ActionSemanticTokenProvider()],
    [Consequence, new ConsequenceSemanticTokenProvider()],
    [Stakeholders, new StakeholdersSemanticTokenProvider()],
    [ValueCluster, new ValueClusterSemanticTokenProvider()],
    [ValueElicitation, new ValueElicitationSemanticTokenProvider()],
    [ValueEpic, new ValueEpicSemanticTokenProvider()],
    [ValueNarrative, new ValueNarrativeSemanticTokenProvider()],
    [ValueRegister, new ValueRegisterSemanticTokenProvider()],
    [Value, new ValueSemanticTokenProvider()],
    [ValueWeighting, new ValueWeightingSemanticTokenProvider()],
    [ContextMappingModel, new ContextMappingModelSemanticTokenProvider()]
  ])

  get (node: AstNode): ContextMapperSemanticTokenProvider<AstNode> | undefined {
    return this.semanticTokenProviders.get(node.$type)
  }
}
