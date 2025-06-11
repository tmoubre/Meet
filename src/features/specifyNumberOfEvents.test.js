// src/features/specifyNumberOfEvents.test.js
import { loadFeature, defineFeature } from "jest-cucumber";
import React from "react";
import { render, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

const feature = loadFeature("./src/features/specifyNumberOfEvents.feature");

defineFeature(feature, (test) => {
  let AppComponent;

  test("When the user hasn’t specified a number, 32 is the default", ({
    given,
    when,
    then,
  }) => {
    given("the main page is open", async () => {
      AppComponent = render(<App />);
      await waitFor(() => {
        expect(
          AppComponent.container.querySelector("#event-list")
        ).toBeInTheDocument();
      });
    });

    when("the user hasn’t changed the number of events", () => {
      // No action needed
    });

    then(/^(\d+) events should be displayed by default$/, (expected) => {
      const events = AppComponent.container.querySelectorAll(".event");
      expect(events.length).toBe(parseInt(expected));
    });
  });

  test("User can change the number of events", ({ given, when, then }) => {
    given("the main page is open", async () => {
      AppComponent = render(<App />);
      await waitFor(() => {
        expect(
          AppComponent.container.querySelector("#event-list")
        ).toBeInTheDocument();
      });
    });

    when(/^the user sets the number of events to (\d+)$/, async (input) => {
      const user = userEvent.setup();
      const inputField = AppComponent.getByLabelText("Number of Events:");
      await user.clear(inputField);
      await user.type(inputField, input);
    });

    then(/^the event list should show (\d+) events$/, (expected) => {
      const events = AppComponent.container.querySelectorAll(".event");
      expect(events.length).toBe(parseInt(expected));
    });
  });
});
