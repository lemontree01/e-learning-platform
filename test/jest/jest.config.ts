import type { Config } from 'jest';

const config: Config = {
  rootDir: '../../',
  testEnvironment: 'jsdom',
  clearMocks: true,
  setupFiles: ['<rootDir>/test/jest/polyfills.cjs'],
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/test/jest/setup.ts'],
  globals: { IS_DEV: true, },
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|svg)$': '<rootDir>/test/jest/fileMock.cjs',
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: { module: 'CommonJS', moduleResolution: 'node', jsx: 'react-jsx', },
    }],
  },
};

export default config;
