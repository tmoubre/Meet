//file: src/features/filterEventsByCity.test.js

import React from "react";
import { act } from "@testing-library/react";
import { loadFeature, defineFeature } from "jest-cucumber";
import { render, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import mockData from "../mock-data";

const feature = loadFeature("./src/features/filterEventsByCity.feature");

defineFeature(feature, (test) => {
  test("When user hasn’t searched for a city, show upcoming events from all cities.", ({
    given,
    when,
    then,
  }) => {
    let AppComponent;

    given("user hasn’t searched for any city", () => {});

    when("the user opens the app", async () => {
      await act(async () => {
        AppComponent = render(<App />);
      });
    });

    then("the user should see the list of all upcoming events.", async () => {
      const AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector("#event-list");

      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole("listitem");
        expect(EventListItems.length).toBe(35);
      });
    });
  });

  test("User should see a list of suggestions when they search for a city.", ({
    given,
    when,
    then,
  }) => {
    let AppComponent;
    let CitySearchDOM;

    given("the main page is open", async () => {
      await act(async () => {
        AppComponent = render(<App />);
      });
    });

    when("user starts typing in the city textbox", async () => {
      const user = userEvent.setup();
      const AppDOM = AppComponent.container.firstChild;
      CitySearchDOM = AppDOM.querySelector("#city-search");
      const citySearchInput = within(CitySearchDOM).getByRole("textbox");
      await user.type(citySearchInput, "Berlin");
    });

    then(
      "the user should receive a list of cities (suggestions) that match what they’ve typed",
      () => {
        const suggestions = within(CitySearchDOM).queryAllByRole("listitem");
        expect(suggestions.length).toBe(2);
      }
    );
  });

  test("User can select a city from the suggested list.", ({
    given,
    and,
    when,
    then,
  }) => {
    let AppComponent;
    let AppDOM;
    let CitySearchDOM;
    let citySearchInput;
    let suggestionListItems;

    given('user was typing "Berlin" in the city textbox', async () => {
      await act(async () => {
        AppComponent = render(<App />);
      });

      const user = userEvent.setup();
      AppDOM = AppComponent.container.firstChild;
      CitySearchDOM = AppDOM.querySelector("#city-search");
      citySearchInput = within(CitySearchDOM).getByRole("textbox");
      await user.type(citySearchInput, "Berlin");
    });

    and("the list of suggested cities is showing", () => {
      suggestionListItems = within(CitySearchDOM).queryAllByRole("listitem");
      expect(suggestionListItems.length).toBeGreaterThanOrEqual(1);
    });

    when(
      'the user selects a city (e.g., "Berlin, Germany") from the list',
      async () => {
        const user = userEvent.setup();
        await user.click(suggestionListItems[0]);
      }
    );

    then(
      'their city should be changed to that city (i.e., "Berlin, Germany")',
      () => {
        expect(citySearchInput.value).toBe("Berlin, Germany");
      }
    );

    and(
      "the user should receive a list of upcoming events in that city",
      async () => {
        const EventListDOM = AppDOM.querySelector("#event-list");
        const EventListItems = within(EventListDOM).queryAllByRole("listitem");

        const berlinEvents = mockData.filter(
          (event) => event.location === "Berlin, Germany"
        );

        expect(EventListItems.length).toBe(berlinEvents.length);
      }
    );
  });
});
