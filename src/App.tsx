import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { applyStoredThemeColors } from "@design-alive/editor";

const PortfolioLanding = lazy(
  () => import("./pages/portfolio/PortfolioLanding"),
);
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const ReadmePage = lazy(() => import("./pages/ReadmePage"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Features = lazy(() => import("./pages/Features"));
const ClerkSignIn = lazy(() =>
  import("@clerk/clerk-react").then((m) => ({ default: m.SignIn })),
);
const ClerkSignUp = lazy(() =>
  import("@clerk/clerk-react").then((m) => ({ default: m.SignUp })),
);

export default function App() {
  useEffect(() => {
    applyStoredThemeColors();
  }, []);

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
                <Route path="/sign-in/*" element={<ClerkSignIn routing="path" path="/sign-in" />} />
                <Route path="/sign-up/*" element={<ClerkSignUp routing="path" path="/sign-up" />} />
              </Routes>
            </Suspense>
          </main>
          <footer
            className="h-16 flex items-center justify-center text-[13px] font-light"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <a
              href="https://davemelk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-70 text-[13px] transition-opacity"
            >
              Another MELKONIAN INDUSTRIES production
            </a>
          </footer>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}
