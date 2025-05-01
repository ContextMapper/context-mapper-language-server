import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { UpstreamDownstreamRelationship } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'
import { enforceZeroOrOneCardinality } from '../ValidationHelper.js'

export class UpstreamDownstreamRelationshipValidationProvider implements ContextMapperValidationProvider<UpstreamDownstreamRelationship> {
  validate (node: UpstreamDownstreamRelationship, acceptor: ValidationAcceptor): void {
    enforceZeroOrOneCardinality(node, 'implementationTechnology', acceptor)
    // TODO: regex enforce exposedAggregates
    enforceZeroOrOneCardinality(node, 'downstreamRights', acceptor)
  }
}
