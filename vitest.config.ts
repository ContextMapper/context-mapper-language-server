/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://vitest.dev/config/
 */
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['lcov'],
      reportsDirectory: 'out/code-coverage',
      include: ['src'],
      exclude: ['**/generated']
    },
    deps: {
      interopDefault: true
    },
    include: ['**/*.test.ts'],
    reporters: ['junit', 'verbose'],
    outputFile: 'out/test-results.xml'
  }
})
