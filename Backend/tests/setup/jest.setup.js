const winston = require("winston");

jest.spyOn(winston, "createLogger").mockImplementation(() => ({
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  clear: jest.fn(),
  add: jest.fn(),
}));
