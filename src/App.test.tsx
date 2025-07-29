import React from 'react';

// Simple test to verify React is available
test('React is available', () => {
  expect(React).toBeDefined();
});

test('App component can be imported', () => {
  // Just test that we can import the App component without rendering
  const App = require('./App').default;
  expect(App).toBeDefined();
  expect(typeof App).toBe('function');
}); 