// jest.config.js
// const { pathsToModuleNameMapper } = require("ts-jest/utils");
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
// const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // moduleNameMapper: {
  //   "!/(.*)$": "/"
  // }
  moduleDirectories: ["node_modules", ""],
  testMatch: [
    "**/__tests__/**/*test.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  maxWorkers: 1
};
