import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockCreate = vi.fn();
const mockVerifyToken = vi.fn();

class StripeMock {
  checkout = { sessions: { create: mockCreate } };
}
vi.mock("stripe", () => ({ default: StripeMock }));

vi.mock("@clerk/clerk-sdk-node", () => ({
  createClerkClient: vi.fn(() => ({
    verifyToken: mockVerifyToken,
  })),
}));

// ── Import handler after mocks are installed ─────────────────────────────────

const { handler } = await import(
  "../../../../netlify/functions/create-checkout-session"
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeEvent(overrides: Record<string, unknown> = {}) {
  return {
    httpMethod: "POST",
    headers: {
      origin: "https://themalive.com",
      authorization: "Bearer fake-jwt-token",
    },
    body: JSON.stringify({ billingCycle: "monthly" }),
    ...overrides,
  };
}

function parseBody(result: { body: string }) {
  return JSON.parse(result.body);
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("create-checkout-session", () => {
  const ORIG_ENV = { ...process.env };

  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_xxx";
    process.env.CLERK_SECRET_KEY = "ck_test_xxx";
    process.env.STRIPE_MONTHLY_PRICE_ID = "price_monthly";
    process.env.STRIPE_YEARLY_PRICE_ID = "price_yearly";
    process.env.STRIPE_TEST_PRICE_ID = "price_test";

    mockVerifyToken.mockResolvedValue({ sub: "user_123" });
    mockCreate.mockResolvedValue({ url: "https://checkout.stripe.com/session" });
  });

  afterEach(() => {
    process.env = { ...ORIG_ENV };
    vi.clearAllMocks();
  });

  // ── CORS ───────────────────────────────────────────────────────────────

  describe("CORS", () => {
    it("returns 200 with CORS headers for OPTIONS preflight", async () => {
      const result = await handler(makeEvent({ httpMethod: "OPTIONS" }));
      expect(result.statusCode).toBe(200);
      expect(result.headers["Access-Control-Allow-Origin"]).toBe("https://themalive.com");
      expect(result.headers["Access-Control-Allow-Methods"]).toContain("POST");
    });

    it("falls back to first allowed origin for unknown origins", async () => {
      const result = await handler(
        makeEvent({
          httpMethod: "OPTIONS",
          headers: { origin: "https://evil.com", authorization: "Bearer x" },
        }),
      );
      expect(result.headers["Access-Control-Allow-Origin"]).toBe("https://themalive.com");
    });

    it("echoes back a valid localhost origin", async () => {
      const result = await handler(
        makeEvent({
          httpMethod: "OPTIONS",
          headers: { origin: "http://localhost:5173", authorization: "Bearer x" },
        }),
      );
      expect(result.headers["Access-Control-Allow-Origin"]).toBe("http://localhost:5173");
    });
  });

  // ── Method checks ──────────────────────────────────────────────────────

  it("returns 405 for non-POST methods", async () => {
    const result = await handler(makeEvent({ httpMethod: "GET" }));
    expect(result.statusCode).toBe(405);
    expect(parseBody(result).error).toBe("Method not allowed");
  });

  // ── Missing server config ──────────────────────────────────────────────

  it("returns 500 when STRIPE_SECRET_KEY is missing", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(500);
    expect(parseBody(result).error).toBe("Missing server configuration");
  });

  it("returns 500 when CLERK_SECRET_KEY is missing", async () => {
    delete process.env.CLERK_SECRET_KEY;
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(500);
    expect(parseBody(result).error).toBe("Missing server configuration");
  });

  // ── Auth ───────────────────────────────────────────────────────────────

  it("returns 401 when Authorization header is missing", async () => {
    const result = await handler(
      makeEvent({ headers: { origin: "https://themalive.com" } }),
    );
    expect(result.statusCode).toBe(401);
    expect(parseBody(result).error).toBe("Not authenticated");
  });

  it("returns 401 when Clerk verifyToken rejects (production)", async () => {
    delete process.env.NETLIFY_DEV;
    mockVerifyToken.mockRejectedValue(new Error("bad token"));
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(401);
    expect(parseBody(result).error).toBe("Invalid session");
  });

  it("falls back to unverified JWT decode in dev mode", async () => {
    process.env.NETLIFY_DEV = "true";
    mockVerifyToken.mockRejectedValue(new Error("bad token"));

    // Build a minimal JWT with sub claim
    const payload = Buffer.from(JSON.stringify({ sub: "user_dev" })).toString("base64");
    const fakeJwt = `header.${payload}.sig`;

    const result = await handler(
      makeEvent({
        headers: {
          origin: "https://themalive.com",
          authorization: `Bearer ${fakeJwt}`,
        },
      }),
    );
    expect(result.statusCode).toBe(200);
    expect(parseBody(result).url).toBeDefined();
  });

  // ── Stripe session creation ────────────────────────────────────────────

  it("creates a subscription checkout for monthly billing", async () => {
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(200);
    expect(parseBody(result).url).toBe("https://checkout.stripe.com/session");

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        line_items: [{ price: "price_monthly", quantity: 1 }],
        metadata: { clerkUserId: "user_123" },
      }),
    );
  });

  it("creates a subscription checkout for yearly billing", async () => {
    const result = await handler(
      makeEvent({ body: JSON.stringify({ billingCycle: "yearly" }) }),
    );
    expect(result.statusCode).toBe(200);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        line_items: [{ price: "price_yearly", quantity: 1 }],
      }),
    );
  });

  it("creates a one-time payment checkout for test billing cycle", async () => {
    const result = await handler(
      makeEvent({ body: JSON.stringify({ billingCycle: "test" }) }),
    );
    expect(result.statusCode).toBe(200);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        line_items: [{ price: "price_test", quantity: 1 }],
      }),
    );
  });

  // ── Missing price IDs ─────────────────────────────────────────────────

  it("returns 500 when monthly price ID is missing", async () => {
    delete process.env.STRIPE_MONTHLY_PRICE_ID;
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(500);
    expect(parseBody(result).error).toBe("Price not configured");
  });

  it("returns 500 when test price ID is missing for test billing", async () => {
    delete process.env.STRIPE_TEST_PRICE_ID;
    const result = await handler(
      makeEvent({ body: JSON.stringify({ billingCycle: "test" }) }),
    );
    expect(result.statusCode).toBe(500);
    expect(parseBody(result).error).toBe("Test price not configured");
  });

  // ── General error handling ─────────────────────────────────────────────

  it("returns 500 with error message when Stripe throws", async () => {
    mockCreate.mockRejectedValue(new Error("Stripe exploded"));
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(500);
    expect(parseBody(result).error).toBe("Stripe exploded");
  });

  it("uses correct success and cancel URLs from origin", async () => {
    const result = await handler(
      makeEvent({
        headers: {
          origin: "http://localhost:5173",
          authorization: "Bearer fake-jwt-token",
        },
      }),
    );
    expect(result.statusCode).toBe(200);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: "http://localhost:5173/editor?checkout=success",
        cancel_url: "http://localhost:5173/pricing",
      }),
    );
  });
});
