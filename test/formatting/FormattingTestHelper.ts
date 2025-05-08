import { LangiumDocument } from 'langium'
import { TextEdit } from 'vscode-languageserver-types'
import { expect } from 'vitest'

export function createFormattingParams (document: LangiumDocument) {
  return {
    textDocument: {
      uri: document.uri.path
    },
    options: {
      tabSize: 2,
      insertSpaces: true
    }
  }
}

export function expectTextEditToEqual (
  textEdit: TextEdit,
  newText: string,
  startLine: number,
  startChar: number,
  endLine: number,
  endChar: number) {
  expect(textEdit.newText).toEqual(newText)
  expect(textEdit.range.start.line).toEqual(startLine)
  expect(textEdit.range.start.character).toEqual(startChar)
  expect(textEdit.range.end.line).toEqual(endLine)
  expect(textEdit.range.end.character).toEqual(endChar)
}
