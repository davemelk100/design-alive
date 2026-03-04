import Stripe from "stripe";
import { createClerkClient } from "@clerk/clerk-sdk-node";

const ALLOWED_ORIGINS = [
  "https://themal.netlify.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

function corsHeaders(origin?: string) {
  const allowed = ALLOWED_ORIGINS.includes(origin || "") ? origin! : ALLOWED_ORIGINS[0];
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

export const handler = async (event: any) => {
  const headers = corsHeaders(event.headers.origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const clerkKey = process.env.CLERK_SECRET_KEY;
  if (!stripeKey || !clerkKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Missing server configuration" }),
    };
  }

  try {
    // Verify Clerk session
    const token = (event.headers.authorization || "").replace("Bearer ", "");
    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Not authenticated" }),
      };
    }

    const clerk = createClerkClient({ secretKey: clerkKey });
    let userId: string;
    try {
      const session = await clerk.verifyToken(token);
      userId = session.sub;
    } catch {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Invalid session" }),
      };
    }

    const { billingCycle } = JSON.parse(event.body || "{}");
    const priceId =
      billingCycle === "yearly"
        ? process.env.STRIPE_YEARLY_PRICE_ID
        : process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Price not configured" }),
      };
    }

    const stripe = new Stripe(stripeKey);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${event.headers.origin || "https://themal.netlify.app"}/?checkout=success`,
      cancel_url: `${event.headers.origin || "https://themal.netlify.app"}/pricing`,
      metadata: { clerkUserId: userId },
      subscription_data: { metadata: { clerkUserId: userId } },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error("create-checkout-session error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};
