import {
  Action,
  Aggregate,
  BoundedContext,
  Consequence,
  ContextMap,
  ContextMappingModel,
  CustomerSupplierRelationship,
  Domain,
  Partnership,
  SculptorModule,
  SharedKernel,
  Stakeholder,
  StakeholderGroup,
  Stakeholders,
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
import { BoundedContextFormatter } from './boundedContext/BoundedContextFormatter.js'
import { AstNode } from 'langium'
import { ContextMapperFormatter } from './ContextMapperFormatter.js'
import { ContextMappingModelFormatter } from './model/ContextMappingModelFormatter.js'
import { DomainFormatter } from './domain/DomainFormatter.js'
import { ContextMapFormatter } from './contextMap/ContextMapFormatter.js'
import { SubDomainFormatter } from './domain/SubDomainFormatter.js'
import { RelationshipFormatter } from './contextMap/RelationshipFormatter.js'
import { AggregateFormatter } from './boundedContext/AggregateFormatter.js'
import { SculptorModuleFormatter } from './boundedContext/SculptorModuleFormatter.js'
import { UseCaseFormatter } from './requirements/UseCaseFormatter.js'
import { UserStoryFormatter } from './requirements/UserStoryFormatter.js'
import { StakeholdersFormatter } from './vdad/StakeholdersFormatter.js'
import { StakeholderGroupFormatter } from './vdad/StakeholderGroupFormatter.js'
import { StakeholderFormatter } from './vdad/StakeholderFormatter.js'
import { ValueRegisterFormatter } from './vdad/ValueRegisterFormatter.js'
import { ValueClusterFormatter } from './vdad/ValueClusterFormatter.js'
import { ValueFormatter } from './vdad/ValueFormatter.js'
import { ValueElicitationFormatter } from './vdad/ValueElicitationFormatter.js'
import { BracePairFormatter } from './BracePairFormatter.js'
import { ConsequenceFormatter } from './vdad/ConsequenceFormatter.js'
import { ActionFormatter } from './vdad/ActionFormatter.js'

export class ContextMapperFormatterRegistry {
  private readonly _bracePairFormatter = new BracePairFormatter<AstNode>()
  private readonly _relationshipFormatter = new RelationshipFormatter()

  private readonly _formatters = new Map<string, ContextMapperFormatter<AstNode>>([
    [ContextMappingModel, new ContextMappingModelFormatter()],
    [ContextMap, new ContextMapFormatter()],
    [BoundedContext, new BoundedContextFormatter()],
    [Domain, new DomainFormatter()],
    [Subdomain, new SubDomainFormatter()],
    [Partnership, this._relationshipFormatter],
    [SharedKernel, this._relationshipFormatter],
    [UpstreamDownstreamRelationship, this._relationshipFormatter],
    [CustomerSupplierRelationship, this._relationshipFormatter],
    [Aggregate, new AggregateFormatter()],
    [SculptorModule, new SculptorModuleFormatter()],
    [UseCase, new UseCaseFormatter()],
    [UserStory, new UserStoryFormatter()],
    [Stakeholders, new StakeholdersFormatter()],
    [StakeholderGroup, new StakeholderGroupFormatter()],
    [Stakeholder, new StakeholderFormatter()],
    [ValueRegister, new ValueRegisterFormatter()],
    [ValueCluster, new ValueClusterFormatter()],
    [Value, new ValueFormatter()],
    [ValueElicitation, new ValueElicitationFormatter()],
    [ValueEpic, this._bracePairFormatter],
    [ValueNarrative, this._bracePairFormatter],
    [ValueWeighting, this._bracePairFormatter],
    [Consequence, new ConsequenceFormatter()],
    [Action, new ActionFormatter()]
  ])

  get (node: AstNode): ContextMapperFormatter<AstNode> | undefined {
    return this._formatters.get(node.$type)
  }
}
