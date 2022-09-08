module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js)x?$': 'ts-jest',
  },
  collectCoverage: true,
}
