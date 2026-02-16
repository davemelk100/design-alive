import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cygnet from "../Cygnet";

beforeEach(() => {
  sessionStorage.clear();
});

describe("Cygnet passcode gate", () => {
  it("renders login gate when unauthenticated", () => {
    render(<Cygnet />);
    expect(
      screen.getByText("Enter passcode to view this report")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Passcode")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Enter" })).toBeInTheDocument();
  });

  it("shows error on wrong passcode", async () => {
    const user = userEvent.setup();
    render(<Cygnet />);

    await user.type(screen.getByPlaceholderText("Passcode"), "wrong");
    await user.click(screen.getByRole("button", { name: "Enter" }));

    expect(screen.getByText("Incorrect passcode")).toBeInTheDocument();
  });

  it("clears input on wrong passcode", async () => {
    const user = userEvent.setup();
    render(<Cygnet />);

    const input = screen.getByPlaceholderText("Passcode");
    await user.type(input, "wrong");
    await user.click(screen.getByRole("button", { name: "Enter" }));

    expect(input).toHaveValue("");
  });

  it("grants access on correct passcode", async () => {
    const user = userEvent.setup();
    render(<Cygnet />);

    await user.type(screen.getByPlaceholderText("Passcode"), "10623");
    await user.click(screen.getByRole("button", { name: "Enter" }));

    expect(screen.getByText("SEM 103 Workshop Results")).toBeInTheDocument();
  });

  it("stores auth in sessionStorage after correct passcode", async () => {
    const user = userEvent.setup();
    render(<Cygnet />);

    await user.type(screen.getByPlaceholderText("Passcode"), "10623");
    await user.click(screen.getByRole("button", { name: "Enter" }));

    expect(sessionStorage.getItem("cygnet-auth")).toBe("true");
  });

  it("loads authenticated state from sessionStorage", () => {
    sessionStorage.setItem("cygnet-auth", "true");
    render(<Cygnet />);

    expect(screen.getByText("SEM 103 Workshop Results")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Passcode")
    ).not.toBeInTheDocument();
  });
});
