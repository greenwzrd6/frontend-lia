import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/tests/**/*.test.ts?(x)"],
  setupFiles: ["<rootDir>/src/tests/polyfills.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  clearMocks: true,
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.jest.json",
      },
    ],
  },
};

export default config;
