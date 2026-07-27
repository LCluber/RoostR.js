// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {

  // Stop running tests after `n` failures
  bail: true,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "./tests/coverage",

  // Make calling deprecated APIs throw helpful error messages
  errorOnDeprecated: true,

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "mjs",
  ],

  // @lcluber/type6js ships ES module syntax under its "main" entry point.
  // Map it to its CommonJS build so Jest (running under CommonJS) can require it.
  moduleNameMapper: {
    "^@lcluber/type6js$": "<rootDir>/node_modules/@lcluber/type6js/dist/type6.cjs.js"
  },

  // The test environment that will be used for testing
  testEnvironment: "jest-environment-jsdom",

  // Indicates whether each individual test should be reported during the run
  verbose: true

};
