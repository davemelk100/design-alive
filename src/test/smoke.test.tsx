import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

describe("smoke tests", () => {
  it("vitest + jsdom + testing-library works", () => {
    render(
      <MemoryRouter>
        <div>hello</div>
      </MemoryRouter>,
    );
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});
