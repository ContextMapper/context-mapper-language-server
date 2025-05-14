export class PlantUMLBuilder {
  private readonly _content: string[]

  constructor() {
    this._content = ['@startuml', '']
  }

  add(content: string): void {
    this._content.push(content)
  }

  addEmptyDiagramNote() {
    this.add(`note "Sorry, we cannot generate a component diagram. Your Context Map seems to be empty." as EmptyDiagramError`)
    this.addLinebreak()
  }

  addLinebreak() {
    this._content.push('')
  }

  build(): string {
    this._content.push('@enduml')
    return this._content.join('\n')
  }

}