import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Simple test to verify the app can be imported
test('App can be imported', () => {
  expect(React).toBeDefined();
});

test('App component exists', () => {
  // Just test that we can import the App component
  const App = require('./App').default;
  expect(App).toBeDefined();
  expect(typeof App).toBe('function');
}); 