import { motion } from "framer-motion";
import {
  Music,
  Activity,
  Palette,
  ShoppingCart,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Product } from "../data/storeProducts";

// Product Image Carousel Component
const ProductImageCarousel = ({
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
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (images.length === 1) {
    return (
      <div
        onClick={onImageClick}
        className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer"
      >
        <img
          src={images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    );
  }

  return (
    <div
      onClick={onImageClick}
      className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer group"
    >
      {/* Images */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${product.title} - Image ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
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
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4 text-gray-900 dark:text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4 text-gray-900 dark:text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-6 bg-white dark:bg-gray-200"
                    : "w-1.5 bg-white/50 dark:bg-gray-200/50"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
  );
};

const Store = () => {
  const { activeCategory, setActiveCategory } = useStore();
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

      {/* Store Content */}
      <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative z-10">
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
                    color: "#f0f0f0",
                    textShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  }}
                >
                  {activeCategory === null
                    ? "All Products"
                    : mainCategories.find((cat) => cat.id === activeCategory)
                        ?.title || "Products"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "item" : "items"}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map((product) => {
                  return (
                    <motion.div
                      key={product.id}
                      variants={fadeInUp}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all flex flex-col cursor-pointer"
                      onClick={() => navigate(`/store/product/${product.id}`)}
                    >
                      {/* Product Image Carousel - Clickable */}
                      <ProductImageCarousel
                        product={product}
                        onImageClick={() =>
                          navigate(`/store/product/${product.id}`)
                        }
                      />

                      {/* Product Info */}
                      <div
                        className="p-2 store-card-content flex flex-col flex-grow"
                        style={{
                          fontFamily:
                            '"Helvetica", "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                        }}
                      >
                        <h3
                          className="font-bold mb-1 text-gray-900 dark:text-white line-clamp-1 cursor-pointer hover:underline store-card-text store-card-h3"
                          style={{
                            fontFamily:
                              '"Helvetica", "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif !important',
                            fontSize: "14px",
                          }}
                        >
                          {product.title}
                        </h3>
                        <p
                          className="text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 store-card-text"
                          style={{
                            fontFamily:
                              '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                            fontSize: "14px",
                          }}
                        >
                          {product.description}
                        </p>
                        <div className="mb-2">
                          <span
                            className="font-bold text-gray-900 dark:text-white store-card-text"
                            style={{
                              fontFamily:
                                '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                              fontSize: "14px",
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
                                duration: 3000,
                              });
                            }}
                            className="w-full px-2 py-1 font-semibold rounded-md transition-all hover:scale-105 store-card-button"
                            style={{
                              fontFamily:
                                '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                              fontSize: "14px",
                              backgroundColor: "#f0f0f0",
                              color: "rgb(168, 168, 168)",
                              textShadow:
                                "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                              boxShadow:
                                "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                            }}
                          >
                            Add to Cart
                          </button>
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

      {/* Bottom Header - Replica of Top Header without Cart and Avatar */}
      <section
        className="py-1 md:pb-1 pb-20"
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
          </motion.div>
        </div>
      </section>

      {/* Footer Tray Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
              activeCategory === null
                ? "rounded-none text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800"
                : "rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }`}
          >
            <span className="text-xs font-medium uppercase">All</span>
          </button>
          {mainCategories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() =>
                  setActiveCategory(
                    activeCategory === category.id ? null : category.id
                  )
                }
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
                  isActive
                    ? "rounded-none text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800"
                    : "rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <IconComponent
                  className={`h-5 w-5 ${
                    isActive
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                />
                <span className="text-xs font-medium uppercase">
                  {category.title}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Store;
