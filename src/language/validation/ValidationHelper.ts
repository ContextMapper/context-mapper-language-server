import { AstNode, ValidationAcceptor } from 'langium'

export function enforceZeroOrOneCardinality (node: AstNode, property: string, acceptor: ValidationAcceptor, keywords: string[] = [property]) {
  const nodeProperty = node[property as keyof AstNode]
  if (nodeProperty != null && !Array.isArray(nodeProperty)) {
    keywords.forEach(keyword => {
      acceptor('warning', `There was a problem validating the attribute ${keyword}.`, {
        node,
        keyword
      })
    })
    return
  }
  if (nodeProperty != null && nodeProperty.length > 1) {
    keywords.forEach(keyword => {
      acceptor('error', `There must be zero or one ${keyword} attribute`, {
        node,
        keyword
      })
    })
  }
}

export function enforceZeroOrOneCardinalityOfListAttribute (node: AstNode, property: string, acceptor: ValidationAcceptor, keywords: string[] = [property]) {
  const nodeProperty = node[property as keyof AstNode]
  if (!Array.isArray(nodeProperty)) {
    keywords.forEach(keyword => {
      acceptor('warning', `There was a problem validating the attribute "${keywords.join(' | ')}".`, {
        node,
        keyword
      })
    })
    return
  }

  if (nodeProperty == null || nodeProperty.length < 2 || node.$cstNode == null) {
    return
  }

  let matchCount = 0
  keywords.forEach(keyword => {
    const regex = new RegExp(`(?<![\\w'"])\\b${keyword}\\b(?![\\w'"])`, 'g')
    const match = node.$cstNode!.text.match(regex)
    if (match) {
      matchCount += match.length
    }
  })

  if (matchCount > 1) {
    keywords.forEach(keyword => {
      acceptor('error', `There must be zero or one "${keywords.join(' | ')}" attribute`, {
        node,
        keyword
      })
    })
  }
}
