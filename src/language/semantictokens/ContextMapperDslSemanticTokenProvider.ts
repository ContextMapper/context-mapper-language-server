import { AstNode } from 'langium'
import { AbstractSemanticTokenProvider, SemanticTokenAcceptor } from 'langium/lsp'
import {
  ContextMappingModel,
  isAbstractStakeholder, isAction,
  isAggregate,
  isBoundedContext, isConsequence,
  isContextMap,
  isContextMappingModel,
  isDomainPart,
  isFeature,
  isRelationship,
  isStakeholders,
  isStoryValuation,
  isUserRequirement,
  isValue,
  isValueCluster,
  isValueElicitation, isValueEpic, isValueNarrative,
  isValueRegister, isValueWeigthing
} from '../generated/ast.js'
import { ContextMapSemanticTokenProvider } from './ContextMapSemanticTokenProvider.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
import { BoundedContextSemanticTokenProvider } from './BoundedContextSemanticTokenProvider.js'
import { DomainSemanticTokenProvider } from './DomainSemanticTokenProvider.js'
import { AggregateSemanticTokenProvider } from './AggregateSemanticTokenProvider.js'
import { RequirementsSemanticTokenProvider } from './RequirementsSemanticTokenProvider.js'
import { ValueSemanticTokenProvider } from './ValueSemanticTokenProvider.js'

export class ContextMapperDslSemanticTokenProvider extends AbstractSemanticTokenProvider {
  private contextMapTokenProvider = new ContextMapSemanticTokenProvider()
  private boundedContextTokenProvider = new BoundedContextSemanticTokenProvider()
  private domainTokenProvider = new DomainSemanticTokenProvider()
  private aggregateTokenProvider = new AggregateSemanticTokenProvider()
  private requirementTokenProvider = new RequirementsSemanticTokenProvider()
  private valueTokenProvider = new ValueSemanticTokenProvider()

  protected override highlightElement (node: AstNode, acceptor: SemanticTokenAcceptor) {
    if (isContextMappingModel(node)) {
      const modelNode = node as ContextMappingModel

      if (modelNode.$cstNode) {
        this.highlightComments(/\/\*[\s\S]*?\*\//g, modelNode, acceptor)
        this.highlightComments(/\/\/[^\n\r]*/g, modelNode, acceptor)
      }
    } else if (isContextMap(node)) {
      this.contextMapTokenProvider.highlightContextMap(node, acceptor)
    } else if (isRelationship(node)) {
      this.contextMapTokenProvider.highlightRelationship(node, acceptor)
    } else if (isBoundedContext(node)) {
      this.boundedContextTokenProvider.highlightBoundedContext(node, acceptor)
    } else if (isDomainPart(node)) {
      this.domainTokenProvider.highlightDomainPart(node, acceptor)
    } else if (isAggregate(node)) {
      this.aggregateTokenProvider.highlightAggregate(node, acceptor)
    } else if (isUserRequirement(node)) {
      this.requirementTokenProvider.highlightUserRequirement(node, acceptor)
    } else if (isFeature(node)) {
      this.requirementTokenProvider.highlightFeature(node, acceptor)
    } else if (isStoryValuation(node)) {
      this.valueTokenProvider.highlightStoryValidation(node, acceptor)
    } else if (isStakeholders(node)) {
      this.valueTokenProvider.highlightStakeholders(node, acceptor)
    } else if (isAbstractStakeholder(node)) {
      this.valueTokenProvider.highlightAbstractStakeholder(node, acceptor)
    } else if (isValueRegister(node)) {
      this.valueTokenProvider.highlightValueRegister(node, acceptor)
    } else if (isValueCluster(node)) {
      this.valueTokenProvider.highlightValueCluster(node, acceptor)
    } else if (isValue(node)) {
      this.valueTokenProvider.highlightValue(node, acceptor)
    } else if (isValueElicitation(node)) {
      this.valueTokenProvider.highlightValueElicitation(node, acceptor)
    } else if (isValueEpic(node)) {
      this.valueTokenProvider.highlightValueEpic(node, acceptor)
    } else if (isValueNarrative(node)) {
      this.valueTokenProvider.highlightValueNarrative(node, acceptor)
    } else if (isValueWeigthing(node)) {
      this.valueTokenProvider.highlightValueWeighting(node, acceptor)
    } else if (isConsequence(node)) {
      this.valueTokenProvider.highlightConsequence(node, acceptor)
    } else if (isAction(node)) {
      this.valueTokenProvider.highlightAction(node, acceptor)
    } else {
      console.error('Uncaught node type', node.$type)
    }
  }

  private highlightComments (regex: RegExp, node: ContextMappingModel, acceptor: SemanticTokenAcceptor) {
    const text = node.$document!!.textDocument.getText()
    for (const match of text.matchAll(regex)) {
      if (match == null || match.index == null) {
        continue
      }
      const position = node.$document!!.textDocument.positionAt(match.index)
      acceptor({
        type: SemanticTokenTypes.comment,
        line: position.line,
        char: position.character,
        length: match[0].length
      })
    }
  }
}
