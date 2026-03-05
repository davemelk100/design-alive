import { useEffect, useRef } from "react";

interface Shape {
  x: number;
  y: number;
  size: number;
  type: "circle" | "roundedRect" | "diamond";
  color: string;
  opacity: number;
  dx: number;
  dy: number;
  phase: number;
  oscAmp: number;
}

function getCSSColor(varName: string): string {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return raw || "0 0% 50%";
}

function sampleColors(): string[] {
  return [
    getCSSColor("--brand"),
    getCSSColor("--primary"),
    getCSSColor("--accent"),
  ];
}

function createShape(w: number, h: number, colors: string[]): Shape {
  const types: Shape["type"][] = ["circle", "roundedRect", "diamond"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const opacity = 0.06 + Math.random() * 0.06;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: 30 + Math.random() * 60,
    type: types[Math.floor(Math.random() * types.length)],
    color,
    opacity,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    phase: Math.random() * Math.PI * 2,
    oscAmp: 0.3 + Math.random() * 0.5,
  };
}

function drawShape(ctx: CanvasRenderingContext2D, s: Shape) {
  ctx.fillStyle = `hsla(${s.color}, ${s.opacity})`;
  const half = s.size / 2;

  if (s.type === "circle") {
    ctx.beginPath();
    ctx.arc(s.x, s.y, half, 0, Math.PI * 2);
    ctx.fill();
  } else if (s.type === "roundedRect") {
    const r = s.size * 0.2;
    const x = s.x - half;
    const y = s.y - half;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + s.size - r, y);
    ctx.quadraticCurveTo(x + s.size, y, x + s.size, y + r);
    ctx.lineTo(x + s.size, y + s.size - r);
    ctx.quadraticCurveTo(x + s.size, y + s.size, x + s.size - r, y + s.size);
    ctx.lineTo(x + r, y + s.size);
    ctx.quadraticCurveTo(x, y + s.size, x, y + s.size - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(s.x, s.y - half);
    ctx.lineTo(s.x + half, s.y);
    ctx.lineTo(s.x, s.y + half);
    ctx.lineTo(s.x - half, s.y);
    ctx.closePath();
    ctx.fill();
  }
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let shapes: Shape[] = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initShapes() {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      const count = w < 768 ? 15 : 25;
      const colors = sampleColors();
      shapes = Array.from({ length: count }, () =>
        createShape(w, h, colors),
      );
    }

    function refreshColors() {
      const colors = sampleColors();
      for (const s of shapes) {
        s.color = colors[Math.floor(Math.random() * colors.length)];
      }
    }

    function animate(t: number) {
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      ctx!.clearRect(0, 0, w, h);

      for (const s of shapes) {
        s.x += s.dx + Math.sin(t * 0.001 + s.phase) * s.oscAmp * 0.3;
        s.y += s.dy + Math.cos(t * 0.001 + s.phase) * s.oscAmp * 0.3;

        // wrap edges
        if (s.x < -s.size) s.x = w + s.size;
        if (s.x > w + s.size) s.x = -s.size;
        if (s.y < -s.size) s.y = h + s.size;
        if (s.y > h + s.size) s.y = -s.size;

        drawShape(ctx!, s);
      }

      animId = requestAnimationFrame(animate);
    }

    resize();
    initShapes();
    animId = requestAnimationFrame(animate);

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);

    // Watch for dark mode class changes
    const mo = new MutationObserver(() => {
      refreshColors();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
