import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setToken } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const baseUrl = import.meta.env.DEV
        ? "http://localhost:8888"
        : window.location.origin;
      const response = await fetch(
        `${baseUrl}/.netlify/functions/auth-register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Store token and redirect
      setToken(data.token);
      navigate("/store");
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
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

      {/* Signup Content */}
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
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
                CREATE ACCOUNT
              </h1>
              <p className="text-lg mb-8" style={{ color: "black" }}>
                Sign up to access the store
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "black" }}
                >
                  Name (optional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-md border"
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    backgroundColor: "#f0f0f0",
                    color: "rgb(80, 80, 80)",
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "black" }}
                >
                  Email *
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
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-md border"
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    backgroundColor: "#f0f0f0",
                    color: "rgb(80, 80, 80)",
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  }}
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                  style={{ color: "black" }}
                >
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-md border"
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    backgroundColor: "#f0f0f0",
                    color: "rgb(80, 80, 80)",
                    borderColor: "rgba(0, 0, 0, 0.1)",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  }}
                  placeholder="Confirm your password"
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
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm" style={{ color: "black" }}>
                Already have an account?{" "}
                <Link
                  to="/store/login"
                  className="underline hover:opacity-80"
                  style={{ color: "rgb(80, 80, 80)" }}
                >
                  Sign in
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

export default Signup;
