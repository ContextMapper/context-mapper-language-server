import { Domain } from '../../generated/ast.js'
import { NodeFormatter } from 'langium/lsp'
import { formatEqualSigns, formatFieldAttributes, indentChildren } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class DomainFormatter extends BracePairFormatter<Domain> {
  override format (node: Domain, formatter: NodeFormatter<Domain>): void {
    super.format(node, formatter)

    formatFieldAttributes(['domainVisionStatement'], formatter)
    formatEqualSigns(formatter)

    indentChildren(node.subdomains, formatter)
  }
}
