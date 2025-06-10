// src/__tests__/NumberOfEvents.test.js

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NumberOfEvents from "../components/NumberOfEvents";

describe("<NumberOfEvents />", () => {
  const setup = (currentNOE = 32, mockSet = jest.fn()) => {
    render(<NumberOfEvents currentNOE={currentNOE} setCurrentNOE={mockSet} />);
    const input = screen.getByRole("spinbutton", {
      name: /number of events:/i,
    });
    return { input, mockSet };
  };

  test("renders a spinbutton input with the proper label", () => {
    const { input } = setup();
    expect(input).toBeInTheDocument();
  });

  test("default value is taken from the currentNOE prop", () => {
    const { input } = setup(42);
    expect(input).toHaveValue(42);
  });

  test("calls setCurrentNOE with the final value when user types", async () => {
    const user = userEvent.setup();
    const { input, mockSet } = setup(32);

    // clear the default, then type "10"
    await user.clear(input);
    await user.type(input, "10");

    // only the *last* call should be with 10
    expect(mockSet).toHaveBeenLastCalledWith(10);
    // and the displayed value should now be 10
    expect(input).toHaveValue(10);
  });
});
