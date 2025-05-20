import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  test('renders input textbox', () => {
    render(<NumberOfEvents />);
    const textbox = screen.getByRole('textbox');
    expect(textbox).toBeInTheDocument();
  });

  test('default value of textbox is 32', () => {
    render(<NumberOfEvents />);
    const textbox = screen.getByRole('textbox');
    expect(textbox).toHaveValue(32);
  });

  test('value changes when user types', async () => {
    const user = userEvent.setup();
    render(<NumberOfEvents />);
    const textbox = screen.getByRole('textbox');
    await user.type(textbox, '{backspace}{backspace}10');
    expect(textbox).toHaveValue(10);
  });
});
