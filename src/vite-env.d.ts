/// <reference types="vite/client" />

// Stripe Buy Button web component type declaration
declare namespace JSX {
  interface IntrinsicElements {
    "stripe-buy-button": {
      "buy-button-id": string;
      "publishable-key": string;
    };
  }
}