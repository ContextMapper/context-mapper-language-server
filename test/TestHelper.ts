import type { LangiumDocument } from 'langium'
import { ContextMappingModel, isContextMappingModel } from '../src/language/generated/ast.js'
import { expandToString as s } from 'langium/generate'

export function checkDocumentValid (document: LangiumDocument): string | undefined {
  if (document.parseResult.parserErrors.length > 0) {
    return s`
       Parser errors:
         ${document.parseResult.parserErrors.map(e => e.message).join('\n  ')}
   `
  }
  if (document.parseResult.value == null) {
    return 'ParseResult is \'undefined\'.'
  }

  if (!isContextMappingModel(document.parseResult.value)) {
    return `Root AST object is a ${document.parseResult.value.$type}, expected a '${ContextMappingModel}'.`
  }
  return undefined
}
