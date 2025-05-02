import { AstNode } from 'langium'
import { ContextMapperValidationProvider } from './ContextMapperValidationProvider.js'
import { ValueValidationProvider } from './impl/ValueValidationProvider.js'
import { ContextMappingModelValidationProvider } from './impl/ContextMappingModelValidationProvider.js'
import { ContextMapValidationProvider } from './impl/ContextMapValidationProvider.js'
import {
  Aggregate,
  BoundedContext,
  ContextMap,
  ContextMappingModel,
  SculptorModule,
  Stakeholder,
  Subdomain,
  UpstreamDownstreamRelationship,
  UseCase,
  Value,
  ValueElicitation, ValueEpic
} from '../generated/ast.js'
import { BoundedContextValidationProvider } from './impl/BoundedContextValidationProvider.js'
import { SubDomainValidationProvider } from './impl/SubDomainValidationProvider.js'
import {
  UpstreamDownstreamRelationshipValidationProvider
} from './impl/UpstreamDownstreamRelationshipValidationProvider.js'
import { AggregateValidationProvider } from './impl/AggregateValidationProvider.js'
import { UseCaseValidationProvider } from './impl/UseCaseValidationProvider.js'
import { SculptorModuleValidationProvider } from './impl/SculptorModuleValidationProvider.js'
import { StakeholderValidationProvider } from './impl/StakeholderValidationProvider.js'
import { ValueElicitationValidationProvider } from './impl/ValueElicitationValidationProvider.js'
import { ValueEpicValidationProvider } from './impl/ValueEpicValidationProvider.js'

export class ContextMapperValidationProviderRegistry {
  private readonly _providers = new Map<string, ContextMapperValidationProvider<AstNode>>([
    [Value, new ValueValidationProvider()],
    [ContextMappingModel, new ContextMappingModelValidationProvider()],
    [ContextMap, new ContextMapValidationProvider()],
    [BoundedContext, new BoundedContextValidationProvider()],
    [Subdomain, new SubDomainValidationProvider()],
    [UpstreamDownstreamRelationship, new UpstreamDownstreamRelationshipValidationProvider()],
    [Aggregate, new AggregateValidationProvider()],
    [UseCase, new UseCaseValidationProvider()],
    [SculptorModule, new SculptorModuleValidationProvider()],
    [Stakeholder, new StakeholderValidationProvider()],
    [ValueElicitation, new ValueElicitationValidationProvider()],
    [ValueEpic, new ValueEpicValidationProvider()]
  ])

  get (node: AstNode): ContextMapperValidationProvider<AstNode> | undefined {
    return this._providers.get(node.$type)
  }

  getRegisteredTypes (): string[] {
    return Array.from(this._providers.keys())
  }
}
