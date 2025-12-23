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
  // {
  //   id: "art-tshirt-1",
  //   mainCategory: "art",
  //   title: "BALM Chest Print Button-Up Scrawl",
  //   price: 22.0,
  //   image: "/img/balm-scrawls.png",
  //   images: [
  //     "/img/balm-scrawls.png",
  //     "/img/standing.png",
  //     "/img/balm-scrawl-band.png",
  //     "/img/balm-scrawl-hoodie.png",
  //   ],
  //   description: "",
  //   fullDescription:
  //     "Materials: 100% cotton. Fit: Regular fit. Care: Machine wash cold, tumble dry low. Do not bleach.",
  //   sizes: ["L", "XL"],
  //   colors: ["Black", "White", "Navy"],
  // },
  {
    id: "art-tshirt-5",
    mainCategory: "art",
    title: "BALM Chest Print Button-Up Cursive",
    price: 22.0,
    image: "/img/balm-cursive.png",
    images: [
      "/img/balm-cursive.png",
      "/img/balm-cluh-hooded-dude.png",
      "/img/balm-cursive-skate.png",
      "/img/balm-cursive-club.png",
    ],
    description: "",
    fullDescription:
      "Materials: 100% cotton. Fit: Regular fit. Care: Machine wash cold, tumble dry low. Do not bleach.",
    sizes: ["L", "XL"],
    colors: ["Black", "White", "Navy"],
  },
];
