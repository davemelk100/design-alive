import React, { useRef } from "react";
import { hslStringToHex, hexToHslString, contrastRatio } from "../utils/themeUtils";
import { COLOR_SWATCHES } from "../sections/ColorsSection";

export interface MobileColorPickerProps {
  mobilePickerKey: string;
  mobilePickerHex: string;
  setMobilePickerKey: React.Dispatch<React.SetStateAction<string | null>>;
  setMobilePickerHex: React.Dispatch<React.SetStateAction<string>>;
  colors: Record<string, string>;
  handleColorChange: (key: string, hex: string) => void;
}

const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return { r, g, b };
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToHex = (h: number, s: number, l: number) => {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export function MobileColorPicker({
  mobilePickerKey,
  mobilePickerHex,
  setMobilePickerKey,
  setMobilePickerHex,
  colors,
  handleColorChange,
}: MobileColorPickerProps) {
  const spectrumRef = useRef<HTMLDivElement | null>(null);

  const { r, g, b } = hexToRgb(mobilePickerHex);
  const hslVals = rgbToHsl(r, g, b);
  const wc = contrastRatio("0 0% 100%", hexToHslString(mobilePickerHex));
  const bc = contrastRatio("0 0% 0%", hexToHslString(mobilePickerHex));
  const textColor = wc >= bc ? "#ffffff" : "#000000";

  // Build swatch preview data
  const previewColors = ["--brand", "--secondary", "--accent", "--background", "--foreground"].map(k => ({
    key: k,
    label: COLOR_SWATCHES.find(s => s.key === k)?.label || k,
    hsl: k === mobilePickerKey ? hexToHslString(mobilePickerHex) : colors[k],
    active: k === mobilePickerKey,
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col ds-bg"
    >
      {/* Swatch preview row */}
      <div className="flex gap-1.5 p-3" style={{ backgroundColor: "hsl(var(--foreground) / 0.04)" }}>
        {previewColors.map(pc => (
          <button
            key={pc.key}
            onClick={() => {
              setMobilePickerKey(pc.key);
              setMobilePickerHex(pc.hsl ? hslStringToHex(pc.hsl) : "#000000");
            }}
            className="flex-1 flex flex-col items-center gap-0.5"
          >
            <div
              className="w-full aspect-square rounded-lg transition-all"
              style={{
                backgroundColor: pc.hsl ? `hsl(${pc.hsl})` : "hsl(var(--muted))",
                boxShadow: pc.active ? "0 0 0 3px hsl(var(--primary))" : "0 1px 3px rgba(0,0,0,0.15)",
              }}
            />
            <span
              className="text-xs font-medium truncate w-full text-center"
              style={{ color: pc.active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
            >
              {pc.label}
            </span>
          </button>
        ))}
      </div>

      {/* Current color display */}
      <div
        className="mx-3 mt-3 rounded-xl h-24 flex items-center justify-center"
        style={{ backgroundColor: mobilePickerHex, color: textColor }}
      >
        <span className="text-lg font-mono font-medium">{mobilePickerHex.toUpperCase()}</span>
      </div>

      {/* Color Spectrum Picker */}
      <div className="flex-1 px-4 pt-4 space-y-4 overflow-y-auto">
        {/* 2D Saturation/Lightness area */}
        <div
          ref={spectrumRef}
          className="relative w-full rounded-xl overflow-hidden"
          style={{
            aspectRatio: "1",
            background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, hsl(${hslVals.h}, 100%, 50%))`,
            touchAction: "none",
            cursor: "crosshair",
          }}
          onPointerDown={(e) => {
            if (!spectrumRef.current) return;
            spectrumRef.current.setPointerCapture(e.pointerId);
            const rect = spectrumRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
            // Convert position to HSL via HSV: x = saturation(V), y inverted = value
            const v = 1 - y;
            const sl = v * x;
            const lightness = v - sl / 2;
            const saturation = lightness === 0 || lightness === 1 ? 0 : sl / Math.min(lightness, 1 - lightness);
            const hex = hslToHex(hslVals.h, Math.round(saturation * 100), Math.round(lightness * 100));
            setMobilePickerHex(hex);
            handleColorChange(mobilePickerKey, hex);
          }}
          onPointerMove={(e) => {
            if (!spectrumRef.current || !spectrumRef.current.hasPointerCapture(e.pointerId)) return;
            const rect = spectrumRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
            const v = 1 - y;
            const sl = v * x;
            const lightness = v - sl / 2;
            const saturation = lightness === 0 || lightness === 1 ? 0 : sl / Math.min(lightness, 1 - lightness);
            const hex = hslToHex(hslVals.h, Math.round(saturation * 100), Math.round(lightness * 100));
            setMobilePickerHex(hex);
            handleColorChange(mobilePickerKey, hex);
          }}
        >
          {/* Position indicator */}
          {(() => {
            // Convert HSL back to x,y position (reverse of HSV conversion)
            const s = hslVals.s / 100;
            const l = hslVals.l / 100;
            const v = l + s * Math.min(l, 1 - l);
            const sv = v === 0 ? 0 : 2 * (1 - l / v);
            const posX = sv;
            const posY = 1 - v;
            return (
              <div
                className="absolute pointer-events-none"
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border: "3px solid white",
                  boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.3)",
                  left: `calc(${posX * 100}% - 10px)`,
                  top: `calc(${posY * 100}% - 10px)`,
                  backgroundColor: mobilePickerHex,
                }}
              />
            );
          })()}
        </div>

        {/* Hue slider */}
        <div>
          <input
            type="range" name="color-hue" min="0" max="360" value={hslVals.h}
            onChange={(e) => {
              const hex = hslToHex(Number(e.target.value), hslVals.s, hslVals.l);
              setMobilePickerHex(hex);
              handleColorChange(mobilePickerKey, hex);
            }}
            className="w-full h-10 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, ${Array.from({length: 13}, (_, i) => hslToHex(i * 30, 100, 50)).join(", ")})`,
            }}
          />
        </div>

        {/* Hex input */}
        <div>
          <label className="text-xs font-medium mb-1.5 block ds-text-fg">
            Hex
          </label>
          <input
            type="text"
            name="hex-color"
            autoComplete="off"
            value={mobilePickerHex}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                setMobilePickerHex(v);
                handleColorChange(mobilePickerKey, v);
              } else {
                setMobilePickerHex(v);
              }
            }}
            className="w-full h-10 px-3 text-base font-mono rounded-lg border bg-transparent ds-text-fg ds-border"
          />
        </div>
      </div>

      {/* Done button */}
      <div className="p-4">
        <button
          onClick={() => setMobilePickerKey(null)}
          className="w-full h-12 rounded-xl text-base font-medium cursor-pointer"
          style={{
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            border: "none",
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
