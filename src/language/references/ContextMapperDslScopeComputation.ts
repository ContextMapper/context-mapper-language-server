import { AstNode, AstNodeDescription, DefaultScopeComputation, LangiumDocument } from 'langium'
import { CancellationToken } from 'vscode-languageserver'

export class ContextMapperDslScopeComputation extends DefaultScopeComputation {
  /*
    For the time being imports aren't supported yet.
    By default, Langium adds top-level elements to the global scope.
    Without this behavior is wrong and therefore no nodes must be exported here
   */
  override computeExportsForNode (
    parentNode: AstNode,
    document: LangiumDocument<AstNode>,
    children?: (root: AstNode) => Iterable<AstNode>,
    cancelToken?: CancellationToken
  ): Promise<AstNodeDescription[]> {
    return Promise.resolve([])
  }
}
