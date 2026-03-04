import { DesignSystemEditor } from "@design-alive/editor";
import { useSubscription } from "../../hooks/useSubscription";
import UserNav from "../../components/UserNav";
import SiteFooter, { SiteFooterBranding } from "../../components/SiteFooter";

export default function PortfolioLanding() {
  const { licenseKey } = useSubscription();

  return (
    <>
      <DesignSystemEditor
        prEndpointUrl="/.netlify/functions/create-design-pr"
        accessibilityAudit={true}
        licenseKey={licenseKey}
        upgradeUrl="/pricing"
        signInUrl="/sign-in"
        headerRight={<UserNav />}
        featuresUrl="/readme"
      />
      <SiteFooterBranding />
      <SiteFooter />
    </>
  );
}
