import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counters } from "./components/Counters";
import React from "react";



describe("Counters Component", () => {

  test("shows default count as 0", () => {
    render(<Counters />);
    expect(screen.getByText(/Counter is: 0/i)).toBeInTheDocument();
  });

  test("increments when Increase button is clicked", async () => {
    render(<Counters />);

    const incBtn = screen.getByRole("button", { name: /increase/i });
    await userEvent.click(incBtn);

    expect(screen.getByText("Counter is: 1")).toBeInTheDocument();
  });

  test("decrements when Decrease button is clicked", async () => {
    render(<Counters />);

    const decBtn = screen.getByRole("button", { name: /decrease/i });
    await userEvent.click(decBtn);

    expect(screen.getByText("Counter is: -1")).toBeInTheDocument();
  });

});
