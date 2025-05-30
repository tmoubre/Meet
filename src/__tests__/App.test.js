// src/__tests__/App.test.js

import React from "react";
import { render, within, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getEvents } from "../api";
import App from "../App";

describe("<App /> component structure", () => {
  let container;

  beforeEach(async () => {
    // wrap the initial render so useEffect state updates are inside act
    await act(async () => {
      ({ container } = render(<App />));
    });
    // wait for the list to actually appear
    await waitFor(() =>
      expect(container.querySelector("#event-list")).toBeInTheDocument()
    );
  });

  test("renders list of events", () => {
    expect(container.querySelector("#event-list")).toBeInTheDocument();
  });

  test("renders CitySearch", () => {
    expect(container.querySelector("#city-search")).toBeInTheDocument();
  });

  test("renders NumberOfEvents", () => {
    expect(container.querySelector("#number-of-events")).toBeInTheDocument();
  });
});

describe("<App /> integration", () => {
  test("limits the number of events to the default NumberOfEvents value", async () => {
    let utils, container;
    await act(async () => {
      utils = render(<App />);
    });
    container = utils.container;

    // wait for the events to appear
    const items = await utils.findAllByRole("listitem");

    // grab your number input by its ID
    const numberInput = container.querySelector("#number-of-events");
    expect(items).toHaveLength(Number(numberInput.value));
  });

  test("renders only Berlin events when a user selects Berlin", async () => {
    let utils, container;
    await act(async () => {
      utils = render(<App />);
    });
    container = utils.container;

    // wait for initial load
    await utils.findAllByRole("listitem");

    const user = userEvent.setup();
    const citySearch = container.querySelector("#city-search");
    const textbox = within(citySearch).getByRole("textbox");

    // type "Berlin" and select the suggestion
    await user.type(textbox, "Berlin");
    const suggestion = await within(citySearch).findByText("Berlin, Germany");
    await user.click(suggestion);

    // wait for the filtered list
    const filtered = await within(
      container.querySelector("#event-list")
    ).findAllByRole("listitem");

    const allEvents = await getEvents();
    const berlinCount = allEvents.filter(
      (e) => e.location === "Berlin, Germany"
    ).length;

    expect(filtered).toHaveLength(berlinCount);
    filtered.forEach((li) =>
      expect(li.textContent).toContain("Berlin, Germany")
    );
  });
});
