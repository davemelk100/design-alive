/// <reference types="vitest/globals" />
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { DesignSystemEditor } from "../index";

// Mock window.scrollTo
const scrollToMock = vi.fn();
Object.defineProperty(window, "scrollTo", { value: scrollToMock, writable: true });

describe("Color swatch scroll-to-top", () => {
  beforeEach(() => {
    scrollToMock.mockClear();
  });

  it("forces scroll to top when a color swatch is clicked", () => {
    render(<DesignSystemEditor />);
    const swatches = screen.getAllByLabelText(/color swatch/i);
    expect(swatches.length).toBeGreaterThan(0);

    fireEvent.click(swatches[0]);

    expect(scrollToMock).toHaveBeenCalledWith(0, 0);
    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.body.scrollTop).toBe(0);
  });

  it("color inputs have pointer-events disabled", () => {
    render(<DesignSystemEditor />);
    const colorInputs = document.querySelectorAll<HTMLInputElement>(
      'input[type="color"][id^="brand-btn-color-input"]',
    );
    expect(colorInputs.length).toBeGreaterThan(0);

    colorInputs.forEach((input) => {
      expect(input.style.pointerEvents).toBe("none");
      expect(input.tabIndex).toBe(-1);
    });
  });
});
