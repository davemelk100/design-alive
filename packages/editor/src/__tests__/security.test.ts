/// <reference types="vitest/globals" />
import { sanitizeSvg, parseSvgSprite, parseIconFont } from "../utils/iconImport";
import { storage } from "../utils/storage";

// ---------------------------------------------------------------------------
// SVG Sanitizer - security tests
// ---------------------------------------------------------------------------
describe("sanitizeSvg", () => {
  it("strips <script> tags", () => {
    const result = sanitizeSvg(
      '<svg xmlns="http://www.w3.org/2000/svg"><script>alert("xss")</script><path d="M0 0"/></svg>',
    );
    expect(result).not.toContain("<script");
    expect(result).not.toContain("alert");
    expect(result).toContain("<path");
  });

  it("strips on* event handler attributes", () => {
    const result = sanitizeSvg(
      '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" onclick="alert(1)" onmouseover="alert(2)"/></svg>',
    );
    expect(result).not.toContain("onclick");
    expect(result).not.toContain("onmouseover");
  });

  it("strips javascript: href values", () => {
    const result = sanitizeSvg(
      '<svg xmlns="http://www.w3.org/2000/svg"><use href="javascript:alert(1)"/></svg>',
    );
    expect(result).not.toContain("javascript:");
  });

  it("strips data: URI values", () => {
    const result = sanitizeSvg(
      '<svg xmlns="http://www.w3.org/2000/svg"><image href="data:text/html,<script>alert(1)</script>"/></svg>',
    );
    expect(result).not.toContain("data:");
  });

  it("strips style attributes to prevent CSS exfiltration", () => {
    const result = sanitizeSvg(
      '<svg xmlns="http://www.w3.org/2000/svg"><rect style="background:url(https://evil.com/track)" width="10" height="10"/></svg>',
    );
    expect(result).not.toContain("style=");
    expect(result).not.toContain("evil.com");
  });

  it("strips non-whitelisted elements like <foreignObject>", () => {
    const result = sanitizeSvg(
      '<svg xmlns="http://www.w3.org/2000/svg"><foreignObject><body xmlns="http://www.w3.org/1999/xhtml"><script>alert(1)</script></body></foreignObject></svg>',
    );
    expect(result).not.toContain("foreignObject");
    expect(result).not.toContain("<body");
  });

  it("strips non-whitelisted attributes", () => {
    const result = sanitizeSvg(
      '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0" data-custom="payload" tabindex="0"/></svg>',
    );
    expect(result).not.toContain("data-custom");
    expect(result).not.toContain("tabindex");
  });

  it("returns empty string for malformed XML", () => {
    const result = sanitizeSvg("<not valid xml >>>");
    expect(result).toBe("");
  });

  it("preserves safe SVG content", () => {
    const input =
      '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
    const result = sanitizeSvg(input);
    expect(result).toContain("<circle");
    expect(result).toContain("cx=");
    expect(result).toContain("cy=");
    expect(result).toContain("fill=");
    expect(result).toContain("stroke-width=");
  });
});

// ---------------------------------------------------------------------------
// URL validation - icon fetching must reject non-HTTPS
// ---------------------------------------------------------------------------
describe("parseSvgSprite URL validation", () => {
  it("rejects http:// URLs", async () => {
    await expect(parseSvgSprite("http://example.com/sprite.svg")).rejects.toThrow("only HTTPS");
  });

  it("rejects javascript: URLs", async () => {
    await expect(parseSvgSprite("javascript:alert(1)")).rejects.toThrow();
  });

  it("rejects data: URLs", async () => {
    await expect(parseSvgSprite("data:text/html,<script>alert(1)</script>")).rejects.toThrow();
  });
});

describe("parseIconFont URL validation", () => {
  it("rejects http:// URLs", async () => {
    await expect(parseIconFont("http://example.com/icons.css")).rejects.toThrow("only HTTPS");
  });

  it("rejects javascript: URLs", async () => {
    await expect(parseIconFont("javascript:alert(1)")).rejects.toThrow();
  });
});

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
