import { ContextMapperValidationProvider } from '../ContextMapperValidationProvider.js'
import { Subdomain } from '../../generated/ast.js'
import { enforceZeroOrOneCardinality } from '../ValidationHelper.js'

export class SubDomainValidationProvider implements ContextMapperValidationProvider<Subdomain> {
  validate (node: Subdomain, acceptor: any): void {
    enforceZeroOrOneCardinality(node, 'type', acceptor)
    enforceZeroOrOneCardinality(node, 'domainVisionStatement', acceptor)
  }
}
