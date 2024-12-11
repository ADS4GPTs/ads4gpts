export default {
    preset: 'ts-jest', // Use ts-jest to handle TypeScript files
    testEnvironment: 'node', // Set the test environment to Node.js
    testMatch: ['<rootDir>/tests/**/*.test.ts'], // Match test files in the `tests/` folder
    collectCoverage: true, // Enable code coverage collection
    coverageDirectory: '<rootDir>/coverage', // Output coverage reports here
    coverageProvider: 'v8',
};
