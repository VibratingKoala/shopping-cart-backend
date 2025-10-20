module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    // General rules
    'no-console': 'off', // Allow console for server logging
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Code style  
    'quotes': ['error', 'single'],
    'eol-last': ['error', 'always'],
    'no-trailing-spaces': 'error',
    
    // Best practices
    'eqeqeq': ['error', 'always'],
    'no-eval': 'error'
  },
  ignorePatterns: [
    '**/*.ts',
    '**/*.d.ts',
    'dist/**',
    'coverage/**',
    'node_modules/**'
  ]
}