import { motion } from "framer-motion";
import { Music, Activity, Palette, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { storeProducts } from "../data/storeProducts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

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
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <User className="h-5 w-5" />
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
                    letterSpacing: "3px",
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
                      className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                    >
                      {/* Product Image - Clickable */}
                      <div
                        onClick={() => navigate(`/store/product/${product.id}`)}
                        className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700 cursor-pointer"
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>

                      {/* Product Info */}
                      <div
                        className="p-2 store-card-content"
                        style={{
                          fontFamily:
                            '"Helvetica", "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                        }}
                      >
                        <h3
                          onClick={() =>
                            navigate(`/store/product/${product.id}`)
                          }
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
                        <div className="flex items-center justify-between">
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
                            }}
                            className="px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white font-semibold rounded-md hover:bg-gray-800 dark:hover:bg-gray-600 hover:shadow-lg transition-all hover:scale-105 store-card-button"
                            style={{
                              fontFamily:
                                '"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Arial", sans-serif',
                              fontSize: "14px",
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
