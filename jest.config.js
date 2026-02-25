export default {
  testEnvironment: "node",
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: { module: "NodeNext", moduleResolution: "NodeNext" },
      },
    ],
  },
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "config/**/*.ts"],
  coveragePathIgnorePatterns: ["/node_modules/", "\\.test\\.ts$"],
  setupFilesAfterEnv: [],
}
