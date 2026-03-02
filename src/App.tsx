import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { applyStoredThemeColors } from "@design-alive/editor";

const PortfolioLanding = lazy(
  () => import("./pages/portfolio/PortfolioLanding"),
);
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const ReadmePage = lazy(() => import("./pages/ReadmePage"));

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
          <main id="main-content" className="flex-1 relative z-10">
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<PortfolioLanding />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/readme" element={<ReadmePage />} />
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
              className="underline uppercase hover:opacity-70 transition-opacity"
            >
              Melkonian Industries
            </a>
          </footer>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}
