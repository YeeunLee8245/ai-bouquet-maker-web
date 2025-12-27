import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import stylistic from '@stylistic/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
// eslint-plugin-tailwindcss는 Tailwind CSS v4와 호환되지 않아 주석 처리
// import tailwindcss from 'eslint-plugin-tailwindcss';

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
  ]),
  {
    plugins: {
      stylistic,
      'unused-imports': unusedImports,
    },
    rules: {
      // Stylistic 규칙들
      // Single quote 사용
      'stylistic/quotes': ['error', 'single', { avoidEscape: true }],

      // 빈 공백은 2줄 미만 (최대 1줄)
      'stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],

      // Max line 제한 없음
      'stylistic/max-len': 'off',

      // 탭 사이즈 2
      'stylistic/indent': ['error', 2, { SwitchCase: 1, VariableDeclarator: 1, outerIIFEBody: 1 }],

      // 스타일 관련 규칙들
      'stylistic/template-curly-spacing': ['error', 'never'],
      'stylistic/arrow-spacing': ['error', { before: true, after: true }],
      'stylistic/comma-dangle': ['error', 'always-multiline'],
      'stylistic/semi': ['error', 'always'],
      'stylistic/comma-spacing': ['error', { before: false, after: true }],
      'stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'stylistic/space-before-blocks': ['error', 'always'],
      'stylistic/space-before-function-paren': ['error', { anonymous: 'always', named: 'never', asyncArrow: 'always' }],
      'stylistic/space-in-parens': ['error', 'never'],
      'stylistic/space-infix-ops': 'error',
      'stylistic/space-unary-ops': ['error', { words: true, nonwords: false }],
      'stylistic/spaced-comment': ['error', 'always', { exceptions: ['-', '+'], markers: ['=', '!'] }],
      'stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'stylistic/no-trailing-spaces': 'error',
      'stylistic/eol-last': ['error', 'always'],

      // 범용적으로 많이 쓰이는 기본 규칙들 (코드 품질 관련)
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      
      // unused-imports 플러그인 규칙
      'no-unused-vars': 'off', // unused-imports/no-unused-vars로 대체
      'unused-imports/no-unused-imports': 'error', // 사용하지 않는 import 자동 삭제
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'curly': ['error', 'all'],
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
    },
  },
]);

export default eslintConfig;
