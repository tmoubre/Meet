// src/__tests__/EventList.test.js
import React from 'react';
import { render } from '@testing-library/react';
import EventList from '../components/EventList';
import { getEvents } from '../api';
import '@testing-library/jest-dom';

describe('<EventList /> component', () => {
  let EventListComponent;

  beforeEach(() => {
    EventListComponent = render(<EventList />);
  });

  test('has an element with "list" role', () => {
    expect(EventListComponent.queryByRole("list")).toBeInTheDocument();
  });

  test('renders correct number of events', () => {
    EventListComponent.rerender(
      <EventList events={[{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]} />
    );
    expect(EventListComponent.getAllByRole("listitem")).toHaveLength(4);
  });

  test('renders correct number of events from API', async () => {
    const allEvents = await getEvents();
    EventListComponent.rerender(<EventList events={allEvents} />);
    expect(EventListComponent.getAllByRole("listitem")).toHaveLength(allEvents.length);
  });
});
 