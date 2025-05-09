import eslint from '@eslint/js'
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config({
        ignores: [
            'esbuild.mjs',
            'eslint.config.mjs',
            '**/generated/**'
        ],
    },
    eslint.configs.recommended,
    typescriptEslint.configs.recommendedTypeChecked,
    typescriptEslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json']
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