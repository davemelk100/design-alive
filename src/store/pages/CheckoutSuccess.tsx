import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingCart, User } from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart, getTotalItems } = useCart();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Clear cart on successful checkout
    clearCart();
  }, [clearCart]);

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
            {/* BALM - Left Side */}
            <button
              onClick={() => navigate("/store")}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span
                className="font-bold tracking-tight"
                style={{
                  color: "#d0d0d0",
                  fontSize: "48px",
                  textShadow:
                    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                }}
              >
                BALM
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

            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Thank You!
            </h1>
            <p className="text-lg text-white">
              Your order has been received and is being processed.
            </p>

            {sessionId && (
              <p className="text-sm text-white/80">Order ID: {sessionId}</p>
            )}

            <div className="pt-6">
              <button
                onClick={() => navigate("/store")}
                className="px-2 py-3 font-semibold rounded-md transition-all hover:scale-105"
                style={{
                  fontFamily:
                    '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                  fontSize: "20px",
                  backgroundColor: "#f0f0f0",
                  color: "rgb(80, 80, 80)",
                  boxShadow:
                    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                }}
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
