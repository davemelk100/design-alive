import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { DesignSystemEditor } from "@design-alive/editor";

describe("Accessibility", () => {
  it("DesignSystemEditor has no axe violations", async () => {
    const { container } = render(<DesignSystemEditor />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
