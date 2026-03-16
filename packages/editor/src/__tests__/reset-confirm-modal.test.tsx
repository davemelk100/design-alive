/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { ResetConfirmModal } from "../components/ResetConfirmModal";

describe("ResetConfirmModal", () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: "Reset Everything?",
    message: "All customizations will be lost.",
    id: "test-reset-modal",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when open is false", () => {
    const { container } = render(
      <ResetConfirmModal {...defaultProps} open={false} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders title and message when open", () => {
    render(<ResetConfirmModal {...defaultProps} />);
    expect(screen.getByText("Reset Everything?")).toBeInTheDocument();
    expect(screen.getByText("All customizations will be lost.")).toBeInTheDocument();
  });

  it("renders Cancel and default Reset button", () => {
    render(<ResetConfirmModal {...defaultProps} />);
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Reset")).toBeInTheDocument();
  });

  it("uses custom confirmText when provided", () => {
    render(
      <ResetConfirmModal {...defaultProps} confirmText="Reset theme to default" />,
    );
    expect(screen.getByText("Reset theme to default")).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", () => {
    render(<ResetConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });

  it("calls onConfirm and onClose when confirm button is clicked", () => {
    render(<ResetConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText("Reset"));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    render(<ResetConfirmModal {...defaultProps} />);
    const backdrop = screen.getByRole("dialog");
    fireEvent.click(backdrop);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when modal panel is clicked", () => {
    render(<ResetConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText("All customizations will be lost."));
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it("has correct accessibility attributes", () => {
    render(<ResetConfirmModal {...defaultProps} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "test-reset-modal");
  });

  it("confirm button has destructive styling class", () => {
    render(<ResetConfirmModal {...defaultProps} />);
    const confirmBtn = screen.getByText("Reset");
    expect(confirmBtn.className).toContain("ds-bg-destructive");
    expect(confirmBtn.className).toContain("ds-text-destructive-fg");
  });
});
