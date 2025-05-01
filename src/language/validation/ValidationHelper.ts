import { AstNode, ValidationAcceptor } from 'langium'

export function enforceZeroOrOneCardinality (node: AstNode, property: string, acceptor: ValidationAcceptor, propertyName: string = property) {
  const nodeProperty = node[property as keyof AstNode]
  if (!Array.isArray(nodeProperty)) {
    acceptor('warning', `There was a problem validating the element ${propertyName}.`, {
      node,
      property
    })
    return
  }
  if (nodeProperty != null && nodeProperty.length > 1) {
    acceptor('error', `There must be zero or one ${propertyName} attribute`, {
      node,
      property
    })
  }
}
