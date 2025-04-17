import { Aggregate, isAggregate, isUseCase, isUserRequirement, isUserStory } from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
import { highlightField, highlightString, highlightTypeDeclaration } from '../HighlightingHelper.js'
import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'
import { AstNode } from 'langium'

export class AggregateSemanticTokenProvider implements ContextMapperSemanticTokenProvider<Aggregate> {
  supports (node: AstNode): node is Aggregate {
    return isAggregate(node)
  }

  highlight (node: Aggregate, acceptor: SemanticTokenAcceptor) {
    if (node.doc) {
      highlightString(node, acceptor, 'doc')
    }

    highlightTypeDeclaration(node, acceptor, 'Aggregate')

    if (node.responsibilities.length > 0) {
      highlightField(node, acceptor, ['responsibilities'], 'responsibilities', SemanticTokenTypes.string)
    }

    if (node.userRequirements.length > 0) {
      this.highlightUserRequirements(node, acceptor)
    }

    if (node.owner) {
      highlightField(node, acceptor, ['owner'], 'owner', SemanticTokenTypes.type)
    }

    if (node.knowledgeLevel) {
      highlightField(node, acceptor, ['knowledgeLevel'], 'knowledgeLevel')
    }

    if (node.likelihoodForChange) {
      highlightField(node, acceptor, ['likelihoodForChange', 'structuralVolatility'], 'likelihoodForChange')
    }

    if (node.contentVolatility) {
      highlightField(node, acceptor, ['contentVolatility'], 'contentVolatility')
    }

    if (node.availabilityCriticality) {
      highlightField(node, acceptor, ['availabilityCriticality'], 'availabilityCriticality')
    }

    if (node.consistencyCriticality) {
      highlightField(node, acceptor, ['consistencyCriticality'], 'consistencyCriticality')
    }

    if (node.storageSimilarity) {
      highlightField(node, acceptor, ['storageSimilarity'], 'storageSimilarity')
    }

    if (node.storageSimilarity) {
      highlightField(node, acceptor, ['storageSimilarity'], 'storageSimilarity')
    }

    if (node.securityCriticality) {
      highlightField(node, acceptor, ['securityCriticality'], 'securityCriticality')
    }

    if (node.securityZone) {
      highlightField(node, acceptor, ['securityZone'], 'securityZone', SemanticTokenTypes.string)
    }

    if (node.securityAccessGroup) {
      highlightField(node, acceptor, ['securityAccessGroup'], 'securityAccessGroup', SemanticTokenTypes.string)
    }
  }

  private highlightUserRequirements (node: Aggregate, acceptor: SemanticTokenAcceptor) {
    const keywords = []
    if (isUseCase(node.userRequirements[0])) {
      keywords.push('useCases')
    } else if (isUserRequirement(node.userRequirements[0])) {
      keywords.push('userRequirements')
      keywords.push('features')
    } else if (isUserStory(node.userRequirements[0])) {
      keywords.push('userStories')
    }

    highlightField(node, acceptor, keywords, 'userRequirements', SemanticTokenTypes.type)
  }
}
