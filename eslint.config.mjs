import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import stylistic from '@stylistic/eslint-plugin';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]), {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      // Temporarily disable during Next.js 16 migration
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@stylistic/indent': ['warn', 2],
      'no-unused-expressions': ['warn'],
      'no-duplicate-imports': ['warn'],
      '@typescript-eslint/no-unused-vars': [
        'warn', {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
        },
      ],
      'comma-dangle': [
        'warn',
        'always-multiline',
      ],
      'linebreak-style': [
        'warn',
        'unix',
      ],
      'quotes': [
        'warn',
        'single',
      ],
      'semi': [
        'warn',
        'always',
      ],
      'max-len': [
        'warn',
        { 'code': 80 },
      ],
    },
  },
]);

export default eslintConfig;

