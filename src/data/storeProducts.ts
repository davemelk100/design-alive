export interface Product {
  id: string;
  mainCategory: "art" | "music" | "sports";
  title: string;
  price: number;
  image: string;
  images?: string[]; // Optional array for multiple images
  description: string;
  fullDescription?: string;
  sizes?: string[];
  colors?: string[];
}

export const storeProducts: Product[] = [
  {
    id: "art-tshirt-1",
    mainCategory: "art",
    title: "BALM Chest Print Button-Up",
    price: 22.0,
    image: "/img/grey-on-grey.png",
    images: [
      "/img/grey-on-grey.png",
      "/img/standing.png",
      "/img/skater-40.png",
    ],
    description: "",
    fullDescription:
      "Materials: 100% cotton. Fit: Regular fit. Care: Machine wash cold, tumble dry low. Do not bleach.",
    sizes: ["L", "XL"],
    colors: ["Black", "White", "Navy"],
  },
  {
    id: "art-tshirt-2",
    mainCategory: "art",
    title: "BALM Jays Shirt",
    price: 22.0,
    image: "/img/balm-jays.png",
    images: ["/img/balm-jays.png"],
    description: "",
    fullDescription:
      "Materials: 100% cotton. Fit: Regular fit. Care: Machine wash cold, tumble dry low. Do not bleach.",
    sizes: ["L", "XL"],
    colors: ["Black", "White", "Navy"],
  },
  {
    id: "art-tshirt-3",
    mainCategory: "art",
    title: "BALM Chicago Shirt",
    price: 22.0,
    image: "/img/chicago.png",
    images: ["/img/chicago.png"],
    description: "",
    fullDescription:
      "Materials: 100% cotton. Fit: Regular fit. Care: Machine wash cold, tumble dry low. Do not bleach.",
    sizes: ["L", "XL"],
    colors: ["Black", "White", "Navy"],
  },
  {
    id: "art-tshirt-4",
    mainCategory: "art",
    title: "BALM Detroit Shirt",
    price: 22.0,
    image: "/img/detroit.png",
    images: ["/img/detroit.png"],
    description: "",
    fullDescription:
      "Materials: 100% cotton. Fit: Regular fit. Care: Machine wash cold, tumble dry low. Do not bleach.",
    sizes: ["L", "XL"],
    colors: ["Black", "White", "Navy"],
  },
  {
    id: "art-tshirt-5",
    mainCategory: "art",
    title: "BALM Cursive Shirt",
    price: 22.0,
    image: "/img/balm-cursive.png",
    images: ["/img/balm-cursive.png"],
    description: "",
    fullDescription:
      "Materials: 100% cotton. Fit: Regular fit. Care: Machine wash cold, tumble dry low. Do not bleach.",
    sizes: ["L", "XL"],
    colors: ["Black", "White", "Navy"],
  },
  {
    id: "art-tshirt-6",
    mainCategory: "art",
    title: "BALM Skin Graft Shirt",
    price: 22.0,
    image: "/img/skin-graft.png",
    images: ["/img/skin-graft.png", "/img/skin-graft-guy.png"],
    description: "",
    fullDescription:
      "Materials: 100% cotton. Fit: Regular fit. Care: Machine wash cold, tumble dry low. Do not bleach.",
    sizes: ["L", "XL"],
    colors: ["Black", "White", "Navy"],
  },
];
