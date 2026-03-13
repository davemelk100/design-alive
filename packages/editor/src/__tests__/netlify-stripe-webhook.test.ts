import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockConstructEvent = vi.fn();
const mockUpdateUser = vi.fn();

class StripeMock {
  webhooks = { constructEvent: mockConstructEvent };
}
vi.mock("stripe", () => ({ default: StripeMock }));

vi.mock("@clerk/clerk-sdk-node", () => ({
  createClerkClient: vi.fn(() => ({
    users: { updateUser: mockUpdateUser },
  })),
}));

// ── Import handler after mocks ───────────────────────────────────────────────

const { handler } = await import(
  "../../../../netlify/functions/stripe-webhook"
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeEvent(overrides: Record<string, unknown> = {}) {
  return {
    headers: { "stripe-signature": "sig_test" },
    body: "raw-body",
    ...overrides,
  };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe("stripe-webhook", () => {
  const ORIG_ENV = { ...process.env };

  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_xxx";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    process.env.CLERK_SECRET_KEY = "ck_test_xxx";
    mockUpdateUser.mockResolvedValue({});
  });

  afterEach(() => {
    process.env = { ...ORIG_ENV };
    vi.clearAllMocks();
  });

  // ── Missing config ─────────────────────────────────────────────────────

  it("returns 500 when STRIPE_SECRET_KEY is missing", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe("Missing server configuration");
  });

  it("returns 500 when STRIPE_WEBHOOK_SECRET is missing", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe("Missing server configuration");
  });

  it("returns 500 when CLERK_SECRET_KEY is missing", async () => {
    delete process.env.CLERK_SECRET_KEY;
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe("Missing server configuration");
  });

  // ── Signature verification ─────────────────────────────────────────────

  it("returns 400 when webhook signature is invalid", async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });
    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe("Invalid signature");
  });

  it("passes body, sig, and secret to constructEvent", async () => {
    mockConstructEvent.mockReturnValue({ type: "unknown.event", data: {} });
    await handler(makeEvent());
    expect(mockConstructEvent).toHaveBeenCalledWith(
      "raw-body",
      "sig_test",
      "whsec_test",
    );
  });

  // ── checkout.session.completed ─────────────────────────────────────────

  it("updates Clerk user to pro on checkout.session.completed", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { clerkUserId: "user_abc" },
          customer: "cus_123",
          subscription: "sub_456",
        },
      },
    });

    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(200);
    expect(mockUpdateUser).toHaveBeenCalledWith("user_abc", {
      publicMetadata: {
        plan: "pro",
        stripeCustomerId: "cus_123",
        stripeSubscriptionId: "sub_456",
      },
    });
  });

  it("skips Clerk update when clerkUserId is missing from checkout metadata", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: {},
          customer: "cus_123",
          subscription: "sub_456",
        },
      },
    });

    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(200);
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  // ── customer.subscription.deleted ──────────────────────────────────────

  it("downgrades Clerk user to free on subscription.deleted", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.deleted",
      data: {
        object: {
          metadata: { clerkUserId: "user_xyz" },
          customer: "cus_789",
        },
      },
    });

    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(200);
    expect(mockUpdateUser).toHaveBeenCalledWith("user_xyz", {
      publicMetadata: {
        plan: "free",
        stripeCustomerId: "cus_789",
        stripeSubscriptionId: null,
      },
    });
  });

  it("skips Clerk update when clerkUserId is missing from subscription metadata", async () => {
    mockConstructEvent.mockReturnValue({
      type: "customer.subscription.deleted",
      data: {
        object: {
          metadata: {},
          customer: "cus_789",
        },
      },
    });

    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(200);
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  // ── Unrecognized event types ───────────────────────────────────────────

  it("returns 200 for unrecognized event types without updating Clerk", async () => {
    mockConstructEvent.mockReturnValue({
      type: "invoice.payment_succeeded",
      data: { object: {} },
    });

    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).received).toBe(true);
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  // ── Handler error ──────────────────────────────────────────────────────

  it("returns 500 when Clerk updateUser throws", async () => {
    mockConstructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { clerkUserId: "user_err" },
          customer: "cus_000",
          subscription: "sub_000",
        },
      },
    });
    mockUpdateUser.mockRejectedValue(new Error("Clerk down"));

    const result = await handler(makeEvent());
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body).error).toBe("Webhook handler failed");
  });
});
