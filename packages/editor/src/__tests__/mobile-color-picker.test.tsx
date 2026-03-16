/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { MobileColorPicker } from "../components/MobileColorPicker";

// Mock window.scrollTo
Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });

const defaultProps = {
  mobilePickerKey: "--brand",
  mobilePickerHex: "#336699",
  setMobilePickerKey: vi.fn(),
  setMobilePickerHex: vi.fn(),
  colors: {
    "--brand": "210 50% 40%",
    "--secondary": "210 15% 90%",
    "--accent": "210 60% 50%",
    "--background": "0 0% 100%",
    "--foreground": "0 0% 5%",
  },
  handleColorChange: vi.fn(),
};

describe("MobileColorPicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the current hex value", () => {
    render(<MobileColorPicker {...defaultProps} />);
    expect(screen.getByText("#336699")).toBeInTheDocument();
  });

  it("renders a Done button that closes the picker", () => {
    render(<MobileColorPicker {...defaultProps} />);
    const doneBtn = screen.getByText("Done");
    fireEvent.click(doneBtn);
    expect(defaultProps.setMobilePickerKey).toHaveBeenCalledWith(null);
  });

  it("renders swatch preview buttons for key colors", () => {
    render(<MobileColorPicker {...defaultProps} />);
    // The component renders 5 preview swatches
    const buttons = screen.getAllByRole("button");
    // 5 swatches + 1 Done button = 6
    expect(buttons.length).toBe(6);
  });

  it("renders a hex input field", () => {
    render(<MobileColorPicker {...defaultProps} />);
    const hexInput = screen.getByDisplayValue("#336699");
    expect(hexInput).toBeInTheDocument();
    expect(hexInput).toHaveAttribute("type", "text");
  });

  it("updates color when valid hex is entered", () => {
    render(<MobileColorPicker {...defaultProps} />);
    const hexInput = screen.getByDisplayValue("#336699");
    fireEvent.change(hexInput, { target: { value: "#ff0000" } });
    expect(defaultProps.setMobilePickerHex).toHaveBeenCalledWith("#ff0000");
    expect(defaultProps.handleColorChange).toHaveBeenCalledWith("--brand", "#ff0000");
  });

  it("does not call handleColorChange for invalid hex input", () => {
    render(<MobileColorPicker {...defaultProps} />);
    const hexInput = screen.getByDisplayValue("#336699");
    fireEvent.change(hexInput, { target: { value: "#gg" } });
    expect(defaultProps.setMobilePickerHex).toHaveBeenCalledWith("#gg");
    expect(defaultProps.handleColorChange).not.toHaveBeenCalled();
  });

  it("renders a hue slider with range 0-360", () => {
    render(<MobileColorPicker {...defaultProps} />);
    const slider = document.querySelector('input[type="range"][name="color-hue"]') as HTMLInputElement;
    expect(slider).toBeTruthy();
    expect(slider.min).toBe("0");
    expect(slider.max).toBe("360");
  });

  it("clicking a swatch preview switches to that color key", () => {
    render(<MobileColorPicker {...defaultProps} />);
    // Find the "Secondary" swatch by its label text
    const buttons = screen.getAllByRole("button");
    // Click the second swatch (Secondary)
    fireEvent.click(buttons[1]);
    expect(defaultProps.setMobilePickerKey).toHaveBeenCalledWith("--secondary");
  });

  it("renders the hue label for hex input", () => {
    render(<MobileColorPicker {...defaultProps} />);
    expect(screen.getByText("Hex")).toBeInTheDocument();
  });
});
