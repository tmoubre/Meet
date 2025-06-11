// src/features/showHideAnEventsDetails.test.js
import React from "react";
import { render, within, waitFor, act } from "@testing-library/react";
import { loadFeature, defineFeature } from "jest-cucumber";
import App from "../App";

const feature = loadFeature("./src/features/showHideAnEventsDetails.feature");

defineFeature(feature, (test) => {
  let AppComponent;

  test("An event element is collapsed by default", ({ given, when, then }) => {
    given("the user hasn’t interacted with any event", () => {});

    when("the main page is loaded", async () => {
      await act(async () => {
        AppComponent = render(<App />);
      });

      await waitFor(() =>
        expect(
          AppComponent.container.querySelector(".event")
        ).toBeInTheDocument()
      );
    });

    then("the event element should be collapsed by default", () => {
      const event = AppComponent.container.querySelector(".event");
      const details = event.querySelector(".details");
      expect(details).toBeNull(); // details should not exist by default
    });
  });

  test("User can expand an event to see details", ({ given, when, then }) => {
    given("the main page is loaded", async () => {
      await act(async () => {
        AppComponent = render(<App />);
      });

      await waitFor(() =>
        expect(
          AppComponent.container.querySelector(".event")
        ).toBeInTheDocument()
      );
    });

    when("the user clicks to see the event details", () => {
      const event = AppComponent.container.querySelector(".event");
      const button = within(event).getByText("Show Details");
      act(() => {
        button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
    });

    then("the event element should expand to show the event details", () => {
      const event = AppComponent.container.querySelector(".event");
      const details = event.querySelector(".details");
      expect(details).not.toBeNull();
    });
  });

  test("User can collapse an event to hide details", ({
    given,
    when,
    then,
  }) => {
    given("the event details are visible", async () => {
      await act(async () => {
        AppComponent = render(<App />);
      });

      await waitFor(() =>
        expect(
          AppComponent.container.querySelector(".event")
        ).toBeInTheDocument()
      );

      const event = AppComponent.container.querySelector(".event");
      const showButton = within(event).getByText("Show Details");
      act(() => {
        showButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
    });

    when("the user clicks to hide the event details", () => {
      const event = AppComponent.container.querySelector(".event");
      const hideButton = within(event).getByText("Hide Details");
      act(() => {
        hideButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
    });

    then("the event element should collapse and hide the event details", () => {
      const event = AppComponent.container.querySelector(".event");
      const details = event.querySelector(".details");
      expect(details).toBeNull();
    });
  });
});
