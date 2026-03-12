import React from "react";
import { hslStringToHex, fgForBg } from "../utils/themeUtils";

export interface ImagePaletteModalProps {
  imageUrlInput: string;
  setImageUrlInput: React.Dispatch<React.SetStateAction<string>>;
  imageUrlError: string;
  setImageUrlError: React.Dispatch<React.SetStateAction<string>>;
  imagePaletteStatus: "idle" | "extracting" | "done" | "error";
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImagePalette: (file: File) => void;
  handleImageUrlSubmit: () => void;
  onClose: () => void;
}

export function ImagePaletteModal({
  imageUrlInput,
  setImageUrlInput,
  imageUrlError,
  setImageUrlError,
  imagePaletteStatus,
  fileInputRef,
  handleImagePalette,
  handleImageUrlSubmit,
  onClose,
}: ImagePaletteModalProps) {
  const handleClose = () => {
    setImageUrlInput("");
    setImageUrlError("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleClose}
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      <div
        className="rounded-xl p-6 w-[380px] max-h-[90vh] overflow-y-auto shadow-xl"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[18px] font-light mb-4" style={{ color: "hsl(var(--foreground))" }}>
          Extract Palette from Image
        </h3>

        {/* Upload file / drag-and-drop */}
        <div className="mb-4">
          <p
            className="text-[13px] font-light mb-2"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Upload an image file
          </p>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.setAttribute("data-dragging", "true");
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.removeAttribute("data-dragging");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.removeAttribute("data-dragging");
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith("image/")) {
                handleImagePalette(file);
                onClose();
              }
            }}
            className="w-full py-6 text-[14px] font-light rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:opacity-80 cursor-pointer [&[data-dragging=true]]:border-solid [&[data-dragging=true]]:bg-gray-50"
            style={{
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            <svg
              className="w-8 h-8 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <span>Drag and drop an image here</span>
            <span className="text-[12px]">or click to choose a file</span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "hsl(var(--border))" }}
          />
          <span
            className="text-[12px] font-light"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            or
          </span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: "hsl(var(--border))" }}
          />
        </div>

        {/* Paste URL */}
        <div className="mb-4">
          <p
            className="text-[13px] font-light mb-2"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Paste an image URL
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              name="image-url"
              autoComplete="off"
              value={imageUrlInput}
              onChange={(e) => {
                setImageUrlInput(e.target.value);
                setImageUrlError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleImageUrlSubmit();
                  onClose();
                }
              }}
              placeholder="https://example.com/photo.jpg"
              className="flex-1 h-10 px-3 text-[14px] font-light rounded-lg border"
              style={{
                borderColor: imageUrlError ? "hsl(var(--destructive))" : "hsl(var(--border))",
                color: "hsl(var(--foreground))",
                backgroundColor: "hsl(var(--background))",
              }}
              autoFocus
            />
            <button
              onClick={() => {
                handleImageUrlSubmit();
                onClose();
              }}
              disabled={
                imagePaletteStatus === "extracting" || !imageUrlInput.trim()
              }
              className="h-10 px-4 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
              style={{
                backgroundColor: "hsl(var(--foreground))",
                color: "hsl(var(--background))",
              }}
            >
              Go
            </button>
          </div>
          {imageUrlError && (
            <p
              className="text-[12px] font-light mt-1"
              style={{ color: "hsl(var(--destructive))" }}
            >
              {imageUrlError}
            </p>
          )}
        </div>

        {/* Status */}
        {imagePaletteStatus === "extracting" && (
          <div
            className="flex items-center gap-2 text-[13px] font-light"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Extracting palette...</span>
          </div>
        )}

        {/* Close */}
        <div className="flex justify-end mt-2">
          <button
            onClick={handleClose}
            className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export interface PendingImagePaletteConfirmProps {
  pendingImagePalette: {
    imageUrl: string;
    palette: Record<string, string>;
  };
  colors: Record<string, string>;
  applyImagePalette: (palette: Record<string, string>) => void;
  setPendingImagePalette: React.Dispatch<React.SetStateAction<{
    imageUrl: string;
    palette: Record<string, string>;
  } | null>>;
  setAppliedImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setAppliedImageFading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PendingImagePaletteConfirm({
  pendingImagePalette,
  colors,
  applyImagePalette,
  setPendingImagePalette,
  setAppliedImageUrl,
  setAppliedImageFading,
}: PendingImagePaletteConfirmProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={() => {
        URL.revokeObjectURL(pendingImagePalette.imageUrl);
        setPendingImagePalette(null);
      }}
    >
      <div
        className="rounded-xl p-6 w-[90vw] max-w-[480px] max-h-[90vh] overflow-y-auto shadow-xl"
        style={{
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[18px] font-light mb-4">Extracted Palette</h3>
        <img
          src={pendingImagePalette.imageUrl}
          alt="Uploaded"
          className="w-full rounded-lg mb-4 object-cover"
          style={{ maxHeight: 200 }}
        />
        <div className="grid grid-cols-5 gap-3 mb-4">
          {(
            [
              "--brand",
              "--secondary",
              "--accent",
              "--background",
              "--foreground",
            ] as const
          ).map((key) => {
            const hsl = pendingImagePalette.palette[key];
            if (!hsl) return null;
            const hex = hslStringToHex(hsl);
            return (
              <div key={key} className="min-w-0 text-center">
                <div
                  className="w-full aspect-square rounded-md mb-1"
                  style={{
                    backgroundColor: `hsl(${hsl})`,
                    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
                  }}
                />
                <span
                  className="ds-palette-label font-light block truncate"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {key
                    .replace("--", "")
                    .split("-")
                    .map((w) => w[0].toUpperCase() + w.slice(1))
                    .join(" ")}
                </span>
                <span
                  className="ds-palette-label font-mono block truncate"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {hex}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              URL.revokeObjectURL(pendingImagePalette.imageUrl);
              setPendingImagePalette(null);
            }}
            className="px-3 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
            style={{ color: "hsl(var(--card-foreground))" }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              applyImagePalette(pendingImagePalette.palette);
              const imgUrl = pendingImagePalette.imageUrl;
              setPendingImagePalette(null);
              setAppliedImageUrl(imgUrl);
              setAppliedImageFading(false);
              // Start fade-out after 2s, then remove after transition (1s)
              setTimeout(() => setAppliedImageFading(true), 2000);
              setTimeout(() => {
                setAppliedImageUrl((cur) => {
                  if (cur === imgUrl) URL.revokeObjectURL(imgUrl);
                  return cur === imgUrl ? null : cur;
                });
                setAppliedImageFading(false);
              }, 3000);
            }}
            className="px-4 py-1.5 text-[14px] font-light rounded-lg transition-colors hover:opacity-80"
            style={{
              backgroundColor: "hsl(var(--brand))",
              color: colors["--brand"]
                ? `hsl(${fgForBg(colors["--brand"])})`
                : "hsl(var(--primary-foreground))",
            }}
          >
            Apply Palette
          </button>
        </div>
      </div>
    </div>
  );
}
