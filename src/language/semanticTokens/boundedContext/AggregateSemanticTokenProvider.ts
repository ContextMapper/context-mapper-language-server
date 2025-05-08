import { Aggregate } from '../../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import { SemanticTokenTypes } from 'vscode-languageserver-types'
import { highlightField, highlightString, highlightTypeDeclaration } from '../HighlightingHelper.js'
import { ContextMapperSemanticTokenProvider } from '../ContextMapperSemanticTokenProvider.js'

export class AggregateSemanticTokenProvider implements ContextMapperSemanticTokenProvider<Aggregate> {
  highlight (node: Aggregate, acceptor: SemanticTokenAcceptor) {
    if (node.doc) {
      highlightString(node, acceptor, 'doc')
    }

    highlightTypeDeclaration(node, acceptor, 'Aggregate')

    if (node.responsibilities.length > 0) {
      highlightField(node, acceptor, ['responsibilities'], 'responsibilities', SemanticTokenTypes.string)
    }

    if (node.userRequirements.length > 0) {
      highlightField(node, acceptor, ['userRequirements', 'features'], 'userRequirements', SemanticTokenTypes.type)
    }

    if (node.useCases.length > 0) {
      highlightField(node, acceptor, ['useCases'], 'useCases', SemanticTokenTypes.type)
    }

    if (node.userStories.length > 0) {
      highlightField(node, acceptor, ['userStories'], 'userStories', SemanticTokenTypes.type)
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
}
