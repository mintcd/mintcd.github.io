module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',  // Use ts-jest for .ts and .tsx files
  },
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/components/$1',
    '^@utils/(.*)$': '<rootDir>/utils/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  roots: ['<rootDir>/__tests__'],  // Only look in the '__tests__' folder
  testMatch: ['**/__tests__/**/*.{js,ts,tsx}'],  // Match files inside '__tests__' folder with .js, .ts, or .tsx extensions
};
