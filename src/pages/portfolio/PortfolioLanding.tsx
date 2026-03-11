import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DesignSystemEditor } from "@design-alive/editor";
import { useSubscription } from "../../hooks/useSubscription";
import UserNav from "../../components/UserNav";
import usePageMeta from "../../hooks/usePageMeta";

export default function PortfolioLanding() {
  usePageMeta({
    title: "Design System Editor | Themal",
    description:
      "Open Themal's interactive design system editor. Pick colors, customize typography, cards, and alerts, enforce WCAG AA contrast, and export CSS or open a GitHub PR.",
  });

  const { licenseKey } = useSubscription();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkout") === "success") {
      setShowSuccess(true);
      setSearchParams({}, { replace: true });
      const t = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(t);
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="mx-auto w-full" style={{ maxWidth: "1500px" }}>
      {showSuccess && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-lg shadow-lg text-[14px] font-medium animate-fade-in"
          style={{
            backgroundColor: "hsl(var(--success))",
            color: "hsl(var(--success-foreground))",
          }}
        >
          Payment successful. Pro features are now unlocked.
        </div>
      )}
      <DesignSystemEditor
        prEndpointUrl="/.netlify/functions/create-design-pr"
        accessibilityAudit={true}
        licenseKey={licenseKey}
        upgradeUrl="/pricing"
        signInUrl="/sign-in"
        headerRight={<UserNav />}
        featuresUrl="/readme"
        aboutUrl="/about"
        showHeader={false}
        showNavLinks={false}
      />
    </div>
  );
}
