import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { ValidationAcceptor, AstNode } from 'langium'
import {
  enforceZeroOrOneCardinality,
  enforceZeroOrOneCardinalityOfListAttribute
} from '../../src/language/validation/ValidationHelper.js'

export interface TestNode extends AstNode {
  key: string[]
}

export interface NonArrayNode extends AstNode {
  key: string
}

let acceptor: ValidationAcceptor

beforeEach(() => {
  acceptor = vi.fn()
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('ValidationHelper tests', () => {
  test('enforceZeroOrOneCardinality with non-array', () => {
    const node = {
      key: 'abc'
    } as NonArrayNode

    enforceZeroOrOneCardinality(node, 'key', acceptor)

    expect(acceptor).toHaveBeenCalledTimes(1)
  })

  test('enforceZeroOrOneCardinality with empty array', () => {
    const node = {
      key: [] as string[]
    } as TestNode

    enforceZeroOrOneCardinality(node, 'key', acceptor)

    expect(acceptor).toHaveBeenCalledTimes(0)
  })

  test('enforceZeroOrOneCardinality with array of length 1', () => {
    const node = {
      key: ['test']
    } as TestNode

    enforceZeroOrOneCardinality(node, 'key', acceptor)

    expect(acceptor).toHaveBeenCalledTimes(0)
  })

  test('enforceZeroOrOneCardinality with array of length 2', () => {
    const node = {
      key: ['test', 'test2']
    } as TestNode

    enforceZeroOrOneCardinality(node, 'key', acceptor)

    expect(acceptor).toHaveBeenCalledTimes(1)
  })

  test('enforceZeroOrOneCardinality with multiple keywords', () => {
    const node = {
      key: ['test', 'test2']
    } as TestNode

    enforceZeroOrOneCardinality(node, 'key', acceptor, ['key', 'keyx'])

    expect(acceptor).toHaveBeenCalledTimes(2)
  })

  test('enforceZeroOrOneCardinalityOfListAttribute with no match', () => {
    const node: TestNode = {
      $cstNode: {
        text: `
          Test Structure {
            test "test"
          }
        `
      },
      key: [] as string[]
    } as TestNode

    enforceZeroOrOneCardinalityOfListAttribute(node, 'key', acceptor)

    expect(acceptor).toHaveBeenCalledTimes(0)
  })

  test('enforceZeroOrOneCardinalityOfListAttribute with one match', () => {
    const node: TestNode = {
      $cstNode: {
        text: `
          Test Structurekey {
            key "test", "key"
          }
        `
      },
      key: ['test', 'key']
    } as TestNode

    enforceZeroOrOneCardinalityOfListAttribute(node, 'key', acceptor)

    expect(acceptor).toHaveBeenCalledTimes(0)
  })

  test('enforceZeroOrOneCardinalityOfListAttribute with two matches', () => {
    const node: TestNode = {
      $cstNode: {
        text: `
          Test Structurekey {
            key "test", "key"
            key "test2", "key2"
          }
        `
      },
      key: ['test', 'key', 'test2', 'key2']
    } as TestNode

    enforceZeroOrOneCardinalityOfListAttribute(node, 'key', acceptor)

    expect(acceptor).toHaveBeenCalledTimes(1)
  })

  test('enforceZeroOrOneCardinalityOfListAttribute with multiple keywords', () => {
    const node: TestNode = {
      $cstNode: {
        text: `
          Test Structurekey {
            key "test", "key"
            keyx "test2", "key2"
          }
        `
      },
      key: ['test', 'key', 'test2', 'key2']
    } as TestNode

    enforceZeroOrOneCardinalityOfListAttribute(node, 'key', acceptor, ['key', 'keyx'])

    expect(acceptor).toHaveBeenCalledTimes(2)
  })

  test('enforceZeroOrOneCardinalityOfListAttribute with non-array', () => {
    const node = {
      key: 'abc'
    } as NonArrayNode

    enforceZeroOrOneCardinalityOfListAttribute(node, 'key', acceptor)

    expect(acceptor).toHaveBeenCalledTimes(1)
  })
})
