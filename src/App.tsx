import { useEffect, lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";

import { ThemeProvider } from "./context/ThemeContext";
import { applyStoredThemeColors } from "./pages/portfolio/themeUtils";
import { CartProvider, StoreProvider, AuthProvider } from "./store";
import { ProtectedRoute } from "./store/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import ThemeToggle from "./components/ThemeToggle";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";

// Lazy load components
const Article = lazy(() => import("./pages/Article"));
const Archive = lazy(() => import("./pages/Archive"));

const JsonAiPrompts = lazy(() => import("./pages/JsonAiPrompts"));
const AudioTranscript = lazy(() => import("./pages/AudioTranscript"));

const Specs = lazy(() => import("./pages/Specs"));
const Story = lazy(() => import("./pages/Story"));
const MusicPlayer = lazy(() => import("./pages/MusicPlayer"));
const Store = lazy(() => import("./store/pages/Store"));
const ProductDetail = lazy(() => import("./store/pages/ProductDetail"));
const Checkout = lazy(() => import("./store/pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./store/pages/CheckoutSuccess"));
const Login = lazy(() => import("./store/pages/Login"));
const Signup = lazy(() => import("./store/pages/Signup"));
const AuthCallback = lazy(() => import("./store/pages/AuthCallback"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Discogs = lazy(() => import("./pages/Discogs"));
const Consult = lazy(() => import("./pages/Consult"));
const Cygnet = lazy(() => import("./pages/Cygnet"));
// Lazy load portfolio pages
const PortfolioLanding = lazy(() => import("./pages/portfolio/PortfolioLanding"));
const LabPage = lazy(() => import("./pages/portfolio/LabPage"));
const WritingPage = lazy(() => import("./pages/portfolio/WritingPage"));
const DesignSystemAbout = lazy(() => import("./pages/portfolio/DesignSystemAbout"));

// Lazy load non-critical UI components to reduce critical path
const MobileTrayMenu = lazy(() => import("./components/MobileTrayMenu"));
const Footer = lazy(() =>
  import("./components/Footer").then((module) => ({ default: module.Footer })),
);

function App() {
  const location = useLocation();

  // Apply saved theme colors only on portfolio and case-studies pages
  const isThemePath = location.pathname === "/portfolio" || location.pathname.startsWith("/portfolio/") || location.pathname === "/case-studies";
  useEffect(() => {
    if (isThemePath) {
      applyStoredThemeColors();
    } else {
      // Remove custom theme colors on non-portfolio pages
      const vars = ["--brand", "--background", "--foreground", "--primary", "--primary-foreground", "--secondary", "--secondary-foreground", "--muted", "--muted-foreground", "--accent", "--accent-foreground", "--destructive", "--destructive-foreground", "--success", "--success-foreground", "--warning", "--warning-foreground", "--border", "--ring"];
      vars.forEach((key) => document.documentElement.style.removeProperty(key));
    }
  }, [isThemePath]);

  // Scroll to top on route change (but not for internal navigation)
  useEffect(() => {
    // Only scroll to top if we're not navigating to a specific section
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Scroll to hash target after navigation
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      // Small delay to let the DOM render
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  const isPortfolioPath = location.pathname === "/portfolio" || location.pathname.startsWith("/portfolio/");

  return (
    <div className="min-h-screen text-foreground transition-colors duration-300 pb-20 lg:pb-0 flex flex-col relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-white focus:text-gray-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-dynamic dark:focus:bg-gray-900 dark:focus:text-white"
      >
        Skip to content
      </a>
      <main id="main-content" className="flex-1 relative z-10">
        <Suspense fallback={null}>
          <Routes>
            <Route
              path="/"
              element={
                <div
                  className="min-h-screen flex flex-col items-center font-helvetica bg-[#1d77af]"
                  style={{ color: "#ffffff" }}
                >
                  <div className="flex-1 flex flex-col items-center justify-center px-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-center uppercase tracking-tighter">
                      Melkonian Industries
                    </h1>
                    <img
                      src="/img/melkonian-industries-logo.svg"
                      alt="Melkonian Industries"
                      className="w-20 sm:w-24 lg:w-32 mb-12 brightness-0 invert"
                    />
                    <div className="flex flex-col sm:flex-row gap-6">
                      <Link
                        to="/portfolio"
                        className="text-lg font-medium text-white hover:text-white/80 transition-colors px-6 py-3 rounded-md hover:bg-white/10 border border-white text-center"
                      >
                        Portfolio
                      </Link>
                      {/* <a
                        href="https://www.majorleaguenumbers.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium text-white hover:text-white/80 transition-colors px-6 py-3 rounded-md hover:bg-white/10 border border-white text-center"
                      >
                        Major League Numbers
                      </a>
                      <Link
                        to="/consult"
                        className="text-lg font-medium text-white hover:text-white/80 transition-colors px-6 py-3 rounded-md hover:bg-white/10 border border-white text-center"
                      >
                        Consulting Services
                      </Link>
                      <Link
                        to="/cygnet"
                        className="text-lg font-medium text-white hover:text-white/80 transition-colors px-6 py-3 rounded-md hover:bg-white/10 border border-white text-center"
                      >
                        Cygnet Institute
                      </Link> */}
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/portfolio" element={<PortfolioLanding />} />
            <Route path="/portfolio/lab" element={<LabPage />} />
            <Route path="/portfolio/articles" element={<WritingPage />} />
            <Route path="/portfolio/design-system/about" element={<DesignSystemAbout />} />
            <Route path="/portfolio/design-system" element={<Navigate to="/portfolio" replace />} />
            <Route path="/portfolio/graphics" element={<Navigate to="/portfolio/lab" replace />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/json" element={<JsonAiPrompts />} />
            <Route path="/zaven" element={<AudioTranscript />} />

            <Route path="/specs" element={<Specs />} />
            <Route path="/story" element={<Story />} />
            <Route path="/music" element={<MusicPlayer />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/discogs" element={<Discogs />} />
            <Route path="/consult" element={<Consult />} />
            <Route path="/cygnet" element={<Cygnet />} />
            <Route path="/case-studies" element={<WritingPage />} />
            <Route path="/store/login" element={<Login />} />
            <Route path="/store/signup" element={<Signup />} />
            <Route path="/store/auth/callback" element={<AuthCallback />} />
            <Route path="/store" element={<Store />} />
            <Route path="/store/product/:id" element={<ProductDetail />} />
            <Route
              path="/store/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store/checkout/success"
              element={
                <ProtectedRoute>
                  <CheckoutSuccess />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>

      {/* Hide MobileTrayMenu on store, discogs, and cygnet pages */}
      {location.pathname !== "/discogs" &&
        location.pathname !== "/cygnet" &&
        !location.pathname.startsWith("/store") && (
          <Suspense fallback={null}>
            <MobileTrayMenu />
          </Suspense>
        )}

      {/* Footer - Hide on home, store, and discogs pages */}
      {location.pathname !== "/" &&
      !location.pathname.startsWith("/store") &&
      location.pathname !== "/discogs" &&
      location.pathname !== "/cygnet" ? (
        <Suspense fallback={null} key={location.pathname}>
          <Footer />
        </Suspense>
      ) : null}

      {/* Global Dark Mode Toggle */}
      <div className="fixed top-2 right-0 z-50 flex items-center gap-2">
        {location.pathname !== "/" &&
          !isPortfolioPath &&
          location.pathname !== "/case-studies" &&
          location.pathname !== "/discogs" &&
          location.pathname !== "/consult" &&
          location.pathname !== "/cygnet" &&
          !location.pathname.startsWith("/store") && (
            <ThemeToggle className="text-foreground/80" />
          )}
      </div>
      <Toaster />
    </div>
  );
}

// Wrap the App with Router at the root level
export default function AppWithRouter() {
  return (
    <HelmetProvider>
      <Router>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <StoreProvider>
                <App />
              </StoreProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </HelmetProvider>
  );
}
