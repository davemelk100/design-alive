import { motion } from "framer-motion";
import { Music, Activity, Palette, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
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
import { Product } from "../types";

// Stripe Buy Button configuration
const STRIPE_BUY_BUTTON_ID = "buy_btn_1ShP2DFCguwn0NjejNHb8fAK";
const STRIPE_PUBLISHABLE_KEY =
  "pk_live_51SfaUkFCguwn0Nje4OfQoB4yszo0dtOGxvcP3hCx2u8J6BBerqV3wNPTOM42iwsRPbz8o4cupfasTKY8BvYwbtIK004G7arYYe";

// Product Image Row Component
const ProductImageRow = ({
  product,
  onImageClick,
}: {
  product: Product;
  onImageClick: () => void;
}) => {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <div
      onClick={onImageClick}
      className="relative overflow-hidden bg-transparent cursor-pointer rounded-t-lg"
      style={{ padding: "10px", paddingBottom: "0" }}
    >
      <div className="flex gap-2 rounded-lg overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-1 relative aspect-square overflow-hidden rounded-lg group"
          >
            <img
              src={image}
              alt={`${product.title} - Image ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Store = () => {
  const { activeCategory } = useStore();
  const navigate = useNavigate();
  const { addItem, getTotalItems } = useCart();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const mainCategories = [
    {
      id: "art",
      title: "Art",
      icon: Palette,
      color: "orange",
    },
    {
      id: "music",
      title: "Music",
      icon: Music,
      color: "purple",
    },
    {
      id: "sports",
      title: "Sports",
      icon: Activity,
      color: "emerald",
    },
  ];

  const products = storeProducts;

  const filteredProducts = activeCategory
    ? products.filter((product) => product.mainCategory === activeCategory)
    : products;

  return (
    <div
      className="min-h-screen text-gray-900 dark:text-white store-page pb-16 relative"
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
      <section
        className="sticky top-0 z-50 py-1"
        style={{ backgroundColor: "rgba(240, 240, 240, 0.75)" }}
      >
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

      {/* Store Content */}
      <section
        className="py-2 sm:py-3 lg:py-4 xl:py-6 relative"
        style={{ zIndex: 10, position: "relative" }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-12"
          >
            {/* Products Grid */}
            <motion.section variants={fadeInUp} className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-3xl font-bold"
                  style={{
                    color: "#dbdbdb",
                    letterSpacing: "-1.25px",
                  }}
                >
                  {activeCategory === null
                    ? "All Products"
                    : mainCategories.find((cat) => cat.id === activeCategory)
                        ?.title || "Products"}
                </h2>
                <p className="text-sm" style={{ color: "black" }}>
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="flex justify-center gap-4">
                {filteredProducts.map((product) => {
                  return (
                    <motion.div
                      key={product.id}
                      variants={fadeInUp}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group relative overflow-hidden rounded-lg flex flex-col cursor-pointer w-full"
                      onClick={() => navigate(`/store/product/${product.id}`)}
                    >
                      {/* Clear Liquid Glass Background Blobs */}
                      <div className="absolute inset-0 overflow-hidden rounded-lg">
                        {/* Clear glass blobs for liquid effect */}
                        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/20 rounded-full blur-3xl opacity-40"></div>
                        <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-white/15 rounded-full blur-3xl opacity-35"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/10 rounded-full blur-3xl opacity-30"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/18 rounded-full blur-3xl opacity-32"></div>
                      </div>

                      {/* Clear Liquid Glass Card */}
                      <div className="relative rounded-lg backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] overflow-hidden flex flex-col">
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

                        {/* Content */}
                        <div className="relative z-10 flex flex-col">
                          {/* Product Image Row - Clickable */}
                          <ProductImageRow
                            product={product}
                            onImageClick={() =>
                              navigate(`/store/product/${product.id}`)
                            }
                          />

                          {/* Product Info */}
                          <div
                            className="store-card-content flex flex-col flex-grow"
                            style={{
                              fontFamily:
                                '"Helvetica", "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                              padding: "10px",
                            }}
                          >
                            <h3
                              className="font-bold mb-1 line-clamp-1 cursor-pointer hover:underline store-card-text store-card-h3"
                              style={{
                                fontFamily:
                                  '"Helvetica", "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif !important',
                                fontSize: "14px",
                                color: "black",
                              }}
                            >
                              {product.title}
                            </h3>
                            <p
                              className="mb-2 line-clamp-2 store-card-text"
                              style={{
                                fontFamily:
                                  '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                                fontSize: "14px",
                                color: "black",
                              }}
                            >
                              {product.description}
                            </p>
                            <div className="mb-2">
                              <span
                                className="font-bold store-card-text"
                                style={{
                                  fontFamily:
                                    '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                                  fontSize: "14px",
                                  color: "black",
                                }}
                              >
                                ${product.price}
                              </span>
                            </div>
                            <div
                              className="mt-auto"
                              style={{ marginBottom: "10px" }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex gap-2">
                                <div
                                  className="flex-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {/* @ts-ignore - Stripe Buy Button web component */}
                                  <stripe-buy-button
                                    buy-button-id={STRIPE_BUY_BUTTON_ID}
                                    publishable-key={STRIPE_PUBLISHABLE_KEY}
                                  />
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
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
                                      duration: 5000,
                                      variant: "default",
                                    });
                                  }}
                                  className="flex-1 px-2 py-3 font-semibold rounded-md transition-all hover:scale-105 store-card-button"
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
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Store;
