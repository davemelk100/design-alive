// Store Types - Centralized type definitions for the store module

export interface Product {
  id: string;
  mainCategory: "art" | "music" | "sports";
  title: string;
  price: number;
  image: string;
  images?: string[]; // Optional array for multiple images
  description: string;
  fullDescription?: string;
  details?: string;
  sizeChart?: {
    sizes: string[];
    measurements: {
      [key: string]: {
        bodyLength: string;
        chestWidth: string;
        sleeveLength: string;
      };
    };
  };
  sizes?: string[];
  colors?: string[];
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}
