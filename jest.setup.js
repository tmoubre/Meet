// jest.setup.js
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
