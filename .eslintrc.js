module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier', 'sonarjs'],
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/@typescript-eslint',
        'plugin:sonarjs/recommended',
    ],
    env: {
        jest: true,
        browser: true,
        es6: true,
        node: true,
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    rules: {
        'prettier/prettier': 'error',
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-namespace': 'off',
        "@typescript-eslint/no-unused-vars": ["error", {
          "vars": "all",
          "args": "none",
          "ignoreRestSiblings": false
        }]
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [['src', './src']],
                extensions: ['.ts', '.js'],
            },
        },
    },

    overrides: [
        {
            files: ['webpack.config.ts'],
            rules: {
                'import/no-extraneous-dependencies': 'off',
                'import/no-default-export': 'off',
            },
        },
    ],
};
