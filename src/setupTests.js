// setupTests.js
import "@testing-library/jest-dom";

// Silence specific React warnings during testing
const MESSAGES_TO_IGNORE = [
  "When testing, code that causes React state updates should be wrapped into act(...)",
  "Error:",
  "The above error occurred",
];

const originalError = console.error.bind(console.error);
console.error = (...args) => {
  if (!MESSAGES_TO_IGNORE.some((msg) => args.join(" ").includes(msg))) {
    originalError(...args);
  }
};
