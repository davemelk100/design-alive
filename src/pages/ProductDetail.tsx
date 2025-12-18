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
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem, getTotalItems } = useCart();

  const product = storeProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white store-page flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate("/store")}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
      className="min-h-screen text-gray-900 dark:text-white store-page pb-16"
      style={{ backgroundColor: "#f0f0f0" }}
    >
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
            <div className="flex items-center gap-3">
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
            </div>

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
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 relative group">
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

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                {product.title}
              </h1>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                ${product.price}
              </p>
            </div>

            <div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.fullDescription || product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 1 && (
              <div>
                <label className="block text-sm font-semibold mb-3">Size</label>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
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
              className="w-full bg-gray-900 dark:bg-gray-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>

            {/* Product Details */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3">Product Details</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Premium quality materials</li>
                <li>• Comfortable fit</li>
                <li>• Machine washable</li>
                <li>• Fast shipping available</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
