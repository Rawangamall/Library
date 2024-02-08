import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  //test environment for ts
  testEnvironment: 'node',
  preset: "ts-jest",
  verbose: true,
  roots: ['<rootDir>/src/Tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  setupFiles: ["./setupTests.js"] 
};

export default config;
