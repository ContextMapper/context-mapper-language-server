import tsLint from 'typescript-eslint'
import stylisticLint from '@stylistic/eslint-plugin-ts'

const files = ['src/**/*.ts', 'test/**/*.ts']

export default tsLint.config({
        ignores: [
            '**/generated/**',
            '**/*.{js,cjs,mjs}'
        ]
    },
    tsLint.configs.recommendedTypeChecked.map((config) => {
        return {
            ...config,
            files
        }
    }),
    {
        ...stylisticLint.configs.all,
        files
    },
    {
        files,
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname
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
            ],
            '@stylistic/ts/indent': ['error', 2],
            '@stylistic/ts/quotes': ['error', 'single'],
            '@stylistic/ts/semi': ['error', 'never'],
            '@stylistic/ts/object-curly-spacing': ['error', 'always'],
            '@stylistic/ts/quote-props': ['error', 'consistent-as-needed'],
            '@stylistic/ts/member-delimiter-style': ['error', {
                multiline: {
                    delimiter: 'comma',
                    requireLast: false
                },
                singleline: {
                    delimiter: 'comma',
                    requireLast: false
                }
            }]
        }
    }
)