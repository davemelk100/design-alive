import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, X, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";

const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, getTotalPrice, removeItem, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Legal modal management
  const legalModal = searchParams.get("legal");
  const openLegalModal = (type: "privacy" | "terms") => {
    setSearchParams({ legal: type });
  };
  const closeLegalModal = () => {
    searchParams.delete("legal");
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (items.length === 0) {
      navigate("/store");
    }
  }, [items, navigate]);

  const handleCheckout = async (e?: React.MouseEvent) => {
    console.log("Button clicked! Items:", items.length, "Loading:", loading);
    e?.preventDefault();
    e?.stopPropagation();

    if (items.length === 0) {
      console.log("Cart is empty, cannot checkout");
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare line items for Stripe
      const lineItems = items.map((item) => {
        const productData: {
          name: string;
          description?: string;
          images?: string[];
        } = {
          name: item.title,
        };

        // Only include description if it's not empty
        if (item.description && item.description.trim() !== "") {
          productData.description = item.description;
        }

        // Only include images if image exists and convert to absolute URL
        if (item.image) {
          // Convert relative URLs to absolute URLs
          let imageUrl = item.image;
          if (imageUrl.startsWith("/")) {
            imageUrl = `${window.location.origin}${imageUrl}`;
          } else if (
            !imageUrl.startsWith("http://") &&
            !imageUrl.startsWith("https://")
          ) {
            imageUrl = `${window.location.origin}/${imageUrl}`;
          }
          productData.images = [imageUrl];
        }

        return {
          price_data: {
            currency: "usd",
            product_data: productData,
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        };
      });

      console.log("Creating checkout session with items:", lineItems);

      // Call Netlify function to create checkout session
      const response = await fetch(
        "/.netlify/functions/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: lineItems,
            successUrl: `${
              window.location.origin || "http://localhost:5173"
            }/store/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${
              window.location.origin || "http://localhost:5173"
            }/store/checkout`,
          }),
        }
      );

      console.log("Response status:", response.status);

      // Check if response has content before parsing
      const text = await response.text();
      let data;

      if (!text) {
        console.error("Empty response from server. Status:", response.status);
        throw new Error(
          `Server returned empty response (${response.status}). Make sure the dev server is running: npm run dev:server`
        );
      }

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse response:", text);
        throw new Error(
          `Invalid response from server: ${text.substring(0, 100)}`
        );
      }

      if (!response.ok) {
        const errorMsg =
          data?.error || data?.message || `Server error (${response.status})`;
        console.error("Checkout error response:", data);
        throw new Error(errorMsg);
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        console.log("Redirecting to Stripe Checkout:", data.url);
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(
        err.message ||
          "An error occurred during checkout. Make sure the dev server is running: npm run dev:server"
      );
      setLoading(false);
    }
  };

  const total = getTotalPrice();

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className="min-h-screen text-gray-900 dark:text-white store-page pb-16 relative overflow-hidden"
      style={{
        backgroundColor: "#f0f0f0",
      }}
    >
      {/* Top Header with DM, Nav, Cart, and Profile */}
      <StoreHeader sticky={false} hideCart={true} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-black">
              CHECKOUT
            </h1>
            {/* <p className="text-black">
              Review your order and complete your purchase
            </p> */}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 flex justify-center">
              <div className="w-full max-w-md space-y-6">
                {/* <h2
                className="text-2xl mb-6"
                style={{
                  color: "black",
                }}
              >
                Order Summary
              </h2> */}
                <div
                  className="relative rounded-xl backdrop-blur-2xl w-full"
                  style={{ padding: "8px" }}
                >
                  {/* Clear Liquid Glass Background Blobs */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl -z-10">
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/20 rounded-full blur-3xl opacity-40"></div>
                    <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-white/15 rounded-full blur-3xl opacity-35"></div>
                  </div>

                  {/* Fluid gradient overlays - muted colors */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-400/8 via-transparent to-gray-300/5"></div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-tl from-transparent via-gray-500/6 to-gray-400/8"></div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-300/4 via-transparent to-gray-400/6"></div>

                  {/* Flowing animated gradient */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 30% 20%, rgba(100, 100, 100, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(120, 120, 120, 0.12) 0%, transparent 50%)",
                      backgroundSize: "200% 200%",
                      animation: "gradient 20s ease infinite",
                    }}
                  ></div>

                  {/* Reflective highlights - multiple angles */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
                  <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/60 to-transparent"></div>
                  <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>

                  {/* Inner glow effect - muted */}
                  <div className="absolute inset-[1px] rounded-xl bg-gradient-to-br from-gray-300/8 via-transparent to-transparent pointer-events-none"></div>

                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.2)] pointer-events-none"></div>
                  <div className="space-y-3 relative z-10">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="relative flex flex-row gap-2 pb-3 border-b border-white/20 last:border-0"
                      >
                        {/* Left Column - Image */}
                        <div className="flex-shrink-0 overflow-visible">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full object-contain rounded-lg"
                            style={{ height: "120px", width: "100%" }}
                          />
                        </div>
                        {/* Right Column - Content */}
                        <div className="flex-1 flex flex-col gap-2 min-w-0 relative">
                          {/* X Button - Top Right */}
                          <div className="flex justify-end absolute top-0 right-0">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors flex-shrink-0"
                              aria-label="Remove item"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          {/* Description */}
                          <div className="w-full pt-6">
                            <h3 className="text-sm" style={{ color: "black" }}>
                              {item.title}
                            </h3>
                          </div>
                          {/* Price and Toggler */}
                          <div className="flex flex-col gap-2 mt-auto -mt-1">
                            <p
                              className="font-bold text-base"
                              style={{ color: "black" }}
                            >
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="quantity-toggle flex items-center justify-center w-5 h-5 rounded-full transition-all hover:scale-105"
                                style={{
                                  backgroundColor: "#f0f0f0",
                                  color: "rgb(80, 80, 80)",
                                  boxShadow:
                                    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                                  minWidth: "20px",
                                  minHeight: "20px",
                                  maxWidth: "20px",
                                  maxHeight: "20px",
                                }}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-2.5 w-2.5" />
                              </button>
                              <span
                                className="font-semibold min-w-[1.25rem] text-center text-base"
                                style={{
                                  color: "black",
                                }}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="quantity-toggle flex items-center justify-center w-5 h-5 rounded-full transition-all hover:scale-105"
                                style={{
                                  backgroundColor: "#f0f0f0",
                                  color: "rgb(80, 80, 80)",
                                  boxShadow:
                                    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                                  minWidth: "20px",
                                  minHeight: "20px",
                                  maxWidth: "20px",
                                  maxHeight: "20px",
                                }}
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-2.5 w-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Total & Checkout */}
            <div className="lg:col-span-1">
              <div className="relative rounded-xl backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] p-6 sticky top-4">
                {/* Clear Liquid Glass Background Blobs */}
                <div className="absolute inset-0 overflow-hidden rounded-xl -z-10">
                  <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/20 rounded-full blur-3xl opacity-40"></div>
                  <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-white/15 rounded-full blur-3xl opacity-35"></div>
                </div>

                {/* Fluid gradient overlays - muted colors */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gray-400/8 via-transparent to-gray-300/5"></div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tl from-transparent via-gray-500/6 to-gray-400/8"></div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gray-300/4 via-transparent to-gray-400/6"></div>

                {/* Flowing animated gradient */}
                <div
                  className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 30% 20%, rgba(100, 100, 100, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(120, 120, 120, 0.12) 0%, transparent 50%)",
                    backgroundSize: "200% 200%",
                    animation: "gradient 20s ease infinite",
                  }}
                ></div>

                {/* Reflective highlights - multiple angles */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"></div>
                <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/60 to-transparent"></div>
                <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>

                {/* Inner glow effect - muted */}
                <div className="absolute inset-[1px] rounded-xl bg-gradient-to-br from-gray-300/8 via-transparent to-transparent pointer-events-none"></div>

                {/* Subtle inner shadow for depth */}
                <div className="absolute inset-0 rounded-xl shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.2)] pointer-events-none"></div>
                <h2
                  className="mb-4 relative z-10"
                  style={{
                    letterSpacing: "normal",
                    color: "black",
                    fontSize: "16px",
                    fontWeight: "normal",
                  }}
                >
                  Order Total
                </h2>
                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex justify-between">
                    <span
                      style={{
                        color: "black",
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      Subtotal
                    </span>
                    <span
                      style={{
                        color: "black",
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      style={{
                        color: "black",
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      Shipping
                    </span>
                    <span
                      className="text-right"
                      style={{
                        color: "black",
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      Free
                    </span>
                  </div>
                  <div className="pt-3 flex justify-between">
                    <span
                      style={{
                        color: "black",
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        color: "black",
                        fontSize: "16px",
                        fontWeight: "normal",
                      }}
                    >
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    console.log("Button onClick fired");
                    handleCheckout(e);
                  }}
                  disabled={loading || items.length === 0}
                  className="w-full px-2 py-3 font-semibold rounded-md transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative z-20"
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: "16px",
                    backgroundColor: "#f0f0f0",
                    color: "rgb(80, 80, 80)",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                    position: "relative",
                    zIndex: 20,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Proceed to Payment
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/store")}
                  className="w-full mt-3 px-2 py-3 font-semibold rounded-md transition-all hover:scale-105 relative z-10"
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: "16px",
                    backgroundColor: "#f0f0f0",
                    color: "rgb(80, 80, 80)",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </motion.div>
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

export default Checkout;
