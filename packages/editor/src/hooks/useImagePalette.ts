import { useState, useRef } from "react";
import {
  extractPaletteFromImage,
  extractPaletteFromUrl,
} from "../utils/extractPalette";

export function useImagePalette() {
  const [showImagePaletteModal, setShowImagePaletteModal] = useState(false);
  const [imagePaletteStatus, setImagePaletteStatus] = useState<
    "idle" | "extracting" | "done" | "error"
  >("idle");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUrlError, setImageUrlError] = useState("");
  const [pendingImagePalette, setPendingImagePalette] = useState<{
    imageUrl: string;
    palette: Record<string, string>;
  } | null>(null);
  const [appliedImageUrl, setAppliedImageUrl] = useState<string | null>(null);
  const [appliedImageFading, setAppliedImageFading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImagePalette = async (file: File) => {
    try {
      setImagePaletteStatus("extracting");
      const palette = await extractPaletteFromImage(file);
      const imageUrl = URL.createObjectURL(file);
      setPendingImagePalette({ imageUrl, palette });
      setImagePaletteStatus("idle");
    } catch (err) {
      console.error("Image palette extraction failed:", err);
      setImagePaletteStatus("error");
      setTimeout(() => setImagePaletteStatus("idle"), 3000);
    }
  };

  const handleImageUrlSubmit = async () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setImageUrlError("Please enter a valid URL");
      return;
    }
    setImageUrlError("");
    try {
      setImagePaletteStatus("extracting");
      const palette = await extractPaletteFromUrl(url);
      setPendingImagePalette({ imageUrl: url, palette });
      setImagePaletteStatus("idle");
      setImageUrlInput("");
    } catch (err) {
      console.error("Image URL palette extraction failed:", err);
      setImageUrlError(
        "Failed to load image. The server may block cross-origin requests.",
      );
      setImagePaletteStatus("error");
      setTimeout(() => setImagePaletteStatus("idle"), 3000);
    }
  };

  const markApplied = () => {
    setImagePaletteStatus("done");
    setTimeout(() => setImagePaletteStatus("idle"), 3000);
  };

  return {
    showImagePaletteModal,
    setShowImagePaletteModal,
    imagePaletteStatus,
    setImagePaletteStatus,
    imageUrlInput,
    setImageUrlInput,
    imageUrlError,
    setImageUrlError,
    pendingImagePalette,
    setPendingImagePalette,
    appliedImageUrl,
    setAppliedImageUrl,
    appliedImageFading,
    setAppliedImageFading,
    fileInputRef,
    handleImagePalette,
    handleImageUrlSubmit,
    markApplied,
  };
}
