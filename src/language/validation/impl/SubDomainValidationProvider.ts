import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { Subdomain } from '../../generated/ast.js'
import { enforceZeroOrOneCardinality } from '../ValidationHelper.js'
import { ValidationAcceptor } from 'langium'

export class SubDomainValidationProvider implements ContextMapperValidationProvider<Subdomain> {
  validate (node: Subdomain, acceptor: ValidationAcceptor): void {
    enforceZeroOrOneCardinality(node, 'type', acceptor)
    enforceZeroOrOneCardinality(node, 'domainVisionStatement', acceptor)
  }
}
