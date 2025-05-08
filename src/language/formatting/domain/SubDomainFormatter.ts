import { Subdomain } from '../../generated/ast.js'
import { NodeFormatter } from 'langium/lsp'
import { formatAttributes, formatEqualSigns, formatFieldAttributes, formatListSeparators } from '../FormattingHelper.js'
import { BracePairFormatter } from '../BracePairFormatter.js'

export class SubDomainFormatter extends BracePairFormatter<Subdomain> {
  override format (node: Subdomain, formatter: NodeFormatter<Subdomain>): void {
    super.format(node, formatter)

    formatAttributes(['supports'], formatter)
    formatListSeparators(formatter)

    formatFieldAttributes(['type', 'domainVisionStatement'], formatter)
    formatEqualSigns(formatter)
  }
}
