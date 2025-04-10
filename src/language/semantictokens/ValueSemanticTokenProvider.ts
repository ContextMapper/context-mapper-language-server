import {
  AbstractStakeholder,
  Action,
  Consequence,
  isStakeholder,
  isStakeholderGroup,
  Stakeholder,
  StakeholderGroup,
  Stakeholders,
  StoryValuation, Value, ValueCluster, ValueElicitation, ValueEpic, ValueNarrative, ValueRegister, ValueWeigthing
} from '../generated/ast.js'
import { SemanticTokenAcceptor } from 'langium/lsp'
import {
  highlightAttribute,
  highlightKeyword,
  highlightMemberAttribute,
  highlightString, highlightType,
  highlightTypeDeclaration
} from './HighlightingHelper.js'
import { SemanticTokenTypes } from 'vscode-languageserver-types'

export class ValueSemanticTokenProvider {
  public highlightStoryValidation (node: StoryValuation, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'and that')
    highlightString(node, acceptor, 'promotedValues')
    // TODO: delimiter token
    highlightKeyword(node, acceptor, 'is')
    highlightKeyword(node, acceptor, 'are')
    highlightKeyword(node, acceptor, 'promoted')
    // TODO: delimiter token

    highlightKeyword(node, acceptor, 'accepting that')
    highlightString(node, acceptor, 'harmedValues')
    // TODO: delimiter token
    highlightKeyword(node, acceptor, 'is')
    highlightKeyword(node, acceptor, 'are')
    highlightKeyword(node, acceptor, 'reduced')
    highlightKeyword(node, acceptor, 'harmed')
  }

  public highlightStakeholders (node: Stakeholders, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'Stakeholders')

    if (node.contexts.length > 0) {
      highlightAttribute(node, acceptor, ['of'], 'contexts', true)
    }
  }

  public highlightAbstractStakeholder (node: AbstractStakeholder, acceptor: SemanticTokenAcceptor) {
    if (isStakeholder(node)) {
      this.highlightStakeholder(node, acceptor)
    } else if (isStakeholderGroup(node)) {
      this.highlightStakeholderGroup(node, acceptor)
    }
  }

  public highlightStakeholder (node: Stakeholder, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'Stakeholder')

    if (node.influence) {
      highlightMemberAttribute(node, acceptor, ['influence'], 'influence')
    }

    if (node.interest) {
      highlightMemberAttribute(node, acceptor, ['interest'], 'interest')
    }

    if (node.description) {
      highlightMemberAttribute(node, acceptor, ['description'], 'description', SemanticTokenTypes.string)
    }
  }

  public highlightStakeholderGroup (node: StakeholderGroup, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'StakeholderGroup')
  }

  public highlightValueRegister (node: ValueRegister, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'ValueRegister')

    if (node.context) {
      highlightAttribute(node, acceptor, ['of'], 'context')
    }
  }

  public highlightValueCluster (node: ValueCluster, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'ValueCluster')

    if (node.coreValue) {
      highlightMemberAttribute(node, acceptor, ['core'], 'coreValue')
    }
    if (node.coreValue7000) {
      highlightMemberAttribute(node, acceptor, ['core'], 'coreValue7000')
    }

    this.highlightValueAttributes(node, acceptor)
  }

  public highlightValue (node: Value, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'Value')

    if (node.coreValue) {
      highlightKeyword(node, acceptor, 'isCore')
    }

    this.highlightValueAttributes(node, acceptor)
  }

  public highlightValueElicitation (node: ValueElicitation, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'Stakeholder')
    highlightKeyword(node, acceptor, 'Stakeholders')
    highlightType(node, acceptor, 'stakeholder')

    if (node.priority) {
      highlightMemberAttribute(node, acceptor, ['priority'], 'priority')
    }

    if (node.impact) {
      highlightMemberAttribute(node, acceptor, ['impact'], 'impact')
    }

    if (node.consequences.length > 0) {
      highlightKeyword(node, acceptor, 'consequences')
    }
  }

  public highlightValueEpic (node: ValueEpic, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'ValueEpic')

    highlightKeyword(node, acceptor, 'As a')
    highlightType(node, acceptor, 'stakeholder')
    highlightKeyword(node, acceptor, 'I value')
    highlightString(node, acceptor, 'value')
    highlightKeyword(node, acceptor, 'as demonstrated in')

    highlightKeyword(node, acceptor, 'realization of')
    highlightString(node, acceptor, 'realizedValues')

    highlightKeyword(node, acceptor, 'reduction of')
    highlightString(node, acceptor, 'reducedValues')
  }

  public highlightValueNarrative (node: ValueNarrative, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'ValueNarrative')

    highlightKeyword(node, acceptor, 'When the SOI executes')
    highlightString(node, acceptor, 'feature')

    highlightKeyword(node, acceptor, 'stakeholders expect it to promote, protect or create')
    highlightString(node, acceptor, 'promotedValues')

    highlightKeyword(node, acceptor, 'possibly degrading or prohibiting')
    highlightString(node, acceptor, 'harmedValues')

    highlightKeyword(node, acceptor, 'with the following externally observable and/or internally auditable behavior:')
    highlightString(node, acceptor, 'preAndPostConditions')
  }

  public highlightValueWeighting (node: ValueWeigthing, acceptor: SemanticTokenAcceptor) {
    highlightTypeDeclaration(node, acceptor, 'ValueWeighting')

    highlightKeyword(node, acceptor, 'In the context of the SOI,')

    highlightKeyword(node, acceptor, 'stakeholder')
    highlightType(node, acceptor, 'stakeholder')
    highlightKeyword(node, acceptor, 'values')
    highlightString(node, acceptor, 'value1')
    highlightKeyword(node, acceptor, 'more than')
    highlightString(node, acceptor, 'value2')

    highlightKeyword(node, acceptor, 'expecting benefits such as')
    highlightString(node, acceptor, 'benefits')

    highlightKeyword(node, acceptor, 'running the risk of harms such as')
    highlightString(node, acceptor, 'harms')
  }

  public highlightConsequence (node: Consequence, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, node.type)
    highlightString(node, acceptor, 'consequence')
  }

  public highlightAction (node: Action, acceptor: SemanticTokenAcceptor) {
    highlightKeyword(node, acceptor, 'action')
    highlightString(node, acceptor, 'action')

    const typeKeywords = ['ACT', 'MONITOR']
    if (typeKeywords.includes(node.type)) {
      highlightKeyword(node, acceptor, node.type)
    } else {
      highlightString(node, acceptor, 'type')
    }
  }

  private highlightValueAttributes (node: ValueCluster | Value, acceptor: SemanticTokenAcceptor) {
    if (node.demonstrators.length > 0) {
      highlightMemberAttribute(node, acceptor, ['demonstrator'], 'demonstrators', SemanticTokenTypes.string, true)
    }

    if (node.relatedValues.length > 0) {
      highlightMemberAttribute(node, acceptor, ['relatedValue'], 'relatedValues', SemanticTokenTypes.string, true)
    }

    if (node.opposingValues.length > 0) {
      highlightMemberAttribute(node, acceptor, ['opposingValue'], 'opposingValues', SemanticTokenTypes.string, true)
    }
  }
}
