import { DesignSystemEditor } from "@design-alive/editor";
import { useSubscription } from "../../hooks/useSubscription";
import UserNav from "../../components/UserNav";
import SiteFooter from "../../components/SiteFooter";

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
      <SiteFooter />
      {import.meta.env.DEV && (
        <button
          onClick={toggleDevPro}
          className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-lg text-[12px] font-mono transition-colors"
          style={{
            backgroundColor: isDevPro ? "hsl(142 71% 30%)" : "hsl(var(--foreground))",
            color: isDevPro ? "#fff" : "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
          }}
        >
          {isDevPro ? "PRO ON" : "PRO OFF"}
        </button>
      )}
    </>
  );
}
