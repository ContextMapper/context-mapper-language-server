import { LangiumServices, MultilineCommentHoverProvider } from 'langium/lsp'
import { CstUtils, GrammarAST, LangiumDocument, MaybePromise } from 'langium'
import { HoverParams } from 'vscode-languageserver'
import { Hover } from 'vscode-languageserver-types'
import { KeywordHoverRegistry } from './KeywordHoverRegistry.js'

export class ContextMapperDslHoverProvider extends MultilineCommentHoverProvider {
  private readonly _keywordHoverRegistry: KeywordHoverRegistry

  constructor (services: LangiumServices, keywordHoverRegistry: KeywordHoverRegistry) {
    super(services)
    this._keywordHoverRegistry = keywordHoverRegistry
  }

  override getHoverContent (document: LangiumDocument, params: HoverParams): MaybePromise<Hover | undefined> {
    // adapted from https://github.com/eclipse-langium/langium/discussions/1603
    const rootNode = document.parseResult?.value?.$cstNode
    if (rootNode) {
      const offset = document.textDocument.offsetAt(params.position)

      const cstNode = CstUtils.findDeclarationNodeAtOffset(rootNode, offset, this.grammarConfig.nameRegexp)
      if (cstNode && cstNode.offset + cstNode.length > offset) {
        const targetNode = this.references.findDeclaration(cstNode)
        if (targetNode) {
          return this.getAstNodeHoverContent(targetNode)
        }
        // add support for documentation on keywords
        if (GrammarAST.isKeyword(cstNode.grammarSource)) {
          const documentation = this._keywordHoverRegistry.getKeywordDocumentation(cstNode.grammarSource.value)
          if (documentation) {
            return {
              contents: {
                kind: 'markdown',
                value: documentation
              }
            }
          }
        }
      }
    }
    return undefined
  }
}
