import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, SignInButton } from "@clerk/clerk-react";
import { useSubscription } from "../hooks/useSubscription";
import SiteFooter, { SiteFooterBranding } from "../components/SiteFooter";
import ThemalLogo from "../components/ThemalLogo";

const check = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[2px]">
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const freeFeatures = [
  "Color picking & live derivation",
  "Random palette generation (Refresh)",
  "Card style, typography, alerts customization",
  "Per-section CSS + Tailwind and Design Token export",
  "Shareable theme URLs",
  "Reset to defaults",
  "Dark mode support",
];

const proFeatures = [
  "Everything in Free, plus:",
  "Color harmony schemes (complementary, analogous, triadic, split-complementary)",
  "Color locks — pin colors during regeneration",
  "Image-based palette extraction",
  "Export palette as SVG, PNG, or HEX/RGB/RGBA text",
  "GitHub PR integration",
  "WCAG AA accessibility audit with auto-fix",
  "Undo support for theme refreshes",
  "Hover & active state customization",
];

function UpgradeButton() {
  const { isSignedIn, getToken } = useAuth();
  const { isPro } = useSubscription();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button
          className="mt-6 w-full inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-80"
          style={{
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
          }}
        >
          Sign in to upgrade
        </button>
      </SignInButton>
    );
  }

  if (isPro) {
    return (
      <div
        className="mt-6 w-full inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-[14px] font-medium"
        style={{
          backgroundColor: "hsl(var(--muted))",
          color: "hsl(var(--muted-foreground))",
        }}
      >
        Current plan
      </div>
    );
  }

  async function handleUpgrade() {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ billingCycle }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid hsl(var(--border))" }}>
        <button
          onClick={() => setBillingCycle("monthly")}
          className="flex-1 px-3 py-2 text-[13px] font-medium transition-colors"
          style={{
            backgroundColor: billingCycle === "monthly" ? "hsl(var(--primary))" : "transparent",
            color: billingCycle === "monthly" ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
          }}
        >
          $9/month
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className="flex-1 px-3 py-2 text-[13px] font-medium transition-colors"
          style={{
            backgroundColor: billingCycle === "yearly" ? "hsl(var(--primary))" : "transparent",
            color: billingCycle === "yearly" ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
          }}
        >
          $49/year
        </button>
      </div>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-80 disabled:opacity-50"
        style={{
          backgroundColor: "hsl(var(--primary))",
          color: "hsl(var(--primary-foreground))",
        }}
      >
        {loading ? "Redirecting..." : "Upgrade to Pro"}
      </button>
    </div>
  );
}

export default function Pricing() {
  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: "hsl(var(--background))" }}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Link
          to="/"
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
          Start for free, upgrade when you need more.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free tier */}
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
            <div className="mb-6">
              <span className="text-2xl font-semibold" style={{ color: "hsl(var(--foreground))" }}>$0</span>
              <span className="text-[14px] ml-1" style={{ color: "hsl(var(--muted-foreground))" }}>forever</span>
            </div>
            <p className="text-[14px] mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              Everything you need to get started.
            </p>
            <ul className="space-y-3 flex-1">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px]" style={{ color: "hsl(var(--foreground))" }}>
                  {check}
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro tier */}
          <div
            className="rounded-xl p-6 flex flex-col"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "2px solid hsl(var(--primary))",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                Pro
              </h2>
              <span
                className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
              >
                Recommended
              </span>
            </div>
            <div className="mb-2">
              <span className="text-2xl font-semibold" style={{ color: "hsl(var(--foreground))" }}>$9</span>
              <span className="text-[14px] ml-1" style={{ color: "hsl(var(--muted-foreground))" }}>/month</span>
            </div>
            <p className="text-[14px] mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>
              or $49/year (save 55%)
            </p>
            <ul className="space-y-3 flex-1">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px]" style={{ color: "hsl(var(--foreground))" }}>
                  {check}
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <UpgradeButton />
          </div>
        </div>
      </div>
      <SiteFooterBranding />
      <SiteFooter />
    </div>
  );
}
