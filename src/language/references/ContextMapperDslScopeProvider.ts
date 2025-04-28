import { AstUtils, DefaultScopeProvider, ReferenceInfo, Scope } from 'langium'
import {
  AbstractStakeholder,
  Aggregate,
  DomainPart,
  isContextMappingModel,
  isStakeholderGroup, StakeholderGroup
} from '../generated/ast.js'

export class ContextMapperDslScopeProvider extends DefaultScopeProvider {
  override getScope (context: ReferenceInfo): Scope {
    const referenceType = this.reflection.getReferenceType(context)
    const model = AstUtils.getContainerOfType(context.container, isContextMappingModel)!

    if (referenceType === DomainPart) {
      const domainPartDescriptions = model.domains.map(d => this.descriptions.createDescription(d, d.name))
        .concat(
          model.domains.flatMap(d => d.subdomains)
            .map(sd => this.descriptions.createDescription(sd, sd.name))
        )
      return this.createScope(domainPartDescriptions)
    }

    if (referenceType === Aggregate) {
      const aggregateDescriptions = model.boundedContexts.flatMap(bc => bc.aggregates)
        .map(a => this.descriptions.createDescription(a, a.name))
        .concat(
          model.boundedContexts.flatMap(bc => bc.modules)
            .flatMap(m => m.aggregates)
            .map(a => this.descriptions.createDescription(a, a.name))
        )
      return this.createScope(aggregateDescriptions)
    }

    if (referenceType === AbstractStakeholder) {
      const stakeholderDescriptions = model.stakeholders.flatMap(s => s.stakeholders)
        .map(s => this.descriptions.createDescription(s, s.name))
        .concat(
          model.stakeholders.flatMap(s => s.stakeholders)
            .filter(s => isStakeholderGroup(s))
            .flatMap(sg => (sg as StakeholderGroup).stakeholders)
            .map(s => this.descriptions.createDescription(s, s.name))
        )
      return this.createScope(stakeholderDescriptions)
    }

    return super.getScope(context)
  }
}
