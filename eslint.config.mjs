import eslint from '@eslint/js'
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
    eslint.configs.recommended,
    typescriptEslint.configs.recommendedTypeChecked,
    typescriptEslint.configs.stylisticTypeChecked,
    {
        ignores: [
            'esbuild.mjs',
            'eslint.config.mjs'
        ],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            }
        },
        rules: {
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    'argsIgnorePattern': '^_',
                    'varsIgnorePattern': '^_',
                    'caughtErrorsIgnorePattern': '^_'
                }
            ]
        }
    }
);