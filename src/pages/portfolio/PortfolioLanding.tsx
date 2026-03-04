import { DesignSystemEditor } from "@design-alive/editor";
import { useSubscription } from "../../hooks/useSubscription";
import UserNav from "../../components/UserNav";
import SiteFooter, { SiteFooterBranding } from "../../components/SiteFooter";

export default function PortfolioLanding() {
  const { licenseKey, toggleDevPro, isDevPro } = useSubscription();

  return (
    <>
      <DesignSystemEditor
        prEndpointUrl="/.netlify/functions/create-design-pr"
        accessibilityAudit={true}
        licenseKey={licenseKey}
        upgradeUrl="/pricing"
        signInUrl="/sign-in"
        headerRight={<UserNav />}
      />
      <SiteFooterBranding />
      <SiteFooter />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 z-50 group"
      >
        <div
          className="translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-200 ease-out pt-0 pb-1"
        >
          <button
            onClick={toggleDevPro}
            className="px-2 py-0.5 rounded-b text-[9px] font-mono uppercase tracking-wider transition-colors"
            style={{
              backgroundColor: isDevPro ? "hsl(142 71% 30%)" : "hsl(var(--foreground))",
              color: isDevPro ? "#fff" : "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderTop: "none",
            }}
          >
            {isDevPro ? "PRO ON" : "PRO OFF"}
          </button>
        </div>
      </div>
    </>
  );
}
