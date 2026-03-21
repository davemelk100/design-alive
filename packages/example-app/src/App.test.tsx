import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import App from "./App";

describe("Example App — plugin consumer", () => {
  beforeEach(() => {
    // Clear any inline styles from previous tests
    document.documentElement.removeAttribute("style");
  });

  it("renders the editor inside the host app", () => {
    render(<App />);
    expect(screen.getByText("Plugin Test")).toBeInTheDocument();
    // Editor should render with a ds-editor root
    expect(document.querySelector(".ds-editor")).toBeInTheDocument();
  });

  it("renders theme preset buttons", () => {
    render(<App />);
    expect(screen.getByText("light")).toBeInTheDocument();
    expect(screen.getByText("dark")).toBeInTheDocument();
    expect(screen.getByText("grey")).toBeInTheDocument();
    expect(screen.getByText("blue")).toBeInTheDocument();
  });

  it("applies theme CSS variables when a preset is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByText("dark"));

    // Dark theme sets --background to "0 0% 10%"
    const bg = document.documentElement.style.getPropertyValue("--background");
    expect(bg).toBe("0 0% 10%");

    // --foreground should also be set
    const fg = document.documentElement.style.getPropertyValue("--foreground");
    expect(fg).toBe("0 0% 95%");
  });



  it("toggles showHeader prop", async () => {
    const user = userEvent.setup();
    render(<App />);

    const checkbox = screen.getByLabelText("showHeader");
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("toggles showSectionNav prop", async () => {
    const user = userEvent.setup();
    render(<App />);

    const checkbox = screen.getByLabelText("showSectionNav");
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("renders prop toggle checkboxes", () => {
    render(<App />);
    expect(screen.getByLabelText("showHeader")).toBeInTheDocument();
    expect(screen.getByLabelText("showSectionNav")).toBeInTheDocument();
    expect(screen.getByLabelText("showNavLinks")).toBeInTheDocument();
  });

  it("switches between all theme presets without errors", async () => {
    const user = userEvent.setup();
    render(<App />);

    for (const theme of ["light", "dark", "blue", "grey"]) {
      await user.click(screen.getByText(theme));
      const bg = document.documentElement.style.getPropertyValue("--background");
      expect(bg).toBeTruthy();
      const fg = document.documentElement.style.getPropertyValue("--foreground");
      expect(fg).toBeTruthy();
    }
  });

  it("each preset sets all required CSS variables", async () => {
    const user = userEvent.setup();
    render(<App />);

    const requiredVars = [
      "--background", "--foreground", "--card", "--card-foreground",
      "--primary", "--primary-foreground", "--secondary", "--secondary-foreground",
      "--muted", "--muted-foreground", "--accent", "--accent-foreground",
      "--destructive", "--destructive-foreground", "--border", "--brand",
    ];

    for (const theme of ["light", "dark", "grey", "blue"]) {
      await user.click(screen.getByText(theme));
      for (const v of requiredVars) {
        const val = document.documentElement.style.getPropertyValue(v);
        expect(val, `${theme} should set ${v}`).toBeTruthy();
      }
    }
  });

  it("has no critical accessibility violations on initial render", async () => {
    const { container } = render(<App />);
    // Exclude axe-excluded elements (color swatches are decorative)
    const results = await axe(container, {
      rules: {
        // Disable color-contrast since jsdom can't compute rendered colors
        "color-contrast": { enabled: false },
      },
    });
    // Allow up to minor violations — focus on critical/serious
    const critical = results.violations.filter(
      (v: { impact: string }) => v.impact === "critical" || v.impact === "serious"
    );
    expect(critical).toHaveLength(0);
  }, 15000);
});
