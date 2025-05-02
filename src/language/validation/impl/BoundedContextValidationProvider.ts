import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { BoundedContext } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'
import { enforceZeroOrOneCardinality, enforceZeroOrOneCardinalityOfListAttribute } from '../ValidationHelper.js'

export class BoundedContextValidationProvider implements ContextMapperValidationProvider<BoundedContext> {
  validate (node: BoundedContext, acceptor: ValidationAcceptor): void {
    enforceZeroOrOneCardinalityOfListAttribute(node, 'implementedDomainParts', acceptor, ['implements'])
    enforceZeroOrOneCardinalityOfListAttribute(node, 'realizedBoundedContexts', acceptor, ['realizes'])
    enforceZeroOrOneCardinality(node, 'refinedBoundedContext', acceptor, ['refines'])

    enforceZeroOrOneCardinality(node, 'domainVisionStatement', acceptor)
    enforceZeroOrOneCardinality(node, 'type', acceptor)
    enforceZeroOrOneCardinalityOfListAttribute(node, 'responsibilities', acceptor)
    enforceZeroOrOneCardinality(node, 'implementationTechnology', acceptor)
    enforceZeroOrOneCardinality(node, 'knowledgeLevel', acceptor)
    enforceZeroOrOneCardinality(node, 'businessModel', acceptor)
    enforceZeroOrOneCardinality(node, 'evolution', acceptor)
  }
}
