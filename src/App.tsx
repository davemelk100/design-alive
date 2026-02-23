import { useEffect } from "react";

import { ThemeProvider } from "./context/ThemeContext";
import { applyStoredThemeColors } from "./pages/portfolio/DesignSystemPage";
import ThemePreviewBar from "./components/ThemePreviewBar";
import { CartProvider, StoreProvider, AuthProvider } from "./store";
import { ProtectedRoute } from "./store/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";

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
const CaseStudies = lazy(() => import("./pages/CaseStudies"));

// Lazy load portfolio pages
const PortfolioLanding = lazy(() => import("./pages/portfolio/PortfolioLanding"));
const LabPage = lazy(() => import("./pages/portfolio/LabPage"));
// const StoriesPage = lazy(() => import("./pages/portfolio/StoriesPage"));
const DesignPage = lazy(() => import("./pages/portfolio/DesignPage"));
const ArticlesPage = lazy(() => import("./pages/portfolio/ArticlesPage"));
// const CareerPage = lazy(() => import("./pages/portfolio/CareerPage"));
const ContactPage = lazy(() => import("./pages/portfolio/ContactPage"));
const TestimonialsPage = lazy(() => import("./pages/portfolio/TestimonialsPage"));
const DesignSystemPage = lazy(() => import("./pages/portfolio/DesignSystemPage"));

// Lazy load non-critical UI components to reduce critical path
const MobileTrayMenu = lazy(() => import("./components/MobileTrayMenu"));
const Footer = lazy(() =>
  import("./components/Footer").then((module) => ({ default: module.Footer })),
);

function App() {
  const location = useLocation();

  // Restore saved theme colors on app mount
  useEffect(() => {
    applyStoredThemeColors();
  }, []);

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
    <div className="min-h-screen text-gray-900 transition-colors duration-300 dark:text-white pb-20 sm:pb-0 flex flex-col relative">
      <main className="flex-1 relative z-10">
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
                      <a
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
                      </Link>
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/portfolio" element={<PortfolioLanding />} />
            <Route path="/portfolio/lab" element={<LabPage />} />
            {/* <Route path="/portfolio/stories" element={<StoriesPage />} /> */}
            <Route path="/portfolio/design" element={<DesignPage />} />
            <Route path="/portfolio/articles" element={<ArticlesPage />} />
            {/* <Route path="/portfolio/career" element={<CareerPage />} /> */}
            <Route path="/portfolio/testimonials" element={<TestimonialsPage />} />
            <Route path="/portfolio/contact" element={<ContactPage />} />
            <Route path="/portfolio/design-system" element={<DesignSystemPage />} />
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
            <Route path="/case-studies" element={<CaseStudies />} />
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

      {/* Global Dark Mode Toggle - Visible on all pages */}
      <div className="fixed top-2 right-0 z-50 flex items-center gap-2">
        {/* Dark Mode Toggle - Hide on store, discogs, portfolio, and related pages */}
        {location.pathname !== "/" &&
          !isPortfolioPath &&
          location.pathname !== "/case-studies" &&
          location.pathname !== "/discogs" &&
          location.pathname !== "/consult" &&
          location.pathname !== "/cygnet" &&
          !location.pathname.startsWith("/store") && (
            <button
              onClick={() => {
                const html = document.documentElement;
                if (html.classList.contains("dark")) {
                  html.classList.remove("dark");
                  localStorage.setItem("theme", "light");
                } else {
                  html.classList.add("dark");
                  localStorage.setItem("theme", "dark");
                }
              }}
              className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
              aria-label="Toggle dark mode"
            >
              <svg
                className="w-4 h-4 text-gray-700 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <svg
                className="w-4 h-4 text-gray-700 dark:text-gray-300 absolute opacity-0 dark:opacity-100 transition-opacity duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>
          )}
      </div>
      <ThemePreviewBar />
      <Toaster />
    </div>
  );
}

// Wrap the App with Router at the root level
export default function AppWithRouter() {
  return (
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
  );
}
