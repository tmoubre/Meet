//EventList.test.js

import React from "react";
import { render, within, waitFor, act } from "@testing-library/react";
import App from "../App";

describe("<EventList /> integration", () => {
  test("renders a non‐empty list of events when the app is mounted", async () => {
    let utils;
    await act(async () => {
      utils = render(<App />);
    });
    const { findAllByRole, container } = utils;

    // Wait for the list container
    const list = container.querySelector("#event-list");
    await waitFor(() => expect(list).toBeInTheDocument());

    // Read the default number of events from the input
    const defaultCount = Number(
      container.querySelector("#number-of-events").value
    );

    // Now fetch the rendered items
    const items = await within(list).findAllByRole("listitem");
    expect(items).toHaveLength(defaultCount);
  });
});
