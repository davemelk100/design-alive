import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DesignSystemEditor } from "@design-alive/editor";
import { useSubscription } from "../../hooks/useSubscription";
import UserNav from "../../components/UserNav";
import usePageMeta from "../../hooks/usePageMeta";
import { ContactForm, ReportBugForm } from "../../components/SiteFooter";

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
    <div className="mx-auto w-full site-container">
      {showSuccess && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-in surface-success"
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
        showSectionNav={false}
        sidebarLinks={[
          { to: "/features", label: "Features" },
          { to: "/pricing", label: "Pricing" },
          { to: "/about", label: "About" },
          { to: "/readme", label: "Docs" },
          { to: "/privacy", label: "Privacy" },
          { to: "/terms", label: "Terms" },
        ]}
        sidebarExtra={
          <>
            <ContactForm buttonClassName="ds-global-btn w-full h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2" />
            <ReportBugForm buttonClassName="ds-global-btn w-full h-9 px-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 flex items-center gap-2" />
            <div className="mt-auto pt-4">
              <a href="/" className="hover:opacity-70 transition-opacity">
                <img src="/themal-just-t.svg" alt="Themal" className="h-8" width="27" height="32" />
              </a>
            </div>
          </>
        }
      />
    </div>
  );
}
