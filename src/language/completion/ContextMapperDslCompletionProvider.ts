import { CompletionContext, DefaultCompletionProvider } from 'langium/lsp'
import { GrammarAST } from 'langium'

export class ContextMapperDslCompletionProvider extends DefaultCompletionProvider {
  /*
  Langium hides non-alphabetical keywords by default. (see https://github.com/eclipse-langium/langium/pull/697)
  This causes relationship arrows like '<->' to not be suggested in autocomplete.
  Overriding this function allows all keywords to be suggested.
   */
  protected override filterKeyword (_context: CompletionContext, _keyword: GrammarAST.Keyword): boolean {
    return true
  }
}
