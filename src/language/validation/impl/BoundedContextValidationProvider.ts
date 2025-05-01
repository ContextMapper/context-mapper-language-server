import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { BoundedContext } from '../../generated/ast.js'
import { ValidationAcceptor } from 'langium'
import { enforceZeroOrOneCardinality } from '../ValidationHelper.js'

export class BoundedContextValidationProvider implements ContextMapperValidationProvider<BoundedContext> {
  validate (node: BoundedContext, acceptor: ValidationAcceptor): void {
    // TODO: regex enforce implementedDomainParts
    // TODO: regex enforce realizedBoundedContexts
    enforceZeroOrOneCardinality(node, 'refinedBoundedContext', acceptor, 'refines')

    enforceZeroOrOneCardinality(node, 'domainVisionStatement', acceptor)
    enforceZeroOrOneCardinality(node, 'type', acceptor)
    // TODO: regex enforce responsibilities
    enforceZeroOrOneCardinality(node, 'implementationTechnology', acceptor)
    enforceZeroOrOneCardinality(node, 'knowledgeLevel', acceptor)
    enforceZeroOrOneCardinality(node, 'businessModel', acceptor)
    enforceZeroOrOneCardinality(node, 'evolution', acceptor)
  }
}
