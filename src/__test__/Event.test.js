import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Event from '../components/Event';
import mockData from '../mock-data';

describe('Event Component', () => {
  const mockEvent = mockData[0];

  test('renders the event title', () => {
    render(<Event event={mockEvent} />);
    expect(screen.queryByText(mockEvent.summary)).toBeInTheDocument();
  });

  test('renders the event start time (created date)', () => {
    render(<Event event={mockEvent} />);
    const createdDate = new Date(mockEvent.created).toLocaleString();
    expect(screen.queryByText(createdDate)).toBeInTheDocument();
  });

  test('renders the event location', () => {
    render(<Event event={mockEvent} />);
    expect(screen.queryByText(mockEvent.location)).toBeInTheDocument();
  });

  test('renders the show details button', () => {
    render(<Event event={mockEvent} />);
    expect(screen.queryByText(/show details/i)).toBeInTheDocument();
  });

  test('User shows event details', () => {
    render(<Event event={mockEvent} />);
    fireEvent.click(screen.getByText(/show details/i));
    expect(
      screen.getByText(/have you wondered how you can ask google/i)
    ).toBeInTheDocument();
  });

  test('User hides event details', () => {
    render(<Event event={mockEvent} />);
    fireEvent.click(screen.getByText(/show details/i));
    fireEvent.click(screen.getByText(/hide details/i));
    expect(
      screen.queryByText(/have you wondered how you can ask google/i)
    ).not.toBeInTheDocument();
  });
});
