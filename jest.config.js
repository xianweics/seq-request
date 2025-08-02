export default {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/__tests__/**'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {
    '^.+\\.ts$': '@swc/jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ]
};
