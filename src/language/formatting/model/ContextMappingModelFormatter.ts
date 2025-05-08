import { ContextMapperFormatter } from '../ContextMapperFormatter.js'
import { ContextMappingModel } from '../../generated/ast.js'
import { Formatting, NodeFormatter } from 'langium/lsp'
import { CstNode } from 'langium'

export class ContextMappingModelFormatter implements ContextMapperFormatter<ContextMappingModel> {
  format (node: ContextMappingModel, formatter: NodeFormatter<ContextMappingModel>): void {
    this.formatTopLevelElements(node.contextMap.map(m => m.$cstNode!), formatter)
    this.formatTopLevelElements(node.boundedContexts.map(b => b.$cstNode!), formatter)
    this.formatTopLevelElements(node.domains.map(d => d.$cstNode!), formatter)
    this.formatTopLevelElements(node.stakeholders.map(s => s.$cstNode!), formatter)
    this.formatTopLevelElements(node.userRequirements.map(u => u.$cstNode!), formatter)
    this.formatTopLevelElements(node.valueRegisters.map(v => v.$cstNode!), formatter)
  }

  private formatTopLevelElements (cstNodes: CstNode[], formatter: NodeFormatter<ContextMappingModel>): void {
    formatter.cst(cstNodes)
      .prepend(Formatting.noIndent())
  }
}
