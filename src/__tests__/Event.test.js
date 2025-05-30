// src/__tests__/Event.test.js
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Event from "../components/Event";
import { mockData } from "../mock-data";

describe("<Event /> component", () => {
  let EventComponent;
  let eventData;

  beforeEach(() => {
    eventData = mockData.find((e) => e.summary === "React is Fun");
    EventComponent = render(<Event event={eventData} />);
  });

  test("renders event Title", () => {
    expect(EventComponent.getByText(/react is fun/i)).toBeInTheDocument();
  });

  test("renders event location", () => {
    expect(EventComponent.getByText(/berlin, germany/i)).toBeInTheDocument();
  });

  test('renders the "Show Details" button by default', () => {
    expect(EventComponent.getByText(/show details/i)).toBeInTheDocument();
  });

  test("by default, event's details should be hidden", () => {
    // Description starts with "Love HTML, CSS, and JS?"
    expect(EventComponent.queryByText(/love html, css, and js\?/i)).toBeNull();
  });

  test("shows the details when clicking 'Show Details'", () => {
    fireEvent.click(EventComponent.getByText(/show details/i));
    expect(
      EventComponent.getByText(/love html, css, and js\?/i)
    ).toBeInTheDocument();
  });

  test("hides the details when clicking 'Hide Details'", () => {
    // show then hide
    fireEvent.click(EventComponent.getByText(/show details/i));
    fireEvent.click(EventComponent.getByText(/hide details/i));
    expect(EventComponent.queryByText(/love html, css, and js\?/i)).toBeNull();
  });
});
