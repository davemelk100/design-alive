/// <reference types="vitest/globals" />
import { storage } from "../utils/storage";

// ---------------------------------------------------------------------------
// Storage - deserialization safety
// ---------------------------------------------------------------------------
describe("storage.get safety", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null for corrupt JSON", () => {
    localStorage.setItem("test-corrupt", "{not valid json}}}");
    const result = storage.get("test-corrupt");
    expect(result).toBeNull();
  });

  it("returns default value for corrupt JSON when default is provided", () => {
    localStorage.setItem("test-corrupt2", "{{bad");
    const result = storage.get("test-corrupt2", { fallback: true });
    expect(result).toEqual({ fallback: true });
  });

  it("returns parsed object for valid JSON", () => {
    localStorage.setItem("test-valid", '{"a":1}');
    const result = storage.get<{ a: number }>("test-valid");
    expect(result).toEqual({ a: 1 });
  });

  it("returns null for null JSON value", () => {
    localStorage.setItem("test-null", "null");
    const result = storage.get("test-null");
    expect(result).toBeNull();
  });

  it("returns default for undefined JSON value", () => {
    localStorage.setItem("test-undef", "undefined");
    const result = storage.get("test-undef", "fallback");
    expect(result).toBe("fallback");
  });

  it("uses validator to reject invalid shapes", () => {
    localStorage.setItem("test-shape", '{"wrong":"shape"}');
    const isNumber = (v: unknown): v is number => typeof v === "number";
    const result = storage.get<number>("test-shape", undefined, isNumber);
    expect(result).toBeNull();
  });

  it("uses validator to accept valid shapes", () => {
    localStorage.setItem("test-num", "42");
    const isNumber = (v: unknown): v is number => typeof v === "number";
    const result = storage.get<number>("test-num", undefined, isNumber);
    expect(result).toBe(42);
  });
});
