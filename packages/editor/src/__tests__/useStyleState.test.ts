/// <reference types="vitest/globals" />
import { renderHook, act } from "@testing-library/react";
import { useStyleState } from "../hooks/useStyleState";

interface MockStyle {
  preset: string;
  size: number;
  color: string;
}

const DEFAULT: MockStyle = { preset: "default", size: 12, color: "red" };

const PRESETS: Record<string, Partial<MockStyle>> = {
  default: { preset: "default", size: 12, color: "red" },
  large: { preset: "large", size: 24, color: "blue" },
  small: { preset: "small", size: 8, color: "green" },
};

describe("useStyleState", () => {
  it("initializes with the provided state", () => {
    const { result } = renderHook(() => useStyleState(DEFAULT, PRESETS));
    expect(result.current.state).toEqual(DEFAULT);
  });

  it("initializes with a lazy initializer function", () => {
    const { result } = renderHook(() =>
      useStyleState(() => ({ ...DEFAULT, size: 99 }), PRESETS),
    );
    expect(result.current.state.size).toBe(99);
  });

  it("update merges partial patches", () => {
    const { result } = renderHook(() => useStyleState(DEFAULT, PRESETS));
    act(() => result.current.update({ size: 20 }));
    expect(result.current.state.size).toBe(20);
    expect(result.current.state.color).toBe("red");
  });

  it('auto-sets preset to "custom" when updating without specifying preset', () => {
    const { result } = renderHook(() => useStyleState(DEFAULT, PRESETS));
    expect(result.current.state.preset).toBe("default");
    act(() => result.current.update({ size: 50 }));
    expect(result.current.state.preset).toBe("custom");
  });

  it("does not override preset when explicitly provided in patch", () => {
    const { result } = renderHook(() => useStyleState(DEFAULT, PRESETS));
    act(() => result.current.update({ size: 50, preset: "special" }));
    expect(result.current.state.preset).toBe("special");
  });

  it('does not reset preset if already "custom"', () => {
    const { result } = renderHook(() =>
      useStyleState({ ...DEFAULT, preset: "custom" }, PRESETS),
    );
    act(() => result.current.update({ size: 30 }));
    expect(result.current.state.preset).toBe("custom");
  });

  it("selectPreset applies preset values", () => {
    const { result } = renderHook(() => useStyleState(DEFAULT, PRESETS));
    act(() => result.current.selectPreset("large"));
    expect(result.current.state.preset).toBe("large");
    expect(result.current.state.size).toBe(24);
    expect(result.current.state.color).toBe("blue");
  });

  it("selectPreset does nothing for unknown preset keys", () => {
    const { result } = renderHook(() => useStyleState(DEFAULT, PRESETS));
    act(() => result.current.selectPreset("nonexistent"));
    expect(result.current.state).toEqual(DEFAULT);
  });

  it("setState directly sets the full state", () => {
    const { result } = renderHook(() => useStyleState(DEFAULT, PRESETS));
    act(() =>
      result.current.setState({ preset: "custom", size: 100, color: "purple" }),
    );
    expect(result.current.state).toEqual({
      preset: "custom",
      size: 100,
      color: "purple",
    });
  });
});
