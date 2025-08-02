export default {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'prettier',
    ],
    rules: {
        // TypeScript 特定规则
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'warn',

        // 通用规则
        'no-console': 'off',
        'no-debugger': 'error',
        'no-duplicate-imports': 'error',
        'no-unused-expressions': 'error',
        'prefer-const': 'error',
        'no-var': 'error',

        // Prettier 集成
        'prettier/prettier': 'error',
    },
    env: {
        node: true,
        es6: true,
        jest: true,
    },
    ignorePatterns: [
        'dist/',
        'node_modules/',
        'coverage/',
        '*.js',
        '*.d.ts',
    ],
};
