import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import stylistic from '@stylistic/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Rules only: eslint-config-next already registers the jsx-a11y plugin,
  // and redefining it errors
  { rules: jsxA11y.flatConfigs.recommended.rules },
  // Formatting rules moved out of ESLint core into ESLint Stylistic.
  stylistic.configs['disable-legacy'],
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]), {
    // @stylistic/comma-dangle allows `<T,>` only when JSX is enabled.
    files: ['**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  }, {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Disable rule during Next.js 16 migration
      'react-hooks/refs': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@stylistic/indent': ['warn', 2],
      // Core rule does not understand TypeScript expressions.
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'warn',
      'no-duplicate-imports': ['warn', {
        'allowSeparateTypeImports': true,
      }],
      '@typescript-eslint/no-unused-vars': [
        'warn', {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
        },
      ],
      '@stylistic/comma-dangle': [
        'warn',
        'always-multiline',
      ],
      '@stylistic/linebreak-style': [
        'warn',
        'unix',
      ],
      '@stylistic/quotes': [
        'warn',
        'single',
      ],
      '@stylistic/semi': [
        'warn',
        'always',
      ],
      '@stylistic/max-len': [
        'warn',
        { 'code': 80 },
      ],
    },
  },
]);
