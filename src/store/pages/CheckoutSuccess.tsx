import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");

  // Legal modal management
  const legalModal = searchParams.get("legal");
  const openLegalModal = (type: "privacy" | "terms") => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("legal", type);
    setSearchParams(newParams);
  };
  const closeLegalModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("legal");
    setSearchParams(newParams);
  };

  useEffect(() => {
    // Clear cart on successful checkout (only once on mount)
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  return (
    <div
      className="min-h-screen text-gray-900 dark:text-white store-page pb-16 relative overflow-hidden"
      style={{
        backgroundColor: "#f0f0f0",
      }}
    >
      {/* Top Header with DM, Nav, Cart, and Profile */}
      <StoreHeader sticky={false} />

      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-4">
                <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <h1
              className="text-4xl sm:text-5xl font-bold uppercase"
              style={{ color: "black" }}
            >
              Thank You!
            </h1>
            <p className="text-lg" style={{ color: "black" }}>
              Your order has been received and is being processed.
            </p>

            {sessionId && (
              <p
                className="text-xs"
                style={{ color: "black", fontSize: "12px" }}
              >
                Order ID: {sessionId}
              </p>
            )}

            <div className="pt-6">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Continue Shopping clicked");
                  navigate("/store");
                }}
                className="px-2 py-3 font-semibold rounded-md transition-all hover:scale-105 relative z-20"
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
                Continue Shopping
              </button>
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

export default CheckoutSuccess;
