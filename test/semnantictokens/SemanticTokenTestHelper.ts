import { expect } from 'vitest'

export const TOKEN_DATA_LENGTH = 5

/**
 * A Semantic Token data array consists of a sequence of integers.
 * One token corresponds to a sequence of 5 integers, representing: startLine, startChar, length, type, modifier
 */
export function assertSemanticToken (token: number[], startLine: number, startCharacter: number, length: number, tokenType: number, tokenModifiers: number) {
  expect(token.length).toEqual(TOKEN_DATA_LENGTH)

  expect(token[0]).toEqual(startLine)
  expect(token[1]).toEqual(startCharacter)
  expect(token[2]).toEqual(length)
  expect(token[3]).toEqual(tokenType)
  expect(token[4]).toEqual(tokenModifiers)
}
