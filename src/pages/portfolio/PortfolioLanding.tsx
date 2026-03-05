import { DesignSystemEditor } from "@design-alive/editor";
import { useSubscription } from "../../hooks/useSubscription";
import UserNav from "../../components/UserNav";
import SiteFooter, { SiteFooterBranding } from "../../components/SiteFooter";

export default function PortfolioLanding() {
  const { licenseKey } = useSubscription();

  return (
    <div className="max-w-6xl mx-auto w-full">
      <DesignSystemEditor
        prEndpointUrl="/.netlify/functions/create-design-pr"
        accessibilityAudit={true}
        licenseKey={licenseKey}
        upgradeUrl="/pricing"
        signInUrl="/sign-in"
        headerRight={<UserNav />}
        featuresUrl="/readme"
        aboutUrl="/about"
      />
      <SiteFooterBranding />
      <SiteFooter />
    </div>
  );
}
