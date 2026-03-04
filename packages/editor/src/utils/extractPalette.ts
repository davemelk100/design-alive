/**
 * Extract a color palette from an uploaded image using Canvas API + k-means clustering.
 * Returns 5 HSL color values mapped to design system roles.
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

function rgbDistance(a: RGB, b: RGB): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function saturation(c: RGB): number {
  const { s } = rgbToHsl(c.r, c.g, c.b);
  return s;
}

function luminance(c: RGB): number {
  return 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
}

/** k-means++ initialization */
function initCentroids(pixels: RGB[], k: number): RGB[] {
  const centroids: RGB[] = [];
  const idx = Math.floor(Math.random() * pixels.length);
  centroids.push({ ...pixels[idx] });

  for (let c = 1; c < k; c++) {
    const distances = pixels.map((p) => {
      const minDist = Math.min(...centroids.map((cen) => rgbDistance(p, cen)));
      return minDist * minDist;
    });
    const total = distances.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < distances.length; i++) {
      r -= distances[i];
      if (r <= 0) {
        centroids.push({ ...pixels[i] });
        break;
      }
    }
    if (centroids.length <= c) centroids.push({ ...pixels[Math.floor(Math.random() * pixels.length)] });
  }
  return centroids;
}

function kMeans(pixels: RGB[], k: number, iterations: number): RGB[] {
  let centroids = initCentroids(pixels, k);

  for (let iter = 0; iter < iterations; iter++) {
    const clusters: RGB[][] = Array.from({ length: k }, () => []);

    for (const p of pixels) {
      let minDist = Infinity;
      let closest = 0;
      for (let c = 0; c < centroids.length; c++) {
        const d = rgbDistance(p, centroids[c]);
        if (d < minDist) { minDist = d; closest = c; }
      }
      clusters[closest].push(p);
    }

    centroids = clusters.map((cluster, i) => {
      if (cluster.length === 0) return centroids[i];
      const avg: RGB = { r: 0, g: 0, b: 0 };
      for (const p of cluster) { avg.r += p.r; avg.g += p.g; avg.b += p.b; }
      return { r: avg.r / cluster.length, g: avg.g / cluster.length, b: avg.b / cluster.length };
    });
  }

  return centroids;
}

function mergeSimilar(centroids: RGB[], threshold: number): RGB[] {
  const merged: RGB[] = [];
  const used = new Set<number>();
  for (let i = 0; i < centroids.length; i++) {
    if (used.has(i)) continue;
    let avg = { ...centroids[i] };
    let count = 1;
    for (let j = i + 1; j < centroids.length; j++) {
      if (used.has(j)) continue;
      if (rgbDistance(centroids[i], centroids[j]) < threshold) {
        avg.r += centroids[j].r;
        avg.g += centroids[j].g;
        avg.b += centroids[j].b;
        count++;
        used.add(j);
      }
    }
    merged.push({ r: avg.r / count, g: avg.g / count, b: avg.b / count });
    used.add(i);
  }
  return merged;
}

function toHslString(c: RGB): string {
  const { h, s, l } = rgbToHsl(Math.round(c.r), Math.round(c.g), Math.round(c.b));
  return `${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%`;
}

export async function extractPaletteFromUrl(url: string): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scale = Math.min(1, 100 / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);

      const imageData = ctx.getImageData(0, 0, w, h);
      const pixels: RGB[] = [];
      for (let i = 0; i < imageData.data.length; i += 4) {
        const a = imageData.data[i + 3];
        if (a < 128) continue;
        pixels.push({ r: imageData.data[i], g: imageData.data[i + 1], b: imageData.data[i + 2] });
      }

      if (pixels.length === 0) {
        reject(new Error("Image contains no visible pixels."));
        return;
      }

      resolve(assignRoles(pixels));
    };
    img.onerror = () => reject(new Error("Failed to load image. The URL may be invalid or the server blocks cross-origin requests."));
    img.src = url;
  });
}

function assignRoles(pixels: RGB[]): Record<string, string> {
  let clusters = kMeans(pixels, 6, 12);
  clusters = mergeSimilar(clusters, 25);

  while (clusters.length < 5) {
    const c = clusters[0];
    clusters.push({ r: Math.min(255, c.r + 30), g: Math.min(255, c.g + 30), b: Math.min(255, c.b + 30) });
  }

  const sorted = [...clusters].sort((a, b) => luminance(a) - luminance(b));
  const darkest = sorted[0];
  const lightest = sorted[sorted.length - 1];

  const avgLum = pixels.reduce((s, p) => s + luminance(p), 0) / pixels.length;
  const isDark = avgLum < 128;

  const bg = isDark ? darkest : lightest;
  const fg = isDark ? lightest : darkest;

  const remaining = clusters.filter((c) => c !== darkest && c !== lightest);
  remaining.sort((a, b) => saturation(b) - saturation(a));

  const brand = remaining[0] || sorted[Math.floor(sorted.length / 2)];
  const secondary = remaining[1] || sorted[Math.floor(sorted.length / 3)];
  const accent = remaining[2] || sorted[Math.floor(sorted.length * 2 / 3)];

  return {
    "--background": toHslString(bg),
    "--foreground": toHslString(fg),
    "--brand": toHslString(brand),
    "--secondary": toHslString(secondary),
    "--accent": toHslString(accent),
  };
}

export async function extractPaletteFromImage(file: File): Promise<Record<string, string>> {
  const validTypes = ["image/png", "image/jpeg", "image/jpg"];
  if (!validTypes.includes(file.type)) {
    throw new Error("Only PNG and JPG images are supported.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 100 / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const imageData = ctx.getImageData(0, 0, w, h);
  const pixels: RGB[] = [];
  for (let i = 0; i < imageData.data.length; i += 4) {
    const a = imageData.data[i + 3];
    if (a < 128) continue; // skip transparent
    pixels.push({ r: imageData.data[i], g: imageData.data[i + 1], b: imageData.data[i + 2] });
  }

  if (pixels.length === 0) {
    throw new Error("Image contains no visible pixels.");
  }

  return assignRoles(pixels);
}
