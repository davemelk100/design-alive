import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import ThemalLogo from "../components/ThemalLogo";
import JsonLd from "../components/JsonLd";
import usePageMeta from "../hooks/usePageMeta";

const check = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[2px]">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const freeFeatures = [
  "Color picking and live derivation",
  "Random palette generation",
  "Color locks during regeneration",
  "Card style, typography, alerts customization",
  "Per-section CSS and Tailwind export",
  "Shareable theme URLs",
  "Reset to defaults",
  "Dark mode support",
];

const proFeatures = [
  "Everything in Free, plus:",
  "Color harmony schemes (complementary, analogous, triadic, split-complementary)",
  "Image-based palette extraction",
  "Export palette as SVG, PNG, or text",
  "GitHub PR integration",
  "WCAG AA accessibility audit with auto-fix",
  "Undo support for theme refreshes",
  "Hover and active state customization",
  "Design token (W3C) export",
];

export default function Pricing() {
  const { getToken, isSignedIn } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const pendingCheckoutRef = useRef(false);

  const handleCheckout = useCallback(async (cycle: "monthly" | "yearly" | "test") => {
    if (!isSignedIn) {
      sessionStorage.setItem("pending_checkout", cycle);
      window.location.href = "/sign-in?redirect_url=/pricing";
      return;
    }
    setLoading(cycle);
    setError("");
    try {
      const token = await getToken();
      const res = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ billingCycle: cycle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }, [isSignedIn, getToken]);

  // Auto-trigger checkout after returning from sign-in
  useEffect(() => {
    if (!isSignedIn || pendingCheckoutRef.current) return;
    const pending = sessionStorage.getItem("pending_checkout") as "monthly" | "yearly" | "test" | null;
    if (pending) {
      pendingCheckoutRef.current = true;
      sessionStorage.removeItem("pending_checkout");
      handleCheckout(pending);
    }
  }, [isSignedIn, handleCheckout]);

  usePageMeta({
    title: "Pricing | Themal Design System Editor",
    description:
      "Themal pricing: Free plan for personal projects, Pro at $10/month or $50/year for teams. Includes color harmony schemes, image palette extraction, GitHub PR integration, and WCAG auditing.",
  });

  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Themal",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "0",
      highPrice: "50",
      offerCount: 3,
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", description: "Core design system editing for personal projects." },
        { "@type": "Offer", name: "Pro Monthly", price: "10", priceCurrency: "USD", description: "Full power for teams and professional workflows. Billed monthly." },
        { "@type": "Offer", name: "Pro Yearly", price: "50", priceCurrency: "USD", description: "Full power for teams and professional workflows. Billed annually, save over 50%." },
      ],
    },
  };

  return (
    <div className="flex-1 flex flex-col bg-page">
      <JsonLd data={pricingSchema} />
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-end gap-3 mb-3 text-fg">
          <ThemalLogo className="h-10 sm:h-12" />
          <h1 className="text-3xl sm:text-4xl font-light title-font text-fg" style={{ lineHeight: ".75" }}>
            Pricing
          </h1>
        </div>
        <p className="text-sm leading-relaxed mb-8 text-muted-foreground">
          Start free. Upgrade when you need the full toolkit.
        </p>

        {error && (
          <div
            className="rounded-lg px-4 py-3 mb-6 text-sm"
            style={{
              backgroundColor: "hsl(var(--destructive) / 0.1)",
              color: "hsl(var(--destructive))",
              border: "1px solid hsl(var(--destructive) / 0.25)",
            }}
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {/* Free */}
          <Link
            to="/editor"
            className="rounded-xl p-6 flex flex-col no-underline cursor-pointer transition-opacity hover:opacity-80 bg-card-surface"
            style={{
              border: "1px solid hsl(var(--border))",
            }}
          >
            <h2 className="text-xl font-semibold mb-1 text-fg">
              Free
            </h2>
            <div className="mb-3">
              <span className="text-3xl font-semibold text-fg">$0</span>
              <span className="text-sm ml-1 text-muted-foreground">forever</span>
            </div>
            <div
              className="w-full h-10 rounded-lg text-sm font-medium flex items-center justify-center mb-4 text-fg border-theme"
              style={{
                border: "1px solid hsl(var(--border))",
              }}
            >
              Get Started
            </div>
            <p className="text-xs mb-4 text-muted-foreground">
              Core design system editing for personal projects.
            </p>
            <ul className="space-y-2 flex-1">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-fg">
                  {check}
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Link>

          {/* Pro */}
          <div
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("[data-no-card-click]")) return;
              handleCheckout(billingCycle);
            }}
            className="rounded-xl p-6 flex flex-col relative cursor-pointer transition-opacity hover:opacity-80 bg-card-surface"
            style={{
              border: "2px solid hsl(var(--primary))",
            }}
          >
            <span
              className="absolute -top-3 left-6 text-[11px] font-semibold uppercase tracking-wider px-3 py-0.5 rounded-full"
              style={{
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              Recommended
            </span>
            <h2 className="text-xl font-semibold mb-1 text-fg">
              Pro
            </h2>
            <div className="mb-3">
              <span className="text-3xl font-semibold text-fg">
                {billingCycle === "monthly" ? "$10" : "$50"}
              </span>
              <span className="text-sm ml-1 text-muted-foreground">
                {billingCycle === "monthly" ? "/month" : "/year"}
              </span>
            </div>

            {/* Billing toggle */}
            <div
              data-no-card-click
              className="rounded-lg p-3 mb-3 text-xs"
              style={{
                backgroundColor: "hsl(var(--foreground) / 0.04)",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <div className="flex gap-1 mb-2 rounded-md overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className="flex-1 py-1.5 text-xs font-medium transition-colors cursor-pointer border-none"
                  style={{
                    backgroundColor: billingCycle === "monthly" ? "hsl(var(--primary))" : "transparent",
                    color: billingCycle === "monthly" ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className="flex-1 py-1.5 text-xs font-medium transition-colors cursor-pointer border-none"
                  style={{
                    backgroundColor: billingCycle === "yearly" ? "hsl(var(--primary))" : "transparent",
                    color: billingCycle === "yearly" ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  Yearly
                </button>
              </div>
              <div className="text-muted-foreground">
                {billingCycle === "monthly"
                  ? "$10/mo. $120 billed annually at monthly rate."
                  : "$50/yr. That's ~$4.17/mo. Save over 58% vs monthly."}
              </div>
            </div>

            <div
              className="w-full h-10 rounded-lg text-sm font-medium flex items-center justify-center mb-4"
              style={{
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
              }}
            >
              {loading ? "Redirecting..." : `Subscribe ${billingCycle === "monthly" ? "Monthly" : "Yearly"}`}
            </div>

            <p className="text-xs mb-4 text-muted-foreground">
              Full power for teams and professional workflows.
            </p>
            <ul className="space-y-2 flex-1">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-fg">
                  {check}
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
