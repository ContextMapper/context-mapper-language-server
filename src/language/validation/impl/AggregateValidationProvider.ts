import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { Aggregate } from '../../generated/ast.js'
import { Properties, ValidationAcceptor } from 'langium'
import { enforceZeroOrOneCardinality, enforceZeroOrOneCardinalityOfListAttribute } from '../ValidationHelper.js'

export class AggregateValidationProvider implements ContextMapperValidationProvider<Aggregate> {
  validate (node: Aggregate, acceptor: ValidationAcceptor): void {
    enforceZeroOrOneCardinalityOfListAttribute(node, 'responsibilities', acceptor)
    enforceZeroOrOneCardinalityOfListAttribute(node, 'useCases', acceptor)
    enforceZeroOrOneCardinalityOfListAttribute(node, 'userStories', acceptor)
    enforceZeroOrOneCardinalityOfListAttribute(node, 'userRequirements', acceptor, ['userRequirements', 'features'])
    enforceZeroOrOneCardinality(node, 'owner', acceptor)
    enforceZeroOrOneCardinality(node, 'knowledgeLevel', acceptor)
    enforceZeroOrOneCardinality(node, 'likelihoodForChange', acceptor, ['likelihoodForChange', 'structuralVolatility'])
    enforceZeroOrOneCardinality(node, 'contentVolatility', acceptor)
    enforceZeroOrOneCardinality(node, 'availabilityCriticality', acceptor)
    enforceZeroOrOneCardinality(node, 'consistencyCriticality', acceptor)
    enforceZeroOrOneCardinality(node, 'storageSimilarity', acceptor)
    enforceZeroOrOneCardinality(node, 'securityCriticality', acceptor)
    enforceZeroOrOneCardinality(node, 'securityZone', acceptor)
    enforceZeroOrOneCardinality(node, 'securityAccessGroup', acceptor)

    // make sure only one of the userRequirements keywords is used
    const userRequirementProperties = ['userRequirements', 'useCases', 'userStories'] as (keyof Aggregate)[]
    const setUserRequirements = userRequirementProperties.filter(p => {
      const value = node[p] as object[]
      return value.length > 0
    })
    if (setUserRequirements.length > 1) {
      setUserRequirements.forEach(property => {
        acceptor('error', 'One ony of the keywords "userRequirements", "features", "useCases" and "userStories" may be used', {
          node,
          property: property as Properties<Aggregate>
        })
      })
    }
  }
}
