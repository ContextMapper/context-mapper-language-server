import { AstNode } from 'langium'
import { Formatting, NodeFormatter } from 'langium/lsp'

export function formatBracePair<T extends AstNode> (formatter: NodeFormatter<T>) {
  formatter.keywords('{')
    .prepend(Formatting.oneSpace())
  formatter.keywords('}')
    .prepend(Formatting.newLine())
    .append(Formatting.newLine())
}

export function indentChildren<T extends AstNode> (nodes: AstNode[], formatter: NodeFormatter<T>): void {
  formatter.nodes(...nodes)
    .prepend(Formatting.newLine({ allowMore: true }))
    .prepend(Formatting.indent())
}

export function formatAttributes<T extends AstNode> (keywords: string[], formatter: NodeFormatter<T>): void {
  formatter.keywords(...keywords)
    .prepend(Formatting.oneSpace())
    .append(Formatting.oneSpace())
}

export function formatFieldAttributes<T extends AstNode> (keywords: string[], formatter: NodeFormatter<T>): void {
  formatter.keywords(...keywords)
    .prepend(Formatting.newLine({ allowMore: true }))
    .prepend(Formatting.indent())
}

export function formatEqualSigns<T extends AstNode> (formatter: NodeFormatter<T>): void {
  formatter.keywords('=')
    .surround(Formatting.oneSpace())
}

export function formatListSeparators<T extends AstNode> (formatter: NodeFormatter<T>): void {
  formatter.keywords(',')
    .prepend(Formatting.noSpace())
    .append(Formatting.oneSpace())
}
