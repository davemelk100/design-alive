import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Loader2, X, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, removeItem, getTotalItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/store");
    }
  }, [items, navigate]);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Prepare line items for Stripe
      const lineItems = items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

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
            successUrl: `${window.location.origin}/store/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/store/checkout`,
          }),
        }
      );

      // Check if response has content before parsing
      const text = await response.text();
      let data;

      if (!text) {
        console.error("Empty response from server. Status:", response.status);
        throw new Error(
          `Server returned empty response (${response.status}). Check Netlify function logs.`
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
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "An error occurred during checkout");
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
        background:
          "linear-gradient(135deg, #d0d0d0 0%, #e0e0e0 20%, #c8c8c8 40%, #e5e5e5 60%, #d5d5d5 80%, #dddddd 100%)",
        backgroundSize: "400% 400%",
        animation: "gradient 15s ease infinite",
      }}
    >
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 30px) scale(0.9); }
          66% { transform: translate(20px, -20px) scale(1.1); }
        }
      `}</style>

      {/* Animated Background Blobs for Glass Effect */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        {/* Large animated blobs - darker for visibility */}
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-gray-600/40 to-gray-500/30 rounded-full blur-3xl"
          style={{ animation: "float 20s ease-in-out infinite" }}
        ></div>
        <div
          className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-bl from-gray-700/35 to-gray-600/25 rounded-full blur-3xl"
          style={{ animation: "floatReverse 25s ease-in-out infinite" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-gray-500/30 to-gray-600/35 rounded-full blur-3xl"
          style={{ animation: "float 30s ease-in-out infinite" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-r from-gray-600/30 to-gray-700/25 rounded-full blur-3xl"
          style={{ animation: "floatReverse 22s ease-in-out infinite" }}
        ></div>
        {/* Medium blobs */}
        <div
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-gray-700/25 to-transparent rounded-full blur-2xl"
          style={{ animation: "float 18s ease-in-out infinite" }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/3 w-56 h-56 bg-gradient-to-tl from-gray-500/30 to-transparent rounded-full blur-2xl"
          style={{ animation: "floatReverse 24s ease-in-out infinite" }}
        ></div>
        {/* Additional smaller blobs for more depth */}
        <div
          className="absolute top-2/3 left-1/2 w-48 h-48 bg-gradient-to-r from-gray-600/20 to-gray-500/15 rounded-full blur-2xl"
          style={{ animation: "float 16s ease-in-out infinite" }}
        ></div>
        <div
          className="absolute bottom-1/3 right-1/2 w-52 h-52 bg-gradient-to-l from-gray-700/20 to-gray-600/15 rounded-full blur-2xl"
          style={{ animation: "floatReverse 19s ease-in-out infinite" }}
        ></div>
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.2) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>
      {/* Top Header with DM, Nav, Cart, and Profile */}
      <section className="py-1" style={{ backgroundColor: "#f0f0f0" }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            {/* MELKONIAN INDUSTRIES - Left Side */}
            <button
              onClick={() => navigate("/store")}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span
                className="font-bold tracking-tight md:hidden"
                style={{
                  color: "#f0f0f0",
                  fontSize: "48px",
                  textShadow:
                    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                }}
              >
                MI
              </span>
              <span
                className="font-bold tracking-tight hidden md:block"
                style={{
                  color: "#f0f0f0",
                  fontSize: "48px",
                  textShadow:
                    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                }}
              >
                MELKONIAN INDUSTRIES
              </span>
            </button>

            {/* Cart and Profile - Right Side */}
            <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <button
                onClick={() => navigate("/store/checkout")}
                className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors"
                style={{
                  backgroundColor: "#f0f0f0",
                  boxShadow:
                    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                }}
              >
                <ShoppingCart
                  className="h-5 w-5"
                  style={{ color: "rgb(168, 168, 168)" }}
                />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors"
                    style={{
                      backgroundColor: "#f0f0f0",
                      boxShadow:
                        "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                    }}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        style={{
                          backgroundColor: "#f0f0f0",
                          boxShadow:
                            "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                        }}
                      >
                        <User
                          className="h-5 w-5"
                          style={{ color: "rgb(168, 168, 168)" }}
                        />
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Orders</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2 text-white">
              Checkout
            </h1>
            <p className="text-white">
              Review your order and complete your purchase
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              <div
                className="relative rounded-xl backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]"
                style={{ padding: "10px" }}
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
                <h2
                  className="text-2xl font-bold mb-6 relative z-10"
                  style={{
                    letterSpacing: "-1.25px",
                    color: "#dbdbdb",
                  }}
                >
                  Order Summary
                </h2>
                <div className="space-y-4 relative z-10">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 pb-4 border-b border-white/20 last:border-0"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3
                          className="font-semibold text-lg"
                          style={{ color: "black" }}
                        >
                          {item.title}
                        </h3>
                        <p className="text-sm" style={{ color: "black" }}>
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <p
                          className="font-bold text-lg"
                          style={{ color: "black" }}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Total & Checkout */}
            <div className="lg:col-span-1">
              <div className="relative rounded-xl backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] p-6 sticky top-4">
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
                  className="text-xl font-bold mb-4 relative z-10"
                  style={{
                    letterSpacing: "-1.25px",
                    color: "#dbdbdb",
                  }}
                >
                  Order Total
                </h2>
                <div className="space-y-3 mb-6 relative z-10">
                  <div className="flex justify-between">
                    <span style={{ color: "black" }}>Subtotal</span>
                    <span className="font-semibold" style={{ color: "black" }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: "black" }}>Shipping</span>
                    <span className="font-semibold" style={{ color: "black" }}>
                      Calculated at checkout
                    </span>
                  </div>
                  <div className="border-t border-white/20 pt-3 flex justify-between text-lg">
                    <span className="font-bold" style={{ color: "black" }}>
                      Total
                    </span>
                    <span className="font-bold" style={{ color: "black" }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className="w-full px-2 py-3 font-semibold rounded-md transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    fontFamily:
                      '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                    fontSize: "14px",
                    backgroundColor: "#f0f0f0",
                    color: "rgb(80, 80, 80)",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
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
                    fontFamily:
                      '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                    fontSize: "14px",
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
    </div>
  );
};

export default Checkout;
