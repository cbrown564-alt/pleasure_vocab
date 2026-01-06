// Global test setup for Jest
// This file runs before each test file

// Suppress console.log during tests unless debugging
if (process.env.DEBUG !== 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    // Keep warn and error for debugging
    warn: console.warn,
    error: console.error,
  };
}

// Set up any global mocks here
jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

// Reset all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
