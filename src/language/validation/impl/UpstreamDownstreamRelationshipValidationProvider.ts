import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { UpstreamDownstreamRelationship } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'
import { enforceZeroOrOneCardinality, enforceZeroOrOneCardinalityOfListAttribute } from '../ValidationHelper.js'

export class UpstreamDownstreamRelationshipValidationProvider implements ContextMapperValidationProvider<UpstreamDownstreamRelationship> {
  validate (node: UpstreamDownstreamRelationship, acceptor: ValidationAcceptor): void {
    enforceZeroOrOneCardinality(node, 'implementationTechnology', acceptor)
    enforceZeroOrOneCardinalityOfListAttribute(node, 'upstreamExposedAggregates', acceptor, ['exposedAggregates'])
    enforceZeroOrOneCardinality(node, 'downstreamGovernanceRights', acceptor, ['downstreamRights'])
  }
}
