import { DefaultFoldingRangeProvider } from 'langium/lsp'
import { CstNode, LangiumDocument } from 'langium'
import { FoldingRange, FoldingRangeKind } from 'vscode-languageserver-types'

export class ContextMapperDslFoldingRangeProvider extends DefaultFoldingRangeProvider {
  // modified version of DefaultFoldingRangeProvider#toFoldingRange
  protected override toFoldingRange (document: LangiumDocument, node: CstNode, kind?: string): FoldingRange | undefined {
    const range = node.range
    let start = range.start
    let end = range.end

    // Don't generate foldings for nodes that are less than 3 lines
    if (end.line - start.line < 2) {
      return undefined
    }

    if (!this.includeLastFoldingLine(node, kind)) { // checks if block is parenthesis/bracket/brace block or comment
      // To prevent something like '...}' in the editor when a code block is collapsed, we want to still show the first line of a code block
      start = document.textDocument.positionAt(document.textDocument.offsetAt({
        line: start.line + 1,
        character: 0
      }) - 1)

      let offsetFromEnd
      if (kind === FoldingRangeKind.Comment) {
        // So that comments are collapsed like '/*...*/' the end character needs to be at the start of the last line
        offsetFromEnd = 0
      } else {
        // As we don't want to hide the end token like 'if { ... --> } <--', we simply select the end of the previous line as the end position
        offsetFromEnd = 1
      }
      end = document.textDocument.positionAt(document.textDocument.offsetAt({
        line: end.line,
        character: 0
      }) - offsetFromEnd)
    }
    return FoldingRange.create(start.line, end.line, start.character, end.character, kind)
  }
}
