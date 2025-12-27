import { Product } from "../types";

export const storeProducts: Product[] = [
  // {
  //   id: "balm-shirt-1",
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
    id: "balm-shirt-2",
    mainCategory: "art",
    title: "BALM Chest Print Button-Up Cursive",
    price: 25.0,
    image: "/img/balm-cursive.png",
    images: [
      "/img/balm-cursive.png",
      "/img/balm-cluh-hooded-dude.png",
      "/img/balm-cursive-loadout.png",
      "/img/balm-cursive-sidestage.png",
      "/img/balm-cursive-stark.jpg",
    ],
    description: "",
    details: `2.9 oz./yd² (US), 4.8 oz./L yd (CA), 100% polyester
Mechanical stretch two-tone mélange fabric
Moisture-wicking performance
Hidden button-down collar
Double-needle flat-felled side and underarm seams
Tailored adjustable cuffs with buttoned sleeve plackets
Back yoke with side pleats`,
    sizeChart: {
      sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
      measurements: {
        S: {
          bodyLength: "27 1/2",
          chestWidth: "21 1/2",
          sleeveLength: "34",
        },
        M: {
          bodyLength: "28 1/2",
          chestWidth: "23",
          sleeveLength: "35",
        },
        L: {
          bodyLength: "29 1/2",
          chestWidth: "24 1/2",
          sleeveLength: "36",
        },
        XL: {
          bodyLength: "30 1/2",
          chestWidth: "26",
          sleeveLength: "37",
        },
        "2XL": {
          bodyLength: "31",
          chestWidth: "27 1/2",
          sleeveLength: "38",
        },
        "3XL": {
          bodyLength: "31 1/2",
          chestWidth: "29",
          sleeveLength: "38 3/4",
        },
      },
    },
    sizes: ["L", "XL"],
    colors: ["Black", "White", "Navy"],
  },
];
