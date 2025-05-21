import { describe, expect, test } from 'vitest'
import { filesOfProject } from 'tsarch'
import fs from 'node:fs'
import path from 'node:path'

describe('Ensure separation of concerns', () => {
  test('check language-internal dependencies', async () => {
    const langFolders = fs.readdirSync(path.join(__dirname, '..', '..', 'src', 'language'), { withFileTypes: true })
      .filter(file => file.isDirectory() && file.name !== 'generated' && file.name !== 'utils')
      .map(file => path.join('language', file.name))

    for (const sourceFolder of langFolders) {
      const ruleBuilder = filesOfProject()
        .inFolder(sourceFolder)
        .shouldNot()
        .dependOnFiles()


      for (const objectFolder of langFolders.filter(folder => folder !== sourceFolder)) {
        const rule = ruleBuilder.inFolder(objectFolder)

        const violations = await rule.check()
        expect(violations, `expect ${sourceFolder} not to depend on ${objectFolder}`).toHaveLength(0)
      }
    }
  })
})