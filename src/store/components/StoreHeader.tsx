import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
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

interface StoreHeaderProps {
  /**
   * If true, the header is sticky at the top
   */
  sticky?: boolean;
  /**
   * If true, hides the cart icon (useful for checkout pages)
   */
  hideCart?: boolean;
  /**
   * If true, shows a minimal header with just the logo
   */
  minimal?: boolean;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({
  sticky = true,
  hideCart = false,
  minimal = false,
}) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/store/login");
  };

  return (
    <section
      className={`${sticky ? "sticky top-0 z-50" : ""} py-[19px]`}
      style={{ backgroundColor: "rgba(240, 240, 240, 0.75)" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center relative"
          style={{ minHeight: "100px" }}
        >
          {/* Balm Varsity Logo - Left Side */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2">
            <Link to="/store" className="hover:opacity-80 transition-opacity">
              <img
                src="/img/balm-varsity.svg"
                alt="BALM Varsity"
                className="h-[100px] w-auto"
              />
            </Link>
          </div>

          {/* Cart and Profile - Right Side (unless minimal) */}
          {!minimal && (
            <div className="flex items-center gap-4 absolute right-0">
              {/* Cart Icon */}
              {!hideCart && (
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
              )}

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
                      {user?.image ? (
                        <img
                          src={user.image}
                          alt={user.name || user.email}
                          className="h-full w-full rounded-full"
                        />
                      ) : (
                        <AvatarFallback
                          style={{
                            backgroundColor: "#f0f0f0",
                            boxShadow:
                              "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                          }}
                        >
                          {user?.name ? (
                            user.name.charAt(0).toUpperCase()
                          ) : (
                            <User
                              className="h-5 w-5"
                              style={{ color: "rgb(168, 168, 168)" }}
                            />
                          )}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {isAuthenticated && user ? (
                      <div>
                        <p className="font-medium">{user.name || "User"}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    ) : (
                      "My Account"
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAuthenticated ? (
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign Out
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/store/login")}>
                        Sign In
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/store/signup")}>
                        Sign Up
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default StoreHeader;

