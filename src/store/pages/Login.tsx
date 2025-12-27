import { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
  Link,
} from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const auth = useAuth();
  const { login, loginWithEmail, isAuthenticated, loading: authLoading } = auth;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  // Legal modal management
  const legalModal = searchParams.get("legal");
  const openLegalModal = (type: "privacy" | "terms") => {
    setSearchParams({ legal: type });
  };
  const closeLegalModal = () => {
    searchParams.delete("legal");
    setSearchParams(searchParams);
  };
  const [loading, setLoading] = useState(false);

  // Wait for auth to initialize
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  useEffect(() => {
    // If already authenticated, redirect to intended destination or store
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/store";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Check for error in URL
  const urlParams = new URLSearchParams(window.location.search);
  const urlError = urlParams.get("error");

  useEffect(() => {
    if (urlError) {
      setError(urlError);
    }
  }, [urlError]);

  const handleGoogleLogin = () => {
    if (login) {
      login();
    } else {
      console.error("Login function not available");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginWithEmail(formData.email, formData.password);
      const from = (location.state as any)?.from?.pathname || "/store";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen text-gray-900 dark:text-white store-page pb-16 relative overflow-hidden"
      style={{
        backgroundColor: "#f0f0f0",
      }}
    >
      {/* Top Header */}
      <StoreHeader sticky={false} />

      {/* Login Content */}
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h1
                className="text-4xl sm:text-5xl font-bold mb-4"
                style={{ color: "black" }}
              >
                SIGN IN
              </h1>
              <p className="text-lg mb-8" style={{ color: "black" }}>
                Sign in to access the store
              </p>
            </div>

            {error && (
              <div
                className="p-4 rounded-md mb-4"
                style={{
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  border: "1px solid #fecaca",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "black" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-md border"
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    backgroundColor: "#f0f0f0",
                    color: "rgb(80, 80, 80)",
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  }}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "black" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-md border"
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    backgroundColor: "#f0f0f0",
                    color: "rgb(80, 80, 80)",
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  }}
                  placeholder="Your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 font-semibold rounded-md transition-all hover:scale-105 relative z-20 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "16px",
                  backgroundColor: "#f0f0f0",
                  color: "rgb(80, 80, 80)",
                  boxShadow:
                    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  position: "relative",
                  zIndex: 20,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div
                  className="w-full border-t"
                  style={{ borderColor: "rgba(0, 0, 0, 0.1)" }}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  style={{
                    color: "black",
                    backgroundColor: "transparent",
                    padding: "0 1rem",
                  }}
                >
                  OR
                </span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full px-6 py-4 font-semibold rounded-md transition-all hover:scale-105 relative z-20 flex items-center justify-center gap-3"
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: "16px",
                backgroundColor: "#f0f0f0",
                color: "rgb(80, 80, 80)",
                boxShadow:
                  "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                position: "relative",
                zIndex: 20,
                cursor: "pointer",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <div className="text-center mt-6">
              <p className="text-sm" style={{ color: "black" }}>
                Don't have an account?{" "}
                <Link
                  to="/store/signup"
                  className="underline hover:opacity-80"
                  style={{ color: "rgb(80, 80, 80)" }}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Legal Modals */}
      <LegalModal
        isOpen={legalModal === "privacy"}
        onClose={closeLegalModal}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </LegalModal>

      <LegalModal
        isOpen={legalModal === "terms"}
        onClose={closeLegalModal}
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </LegalModal>

      {/* Sticky Footer with BALM */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "rgba(240, 240, 240, 1)",
          paddingTop: "2px",
          paddingBottom: "2px",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <span
              className="font-bold tracking-tight balm-logo"
              style={{
                color: "#d0d0d0",
                fontSize: "24px",
                textShadow:
                  "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
              }}
            >
              BALM
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openLegalModal("privacy")}
                className="text-xs text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-xs text-gray-400">•</span>
              <button
                onClick={() => openLegalModal("terms")}
                className="text-xs text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
