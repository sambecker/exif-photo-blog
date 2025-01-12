import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'), {
    rules: {
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-expressions': ['warn'],
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
      'indent': [
        'warn',
        2,
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
