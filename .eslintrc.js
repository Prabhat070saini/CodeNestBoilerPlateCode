module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-console': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',

    '@typescript-eslint/naming-convention': [
      'error',

      // Interfaces must start with I
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },

      // Enums must start with E
      {
        selector: 'enum',
        format: ['PascalCase'],
        custom: {
          regex: '^E[A-Z]',
          match: true,
        },
      },

      // Default naming convention
      {
        selector: 'default',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
      },

      // Variables
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'],
      },

      // Parameters
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
      },

      // MongoDB uses `_id` as its standard document identifier.
      {
        selector: ['classProperty', 'objectLiteralProperty', 'typeProperty'],
        filter: {
          regex: '^_id$',
          match: true,
        },
        format: null,
      },

      // Types and classes
      {
        selector: 'typeLike',
        format: ['PascalCase', 'snake_case'],
      },
    ],
  },
};
