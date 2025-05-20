// src/__tests__/App.test.js
import { render } from '@testing-library/react';
import React from 'react';
import App from './../App';


describe('<App /> component', () => {
  test('renders list of events', () => {
    const { container } = render(<App />);
    expect(container.querySelector('#event-list')).toBeInTheDocument();
  });

  test('renders CitySearch component', () => {
    const { container } = render(<App />);
    expect(container.querySelector('#city-search')).toBeInTheDocument();
  });

  test('renders NumberofEvents component', () => {
    const { container } = render(<App />);
    const numberInput = container.querySelector('#number-of-events');
    expect(numberInput).toBeInTheDocument();
  });
});
