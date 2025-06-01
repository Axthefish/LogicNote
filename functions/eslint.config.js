import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: true,
        process: true,
        Buffer: true,
        __dirname: true,
        __filename: true,
        exports: true,
        module: true,
        require: true,
        global: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      'quotes': ['error', 'double'],
      'indent': ['error', 2],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
    },
    ignores: ['lib/**/*', 'node_modules/**/*'],
  },
]; 