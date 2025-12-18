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
    price: 29.99,
    image: "/img/grey-on-grey.png",
    images: ["/img/grey-on-grey.png", "/img/skater-40.png"],
    description: "Bold abstract design on premium cotton",
    fullDescription:
      "Express your artistic side with this bold abstract design t-shirt. Made from premium 100% cotton, this comfortable tee features a unique abstract art pattern that stands out. Perfect for art lovers and creative individuals who want to make a statement.",
    sizes: ["L", "XL"],
    colors: ["Black", "White", "Navy"],
  },
  {
    id: "art-tshirt-2",
    mainCategory: "art",
    title: "BALM Chest Print Button-Up",
    price: 32.99,
    image: "/img/grey-on-grey.png",
    images: ["/img/grey-on-grey.png", "/img/skater-40.png"],
    description: "Modern geometric patterns",
    fullDescription:
      "Contemporary geometric patterns meet classic comfort in this stylish t-shirt. The intricate design features clean lines and bold shapes, perfect for those who appreciate modern aesthetics.",
    sizes: ["L", "XL"],
    colors: ["Black", "Gray", "White"],
  },
  {
    id: "art-hat-1",
    mainCategory: "art",
    title: "BALM - Trucker Hat",
    price: 24.99,
    image: "/img/hat-alone.webp",
    images: ["/img/hat-alone.webp", "/img/balm-curb.webp"],
    description: "BALM - Hat",
    fullDescription: "BALM Trucker Hat",
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Olive"],
  },
  {
    id: "art-hat-2",
    mainCategory: "art",
    title: "BALM - Trucker Hat",
    price: 19.99,
    image: "/img/hat-alone.webp",
    images: ["/img/hat-alone.webp", "/img/balm-curb.webp"],
    description: "BALM - Hat",
    fullDescription:
      "Stay warm and stylish with this comfortable studio beanie. Perfect for artists and creatives, featuring a soft, cozy fit that's ideal for long studio sessions.",
    sizes: ["One Size"],
    colors: ["Black", "Gray", "Navy"],
  },
  {
    id: "music-tshirt-1",
    mainCategory: "music",
    title: "BALM Chest Print Button-Up",
    price: 34.99,
    image: "/img/grey-on-grey.png",
    images: ["/img/grey-on-grey.png", "/img/skater-40.png"],
    description: "Classic rock design",
    fullDescription: "BALM Screenprinted Button-Up Shirts",
    sizes: ["L", "XL"],
    colors: ["Black", "White"],
  },
  {
    id: "music-tshirt-2",
    mainCategory: "music",
    title: "BALM Chest Print Button-Up",
    price: 31.99,
    image: "/img/grey-on-grey.png",
    images: ["/img/grey-on-grey.png", "/img/skater-40.png"],
    description: "Vintage vinyl inspired",
    fullDescription:
      "Pay homage to the vinyl era with this vintage-inspired t-shirt. The design features classic record imagery, perfect for vinyl collectors and music purists.",
    sizes: ["L", "XL"],
    colors: ["Black", "Navy"],
  },
  {
    id: "music-hat-1",
    mainCategory: "music",
    title: "BALM - Trucker Hat",
    price: 26.99,
    image: "/img/hat-alone.webp",
    images: ["/img/hat-alone.webp", "/img/balm-curb.webp"],
    description: "BALM - Hat",
    fullDescription:
      "Get ready for your next concert with this stylish cap. Designed with music lovers in mind, it features a comfortable fit and classic design that never goes out of style.",
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Red"],
  },
  {
    id: "music-hat-2",
    mainCategory: "music",
    title: "BALM - Trucker Hat",
    price: 22.99,
    image: "/img/hat-alone.webp",
    images: ["/img/hat-alone.webp", "/img/balm-curb.webp"],
    description: "BALM - Hat",
    fullDescription:
      "Stay warm and show your festival spirit with this music-themed beanie. Perfect for outdoor concerts and music festivals, featuring a cozy design that keeps you comfortable all day long.",
    sizes: ["One Size"],
    colors: ["Black", "Gray", "Navy"],
  },
  {
    id: "sports-tshirt-1",
    mainCategory: "sports",
    title: "BALM Chest Print Button-Up",
    price: 27.99,
    image: "/img/grey-on-grey.png",
    images: ["/img/grey-on-grey.png", "/img/skater-40.png"],
    description: "Show your team pride",
    fullDescription:
      "Support your team in style with this team spirit t-shirt. Made from breathable, moisture-wicking fabric, it's perfect for game day or everyday wear.",
    sizes: ["L", "XL"],
    colors: ["Navy", "Red", "White"],
  },
  {
    id: "sports-tshirt-2",
    mainCategory: "sports",
    title: "BALM Chest Print Button-Up",
    price: 35.99,
    image: "/img/grey-on-grey.png",
    images: ["/img/grey-on-grey.png", "/img/skater-40.png"],
    description: "Performance fabric design",
    fullDescription:
      "Elevate your athletic performance with this high-tech t-shirt. Featuring advanced moisture-wicking technology and a comfortable fit, it's designed for active lifestyles.",
    sizes: ["L", "XL"],
    colors: ["Black", "Gray", "Navy"],
  },
  {
    id: "sports-hat-1",
    mainCategory: "sports",
    title: "BALM - Trucker Hat",
    price: 28.99,
    image: "/img/hat-alone.webp",
    images: ["/img/hat-alone.webp", "/img/balm-curb.webp"],
    description: "BALM - Hat",
    fullDescription:
      "Celebrate championship victories with this premium cap. Featuring classic styling and high-quality construction, it's the perfect accessory for sports fans.",
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Red"],
  },
  {
    id: "sports-hat-2",
    mainCategory: "sports",
    title: "BALM - Trucker Hat",
    price: 25.99,
    image: "/img/hat-alone.webp",
    images: ["/img/hat-alone.webp", "/img/balm-curb.webp"],
    description: "BALM - Hat",
    fullDescription:
      "Built for durability and style, this training snapback is perfect for athletes and sports enthusiasts. The adjustable snapback closure ensures a perfect fit for everyone.",
    sizes: ["One Size"],
    colors: ["Black", "Navy", "Gray"],
  },
];
