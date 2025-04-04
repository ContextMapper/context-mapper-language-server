import { AstNode } from "langium";
import { AbstractSemanticTokenProvider, SemanticTokenAcceptor } from "langium/lsp";

export class ContextMapperDslSemanticTokenProvider extends AbstractSemanticTokenProvider {
    protected override highlightElement(node: AstNode, acceptor: SemanticTokenAcceptor) {
        
    }
}