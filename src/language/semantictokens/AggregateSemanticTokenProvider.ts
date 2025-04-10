import { Aggregate, isUseCase, isUserRequirement, isUserStory } from '../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
import { highlightMemberAttribute, highlightString, highlightTypeDeclaration } from './HighlightingHelper.js'

export class AggregateSemanticTokenProvider {
  public highlightAggregate (node: Aggregate, acceptor: SemanticTokenAcceptor) {
    if (node.doc) {
      highlightString(node, acceptor, 'doc')
    }

    highlightTypeDeclaration(node, acceptor, 'Aggregate')

    if (node.responsibilities.length > 0) {
      highlightMemberAttribute(node, acceptor, ['responsibilities'], 'responsibilities', SemanticTokenTypes.string)
    }

    if (node.userRequirements.length > 0) {
      const keywords = []
      if (isUseCase(node.userRequirements[0])) {
        keywords.push('useCases')
      } else if (isUserRequirement(node.userRequirements[0])) {
        keywords.push('userRequirements')
        keywords.push('features')
      } else if (isUserStory(node.userRequirements[0])) {
        keywords.push('userStories')
      }

      highlightMemberAttribute(node, acceptor, keywords, 'userRequirements', SemanticTokenTypes.type)
    }

    if (node.owner) {
      highlightMemberAttribute(node, acceptor, ['owner'], 'owner', SemanticTokenTypes.type)
    }

    if (node.knowledgeLevel) {
      highlightMemberAttribute(node, acceptor, ['knowledgeLevel'], 'knowledgeLevel')
    }

    if (node.likelihoodForChange) {
      highlightMemberAttribute(node, acceptor, ['likelihoodForChange', 'structuralVolatility'], 'likelihoodForChange')
    }

    if (node.contentVolatility) {
      highlightMemberAttribute(node, acceptor, ['contentVolatility'], 'contentVolatility')
    }

    if (node.availabilityCriticality) {
      highlightMemberAttribute(node, acceptor, ['availabilityCriticality'], 'availabilityCriticality')
    }

    if (node.consistencyCriticality) {
      highlightMemberAttribute(node, acceptor, ['consistencyCriticality'], 'consistencyCriticality')
    }

    if (node.storageSimilarity) {
      highlightMemberAttribute(node, acceptor, ['storageSimilarity'], 'storageSimilarity')
    }

    if (node.storageSimilarity) {
      highlightMemberAttribute(node, acceptor, ['storageSimilarity'], 'storageSimilarity')
    }

    if (node.securityCriticality) {
      highlightMemberAttribute(node, acceptor, ['securityCriticality'], 'securityCriticality')
    }

    if (node.securityZone) {
      highlightMemberAttribute(node, acceptor, ['securityZone'], 'securityZone', SemanticTokenTypes.string)
    }

    if (node.securityAccessGroup) {
      highlightMemberAttribute(node, acceptor, ['securityAccessGroup'], 'securityAccessGroup', SemanticTokenTypes.string)
    }
  }
}
