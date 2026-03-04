import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";

import { ThemeProvider } from "./context/ThemeContext";
import { applyStoredThemeColors } from "@design-alive/editor";
import CookieConsent from "./components/CookieConsent";

const PortfolioLanding = lazy(
  () => import("./pages/portfolio/PortfolioLanding"),
);
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const ReadmePage = lazy(() => import("./pages/ReadmePage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Features = lazy(() => import("./pages/Features"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const CookiesPolicy = lazy(() => import("./pages/CookiesPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const ClerkSignIn = lazy(() =>
  import("@clerk/clerk-react").then((m) => ({ default: m.SignIn })),
);
const ClerkSignUp = lazy(() =>
  import("@clerk/clerk-react").then((m) => ({ default: m.SignUp })),
);

export default function App() {
  const clerk = useClerk();

  useEffect(() => {
    applyStoredThemeColors();
  }, []);

  // Listen for sign-in requests from the editor's PremiumGate popover
  useEffect(() => {
    const handleSignIn = () => clerk.openSignIn();
    window.addEventListener("theemel:sign-in", handleSignIn);
    return () => window.removeEventListener("theemel:sign-in", handleSignIn);
  }, [clerk]);

  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="min-h-screen text-foreground transition-colors duration-300 flex flex-col relative">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-white focus:text-gray-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-dynamic dark:focus:bg-gray-900 dark:focus:text-white"
          >
            Skip to content
          </a>
          <main id="main-content" className="flex-1 relative z-10 flex flex-col">
            <Suspense
              fallback={
                <div className="min-h-screen" style={{ backgroundColor: "hsl(var(--background))" }}>
                  <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="h-6 w-24 rounded bg-current opacity-10 mb-6" />
                    <div className="h-10 w-64 rounded bg-current opacity-10 mb-8" />
                    <div className="space-y-4">
                      <div className="h-4 w-full rounded bg-current opacity-10" />
                      <div className="h-4 w-3/4 rounded bg-current opacity-10" />
                      <div className="h-4 w-5/6 rounded bg-current opacity-10" />
                    </div>
                  </div>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<PortfolioLanding />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/readme" element={<ReadmePage />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/features" element={<Features />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/cookies" element={<CookiesPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="/sign-in/*" element={<ClerkSignIn routing="path" path="/sign-in" />} />
                <Route path="/sign-up/*" element={<ClerkSignUp routing="path" path="/sign-up" />} />
              </Routes>
            </Suspense>
          </main>
          <CookieConsent />
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}
