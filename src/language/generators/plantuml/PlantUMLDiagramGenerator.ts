import { AstNode } from 'langium'

export interface PlantUMLDiagramGenerator<T extends AstNode> {
  createDiagram(node: T): string
}