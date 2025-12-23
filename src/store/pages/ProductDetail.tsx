import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { storeProducts } from "../data/storeProducts";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../../components/ui/avatar";

// Stripe Buy Button configuration
const STRIPE_BUY_BUTTON_ID = "buy_btn_1ShP2DFCguwn0NjejNHb8fAK";
const STRIPE_PUBLISHABLE_KEY =
  "pk_live_51SfaUkFCguwn0Nje4OfQoB4yszo0dtOGxvcP3hCx2u8J6BBerqV3wNPTOM42iwsRPbz8o4cupfasTKY8BvYwbtIK004G7arYYe";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, getTotalItems } = useCart();

  const product = storeProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div
        className="min-h-screen text-white store-page flex items-center justify-center"
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
        `}</style>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">
            Product Not Found
          </h1>
          <button
            onClick={() => navigate("/store")}
            className="text-white hover:text-white/80"
          >
            Back to Store
          </button>
        </div>

        {/* Bottom Header - Replica of Top Header without Cart and Avatar */}
        <section
          className="py-1 absolute bottom-0 left-0 right-0"
          style={{ backgroundColor: "#f0f0f0" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between"
            >
              {/* MELKONIAN INDUSTRIES - Left Side */}
              <div className="flex items-center gap-3">
                <span
                  className="font-bold tracking-tight"
                  style={{
                    color: "#f0f0f0",
                    fontSize: "48px",
                    textShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  }}
                >
                  MELKONIAN INDUSTRIES
                </span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes?.[0] || null
  );

  // Carousel state
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/store")}
          className="px-2 py-3 font-semibold rounded-md transition-all hover:scale-105 mb-8 flex items-center gap-2"
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
          <ArrowLeft className="h-5 w-5" />
          Back to Store
        </button>

        {/* Product layout: two columns on tablet and desktop, single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square overflow-hidden rounded-xl bg-transparent relative group">
              {/* Images */}
              <div className="relative w-full h-full">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-900 dark:text-white" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-900 dark:text-white" />
                  </button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "w-8 bg-white dark:bg-gray-200"
                            : "w-2 bg-white/50 dark:bg-gray-200/50"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 relative"
          >
            {/* Clear Liquid Glass Background Blobs */}
            <div className="absolute inset-0 overflow-hidden rounded-lg -z-10">
              <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/20 rounded-full blur-3xl opacity-40"></div>
              <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-white/15 rounded-full blur-3xl opacity-35"></div>
            </div>

            {/* Clear Liquid Glass Card */}
            <div
              className="relative rounded-lg backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]"
              style={{ padding: "10px" }}
            >
              {/* Fluid gradient overlays - muted colors */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-400/8 via-transparent to-gray-300/5"></div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-tl from-transparent via-gray-500/6 to-gray-400/8"></div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-300/4 via-transparent to-gray-400/6"></div>

              {/* Flowing animated gradient */}
              <div
                className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
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
              <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-gray-300/8 via-transparent to-transparent pointer-events-none"></div>

              {/* Subtle inner shadow for depth */}
              <div className="absolute inset-0 rounded-lg shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.2)] pointer-events-none"></div>

              <div className="relative z-10 space-y-6">
                <div>
                  <h1
                    className="font-bold mb-4"
                    style={{
                      fontFamily:
                        '"Helvetica", "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                      fontSize: "14px",
                      color: "black",
                    }}
                  >
                    {product.title}
                  </h1>
                  <p
                    className="font-bold mb-6"
                    style={{
                      fontFamily:
                        '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                      fontSize: "14px",
                      color: "black",
                    }}
                  >
                    ${product.price}
                  </p>
                </div>

                <div>
                  <p
                    className="leading-relaxed"
                    style={{
                      fontFamily:
                        '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                      fontSize: "14px",
                      color: "black",
                    }}
                  >
                    {product.fullDescription || product.description}
                  </p>
                </div>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 1 && (
                  <div>
                    <label
                      className="block font-semibold mb-3"
                      style={{
                        fontFamily:
                          '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                        fontSize: "14px",
                        color: "black",
                      }}
                    >
                      Size
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size: string) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-6 py-3 font-semibold rounded-md transition-all hover:scale-105 ${
                            selectedSize === size ? "" : ""
                          }`}
                          style={{
                            fontFamily:
                              '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                            fontSize: "14px",
                            backgroundColor:
                              selectedSize === size ? "#f0f0f0" : "#f0f0f0",
                            color: "rgb(80, 80, 80)",
                            boxShadow:
                              "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                            opacity: selectedSize === size ? 1 : 0.7,
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buy Now and Add to Cart Buttons */}
                <div className="flex gap-2">
                  <div className="flex-1">
                    {/* @ts-ignore - Stripe Buy Button web component */}
                    <stripe-buy-button
                      buy-button-id={STRIPE_BUY_BUTTON_ID}
                      publishable-key={STRIPE_PUBLISHABLE_KEY}
                    />
                  </div>
                  <button
                    onClick={() => {
                      addItem({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        description: product.description,
                      });
                      toast({
                        title: "Added to cart",
                        description: product.title,
                        duration: 3000,
                      });
                    }}
                    className="flex-1 px-2 py-3 font-semibold rounded-md transition-all hover:scale-105"
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
                    Add to Cart
                  </button>
                </div>

                {/* Product Details */}
                <div className="pt-6 border-t border-white/20">
                  <h3
                    className="font-semibold mb-3"
                    style={{
                      fontFamily:
                        '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                      fontSize: "14px",
                      color: "black",
                    }}
                  >
                    Product Details
                  </h3>
                  <ul
                    className="space-y-2"
                    style={{
                      fontFamily:
                        '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                      fontSize: "14px",
                      color: "black",
                    }}
                  >
                    <li>• Premium quality materials</li>
                    <li>• Comfortable fit</li>
                    <li>• Machine washable</li>
                    <li>• Fast shipping available</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
