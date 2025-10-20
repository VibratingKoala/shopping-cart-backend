module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  extends: [
    'eslint:recommended'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
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
    'no-eval': 'error',
    
    // Allow unused vars in interfaces and function signatures
    'no-unused-vars': ['error', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    '@typescript-eslint/no-unused-vars': 'off'
  },
  ignorePatterns: [
    'dist/**',
    'coverage/**',
    'node_modules/**',
    '*.js'
  ]
}