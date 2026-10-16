import globals from 'globals';

const browser = { ...globals.browser };

export default [
  { ignores: ['**/node_modules/**', '**/art/**'] },

  /* 고전 스크립트 — app.js · battle.js · art.js */
  {
    files: ['app.js', 'battle.js', 'art.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        ...browser,
        DGABattle: 'readonly',
        DGAArt: 'readonly',
        module: 'readonly',
        require: 'readonly'
      }
    },
    rules: {
      /* catch (_) 는 일부러 버리는 것이다 */
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      'no-undef': 'error',
      'no-redeclare': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-dupe-else-if': 'error',
      'no-duplicate-case': 'error',
      'no-unreachable': 'error',
      'no-fallthrough': 'error',
      'no-self-assign': 'error',
      'no-constant-condition': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-sparse-arrays': 'error',
      'no-cond-assign': 'error',
      'no-irregular-whitespace': 'error',
      'valid-typeof': 'error',
      eqeqeq: ['warn', 'smart'],
      'no-var': 'off',
      'prefer-const': 'off'
    }
  },

  /* ES 모듈 — app-auth.js · store.js · profile.js · firebase-init.js */
  {
    files: ['app-auth.js', 'store.js', 'profile.js', 'firebase-init.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: browser
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      'no-undef': 'error',
      'no-dupe-keys': 'error',
      'no-unreachable': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-constant-condition': 'error',
      eqeqeq: ['warn', 'smart']
    }
  }
];
