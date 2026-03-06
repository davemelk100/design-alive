import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import SiteFooter, { SiteFooterBranding } from "../components/SiteFooter";
import ThemalLogo from "../components/ThemalLogo";

const check = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[2px]">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const freeFeatures = [
  "Color picking and live derivation",
  "Random palette generation",
  "Card style, typography, alerts customization",
  "Per-section CSS and Tailwind export",
  "Shareable theme URLs",
  "Reset to defaults",
  "Dark mode support",
];

const proFeatures = [
  "Everything in Free, plus:",
  "Color harmony schemes (complementary, analogous, triadic, split-complementary)",
  "Color locks during regeneration",
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

  const handleCheckout = async (cycle: "monthly" | "yearly" | "test") => {
    if (!isSignedIn) {
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
  };

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: "hsl(var(--background))" }}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          to="/editor"
          className="inline-flex items-center gap-1 text-[14px] font-medium mb-6 hover:opacity-70 transition-opacity"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          &larr; Back to Editor
        </Link>

        <div className="flex items-end gap-3 mb-3" style={{ color: "hsl(var(--foreground))" }}>
          <ThemalLogo className="h-10 sm:h-12" />
          <h1 className="text-3xl sm:text-4xl font-light title-font" style={{ color: "hsl(var(--foreground))", lineHeight: ".75" }}>
            Pricing
          </h1>
        </div>
        <p className="text-[14px] leading-relaxed mb-8" style={{ color: "hsl(var(--muted-foreground))" }}>
          Start free. Upgrade when you need the full toolkit.
        </p>

        {error && (
          <div
            className="rounded-lg px-4 py-3 mb-6 text-[14px]"
            style={{
              backgroundColor: "hsl(var(--destructive) / 0.1)",
              color: "hsl(var(--destructive))",
              border: "1px solid hsl(var(--destructive) / 0.25)",
            }}
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
          {/* Free */}
          <div
            className="rounded-xl p-6 flex flex-col"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
            }}
          >
            <h2 className="text-xl font-semibold mb-1" style={{ color: "hsl(var(--foreground))" }}>
              Free
            </h2>
            <div className="mb-4">
              <span className="text-3xl font-semibold" style={{ color: "hsl(var(--foreground))" }}>$0</span>
              <span className="text-[14px] ml-1" style={{ color: "hsl(var(--muted-foreground))" }}>forever</span>
            </div>
            <p className="text-[14px] mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              Core design system editing for personal projects.
            </p>
            <ul className="space-y-2.5 flex-1 mb-6">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px]" style={{ color: "hsl(var(--foreground))" }}>
                  {check}
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/editor"
              className="w-full h-10 rounded-lg text-[14px] font-medium flex items-center justify-center transition-opacity hover:opacity-80"
              style={{
                border: "1px solid hsl(var(--border))",
                color: "hsl(var(--foreground))",
              }}
            >
              Get Started
            </Link>
          </div>

          {/* Pro */}
          <div
            className="rounded-xl p-6 flex flex-col relative"
            style={{
              backgroundColor: "hsl(var(--card))",
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
            <h2 className="text-xl font-semibold mb-1" style={{ color: "hsl(var(--foreground))" }}>
              Pro
            </h2>
            <div className="mb-4">
              <span className="text-3xl font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                {billingCycle === "monthly" ? "$9" : "$50"}
              </span>
              <span className="text-[14px] ml-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                {billingCycle === "monthly" ? "/month" : "/year"}
              </span>
            </div>

            {/* Billing toggle */}
            <div
              className="rounded-lg p-3 mb-6 text-[13px]"
              style={{
                backgroundColor: "hsl(var(--foreground) / 0.04)",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <div className="flex gap-1 mb-2 rounded-md overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className="flex-1 py-1.5 text-[13px] font-medium transition-colors cursor-pointer border-none"
                  style={{
                    backgroundColor: billingCycle === "monthly" ? "hsl(var(--primary))" : "transparent",
                    color: billingCycle === "monthly" ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className="flex-1 py-1.5 text-[13px] font-medium transition-colors cursor-pointer border-none"
                  style={{
                    backgroundColor: billingCycle === "yearly" ? "hsl(var(--primary))" : "transparent",
                    color: billingCycle === "yearly" ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  Yearly
                </button>
              </div>
              <div style={{ color: "hsl(var(--muted-foreground))" }}>
                {billingCycle === "monthly"
                  ? "$9/mo. $108 billed annually at monthly rate."
                  : "$50/yr. That's ~$4.17/mo. Save over 50% vs monthly."}
              </div>
            </div>

            <p className="text-[14px] mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              Full power for teams and professional workflows.
            </p>
            <ul className="space-y-2.5 flex-1 mb-6">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px]" style={{ color: "hsl(var(--foreground))" }}>
                  {check}
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(billingCycle)}
              disabled={!!loading}
              className="w-full h-10 rounded-lg text-[14px] font-medium flex items-center justify-center transition-opacity hover:opacity-80 disabled:opacity-50 cursor-pointer disabled:cursor-wait"
              style={{
                backgroundColor: "hsl(var(--primary))",
                color: "hsl(var(--primary-foreground))",
                border: "none",
              }}
            >
              {loading ? "Redirecting..." : `Subscribe ${billingCycle === "monthly" ? "Monthly" : "Yearly"}`}
            </button>
          </div>
        </div>

        {/* Test checkout */}
        <div className="text-center mb-8">
          <button
            onClick={() => handleCheckout("test")}
            disabled={loading === "test"}
            className="text-[13px] font-light underline transition-opacity hover:opacity-70 cursor-pointer disabled:opacity-50 bg-transparent border-none"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {loading === "test" ? "Redirecting..." : "Test checkout ($0.10)"}
          </button>
        </div>
      </div>
      <SiteFooterBranding />
      <SiteFooter />
    </div>
  );
}
