import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [{
  ignores: [
    '.*',
    'node_modules',
    'next-env.d.ts',
  ],
},
...compat.extends('next/core-web-vitals', 'next/typescript'), {
  plugins: {
    '@stylistic': stylistic,
  },
  rules: {
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
}];

export default eslintConfig;
