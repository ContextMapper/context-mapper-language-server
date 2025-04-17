// @ts-check
import * as esbuild from 'esbuild'

const watch = process.argv.includes('--watch')
const minify = process.argv.includes('--minify')

const ctx = await esbuild.context({
  // Entry points for the vscode extension and the language server
  entryPoints: ['src/language/main.ts'],
  outdir: 'dist',
  bundle: true,
  target: 'ESNext',
  format: 'cjs',
  outExtension: { '.js': '.cjs' },
  // VSCode's extension host is still using cjs, so we need to transform the code
  loader: { '.ts': 'ts' },
  platform: 'node',
  sourcemap: !minify,
  minify
})

if (watch) {
  await ctx.watch()
} else {
  await ctx.rebuild()
  await ctx.dispose()
}
