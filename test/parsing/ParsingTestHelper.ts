import { expect } from 'vitest'
import { LangiumDocument } from 'langium'
import { ContextMappingModel } from '../../src/language/generated/ast.js'
import { parseHelper } from 'langium/test'

export async function parseValidInput (parse: ReturnType<typeof parseHelper<ContextMappingModel>>, input: string): Promise<LangiumDocument<ContextMappingModel>> {
  const document = await parse(input)

  expectNoParsingErrors(document)
  return document
}

export async function parseInvalidInput (parse: ReturnType<typeof parseHelper<ContextMappingModel>>, input: string): Promise<void> {
  const document = await parse(input)

  expect(document.parseResult.parserErrors.length).toBeGreaterThanOrEqual(1)
}

export function expectNoParsingErrors (document: LangiumDocument<ContextMappingModel>) {
  expect(document.parseResult.parserErrors.length).toEqual(0)
}
