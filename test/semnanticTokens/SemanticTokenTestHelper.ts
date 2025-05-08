import { expect } from 'vitest'
import { SemanticTokens } from 'vscode-languageserver-types'
import { SemanticTokensParams } from 'vscode-languageserver'
import { LangiumDocument } from 'langium'
import { ContextMappingModel } from '../../src/language/generated/ast.js'

export const TOKEN_DATA_LENGTH = 5

export function createSemanticTokenParams (document: LangiumDocument<ContextMappingModel>): SemanticTokensParams {
  return {
    textDocument: {
      uri: document.uri.path
    }
  }
}

/**
 * A Semantic Token data array consists of a sequence of integers.
 * One token corresponds to a sequence of 5 integers, representing: deltaLine, deltaStart, length, type, modifier
 * Tokens are given in their relative position to each other. deltaLine and deltaStart specifies how many lines & chars the start of the two tokens are apart
 */
export function expectSemanticTokensToEqual (token: number[], startLine: number, startCharacter: number, length: number, tokenType: number, tokenModifiers: number) {
  expect(token.length).toEqual(TOKEN_DATA_LENGTH)

  expect(token[0]).toEqual(startLine)
  expect(token[1]).toEqual(startCharacter)
  expect(token[2]).toEqual(length)
  expect(token[3]).toEqual(tokenType)
  expect(token[4]).toEqual(tokenModifiers)
}

export function expectSemanticTokensToHaveLength (result: SemanticTokens, expectedNumberOfTokens: number) {
  expect(result).not.toBeNull()
  expect(result.data.length).toEqual(expectedNumberOfTokens * TOKEN_DATA_LENGTH)
}

export function extractSemanticTokens (result: SemanticTokens, expectedNumberOfTokens: number): number[][] {
  const tokens: number[][] = []
  for (let i = 0; i < expectedNumberOfTokens; i++) {
    tokens.push(result.data.slice(i * TOKEN_DATA_LENGTH, (i + 1) * TOKEN_DATA_LENGTH))
  }
  return tokens
}
