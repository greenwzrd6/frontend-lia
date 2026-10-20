import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/src/tests/**/*.test.ts?(x)"],
  setupFiles: ["<rootDir>/src/tests/polyfills.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  clearMocks: true,
  globals: {
    "ts-jest": {
      tsconfig: {
        jsx: "react-jsx",
      },
    },
  },
};

export default config;
