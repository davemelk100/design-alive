// Store Module - Main export file
// This module can be easily extracted into its own repository

// Types
export * from "./types";

// Contexts
export { CartProvider, useCart } from "./context/CartContext";
export { StoreProvider, useStore } from "./context/StoreContext";
export { AuthProvider, useAuth } from "./context/AuthContext";

// Data
export { storeProducts } from "./data/storeProducts";

// Pages - Note: These are default exports, so they need to be imported differently in App.tsx
// For now, we'll keep the direct imports in App.tsx for lazy loading compatibility
