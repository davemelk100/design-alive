import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    // Modal mounted
    return () => {
      // Modal unmounted
    };
  }, []);

  // Add escape key functionality
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <>
      {/* Close button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 hover:bg-white text-black shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 fixed top-8 right-8 z-[9999]"
        aria-label="Close modal"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <div className="fixed inset-0 z-[9000]">
        {/* Scrim overlay */}
        <div
          className="fixed inset-0 bg-black/85 cursor-pointer"
          onClick={onClose}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.85)",
          }}
        />

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="relative max-h-[90vh] max-w-[90vw] bg-gray-100 rounded-lg shadow-2xl">
            <div className="p-8">
              <div className="relative h-full w-full">
                <img
                  src={imageUrl}
                  alt="Full size"
                  className="max-h-[80vh] max-w-[80vw] object-contain"
                  style={{
                    maxHeight: "80vh",
                    maxWidth: "80vw",
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageModal;
