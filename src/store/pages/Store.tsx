import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { storeProducts } from "../data/storeProducts";
import { toast } from "@/hooks/use-toast";
import { Product } from "../types";
import { ImageModal } from "../components/ImageModal";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";

// Product Image Row Component
const ProductImageRow = ({
  product,
  onImageClick,
  onImageModalClick,
}: {
  product: Product;
  onImageClick: () => void;
  onImageModalClick?: (images: string[], currentIndex: number) => void;
}) => {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onImageModalClick) {
      onImageModalClick(images, currentImageIndex);
    } else {
      onImageClick();
    }
  };

  return (
    <div
      onClick={handleImageClick}
      className="relative overflow-hidden bg-transparent cursor-pointer rounded-t-lg group p-1.5 pb-0"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-transparent max-h-[300px] mx-auto">
        {/* Images */}
        <div className="relative w-full h-full flex items-center justify-center">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.title} - Image ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 max-h-full ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 text-gray-900" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4 text-gray-900" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/50"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Store = () => {
  const { activeCategory } = useStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();
  const [modalImage, setModalImage] = useState<{
    images: string[];
    currentIndex: number;
    productTitle: string;
  } | null>(null);

  // Legal modal management
  const legalModal = searchParams.get("legal");
  const openLegalModal = (type: "privacy" | "terms") => {
    setSearchParams({ legal: type });
  };
  const closeLegalModal = () => {
    searchParams.delete("legal");
    setSearchParams(searchParams);
  };

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

  // const mainCategories = [
  //   {
  //     id: "art",
  //     title: "Art",
  //     icon: Palette,
  //     color: "orange",
  //   },
  //   {
  //     id: "music",
  //     title: "Music",
  //     icon: Music,
  //     color: "purple",
  //   },
  //   {
  //     id: "sports",
  //     title: "Sports",
  //     icon: Activity,
  //     color: "emerald",
  //   },
  // ];

  const products = storeProducts;

  const filteredProducts = activeCategory
    ? products.filter((product) => product.mainCategory === activeCategory)
    : products;

  // Style Stripe buy buttons to match Add to Cart button
  useEffect(() => {
    const styleStripeButtons = () => {
      const stripeButtons = document.querySelectorAll("stripe-buy-button");
      stripeButtons.forEach((button) => {
        const shadowRoot = button.shadowRoot;
        if (shadowRoot) {
          // Remove existing style if present
          const existingStyle = shadowRoot.querySelector(
            "style[data-stripe-button-style]"
          );
          if (existingStyle) {
            existingStyle.remove();
          }
        }
      });
    };

    // Try to style immediately
    styleStripeButtons();

    // Also try after delays in case buttons load asynchronously
    const timeoutId = setTimeout(styleStripeButtons, 500);
    const timeoutId2 = setTimeout(styleStripeButtons, 1000);
    const timeoutId3 = setTimeout(styleStripeButtons, 2000);

    // Use MutationObserver to watch for new buttons being added
    const observer = new MutationObserver(() => {
      styleStripeButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      observer.disconnect();
    };
  }, [filteredProducts]);

  return (
    <div className="min-h-screen text-gray-900 dark:text-white store-page pb-16 relative bg-[#f0f0f0]">
      {/* Top Header with DM, Nav, Cart, and Profile */}
      <StoreHeader sticky={true} />

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
              <div className="flex justify-center">
                {filteredProducts.map((product) => {
                  return (
                    <motion.div
                      key={product.id}
                      variants={fadeInUp}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="group relative overflow-hidden rounded-lg flex flex-col cursor-pointer w-full max-w-[520px]"
                      onClick={() => navigate(`/store/product/${product.id}`)}
                    >
                      {/* Clear Liquid Glass Background Blobs */}
                      <div className="absolute inset-0 overflow-hidden rounded-lg">
                        {/* Clear glass blobs for liquid effect */}
                        <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/20 rounded-full blur-3xl opacity-40"></div>
                        <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-white/15 rounded-full blur-3xl opacity-35"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/10 rounded-full blur-3xl opacity-30"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/18 rounded-full blur-3xl opacity-32"></div>
                      </div>

                      {/* Clear Liquid Glass Card */}
                      <div className="relative rounded-lg backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] overflow-hidden flex flex-col">
                        {/* Fluid gradient overlays - muted colors */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-gray-400/8 via-transparent to-gray-300/5"></div>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-tl from-transparent via-gray-500/6 to-gray-400/8"></div>
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-300/4 via-transparent to-gray-400/6"></div>

                        {/* Flowing animated gradient */}
                        <div className="absolute inset-0 rounded-lg opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_30%_20%,rgba(100,100,100,0.15)_0%,transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(120,120,120,0.12)_0%,transparent_50%)] bg-[length:200%_200%] animate-[gradient_20s_ease_infinite]"></div>

                        {/* Reflective highlights - multiple angles */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                        <div className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>

                        {/* Inner glow effect - muted */}
                        <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-gray-300/8 via-transparent to-transparent pointer-events-none"></div>

                        {/* Subtle inner shadow for depth */}
                        <div className="absolute inset-0 rounded-lg shadow-[inset_0_1px_2px_0_rgba(255,255,255,0.2)] pointer-events-none"></div>

                        {/* Content */}
                        <div className="relative z-10 flex flex-col">
                          {/* Product Image Row - Clickable */}
                          <ProductImageRow
                            product={product}
                            onImageClick={() =>
                              navigate(`/store/product/${product.id}`)
                            }
                            onImageModalClick={(images, currentIndex) => {
                              setModalImage({
                                images,
                                currentIndex,
                                productTitle: product.title,
                              });
                            }}
                          />

                          {/* Product Info */}
                          <div className="store-card-content flex flex-col flex-grow font-['Geist_Mono',monospace] p-2 text-center">
                            <h3 className="mb-1 line-clamp-1 cursor-pointer hover:underline store-card-text store-card-h3 font-['Geist_Mono',monospace] text-xl text-black font-normal">
                              {product.title}
                            </h3>
                            <p className="mb-2 line-clamp-2 store-card-text font-['Geist_Mono',monospace] text-[11px] text-black">
                              {product.description}
                            </p>
                            <div className="mb-2">
                              <span className="font-bold store-card-text font-['Geist_Mono',monospace] text-lg text-black">
                                ${product.price}
                              </span>
                            </div>
                            <div
                              className="mt-auto mb-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex gap-1.5">
                                {/* Buy Button - Hidden
                                <div
                                  className="flex-1 stripe-buy-button-wrapper"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <stripe-buy-button
                                    buy-button-id={STRIPE_BUY_BUTTON_ID}
                                    publishable-key={STRIPE_PUBLISHABLE_KEY}
                                  />
                                </div>
                                */}
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
                                      duration: 5000,
                                      variant: "default",
                                    });
                                  }}
                                  className="flex-1 px-2 font-semibold rounded-md transition-all hover:scale-105 store-card-button font-['Geist_Mono',monospace] text-base bg-[#f0f0f0] text-[rgb(80,80,80)] h-[45px] shadow-[rgba(255,255,255,0.9)_-1px_-1px_1px,rgba(0,0,0,0.2)_1px_1px_2px,rgba(255,255,255,0.5)_0px_0px_1px]"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
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

      {/* Image Modal */}
      {modalImage && (
        <ImageModal
          images={modalImage.images}
          currentIndex={modalImage.currentIndex}
          isOpen={!!modalImage}
          onClose={() => setModalImage(null)}
          productTitle={modalImage.productTitle}
        />
      )}

      {/* Legal Modals */}
      <LegalModal
        isOpen={legalModal === "privacy"}
        onClose={closeLegalModal}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </LegalModal>

      <LegalModal
        isOpen={legalModal === "terms"}
        onClose={closeLegalModal}
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </LegalModal>

      {/* Sticky Footer with BALM */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[rgba(240,240,240,1)] py-0.5">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <span className="font-bold tracking-tight balm-logo text-[#d0d0d0] text-2xl [text-shadow:rgba(255,255,255,0.9)_-1px_-1px_1px,rgba(0,0,0,0.2)_1px_1px_2px,rgba(255,255,255,0.5)_0px_0px_1px]">
              BALM
            </span>
            <div className="flex">
              <button
                onClick={() => openLegalModal("privacy")}
                className="flex text-xs text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => openLegalModal("terms")}
                className="flex text-xs text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Store;
