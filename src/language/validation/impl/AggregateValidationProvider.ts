import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { Aggregate } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'
import { enforceZeroOrOneCardinality } from '../ValidationHelper.js'

export class AggregateValidationProvider implements ContextMapperValidationProvider<Aggregate> {
  validate (node: Aggregate, acceptor: ValidationAcceptor): void {
    // TODO: regex enforce responsibilities
    // TODO: regex enforce useCases
    // TODO: regex enforce userStories
    // TODO: regex enforce userRequirements & features

    enforceZeroOrOneCardinality(node, 'owner', acceptor)
    enforceZeroOrOneCardinality(node, 'knowledgeLevel', acceptor)
    enforceZeroOrOneCardinality(node, 'likelihoodForChange', acceptor)
    enforceZeroOrOneCardinality(node, 'contentVolatility', acceptor)
    enforceZeroOrOneCardinality(node, 'availabilityCriticality', acceptor)
    enforceZeroOrOneCardinality(node, 'consistencyCriticality', acceptor)
    enforceZeroOrOneCardinality(node, 'storageSimilarity', acceptor)
    enforceZeroOrOneCardinality(node, 'securityCriticality', acceptor)
    enforceZeroOrOneCardinality(node, 'securityZone', acceptor)
    enforceZeroOrOneCardinality(node, 'securityAccessGroup', acceptor)
  }
}
