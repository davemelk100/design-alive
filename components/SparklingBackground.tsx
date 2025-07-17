import React, { useEffect, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: { background: string; border: string };
}

const SparklingBackground: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const colors = [
    { background: "#6da9fd", border: "#a8c9ff" },
    { background: "#C03221", border: "#e05a4a" },
    { background: "#F9C22E", border: "#ffd86b" },
    { background: "#4CAF50", border: "#81c784" },
    { background: "#828E82", border: "#9BA69B" },
  ];

  useEffect(() => {
    // Create initial sparkles
    const initialSparkles: Sparkle[] = Array.from({ length: 30 }, (_, i) => {
      const colorIndex = Math.floor(Math.random() * colors.length);
      return {
        id: i,
        x: 95,
        y: (i / 29) * 100,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.3 + 0.7,
        color: colors[colorIndex],
      };
    });
    setSparkles(initialSparkles);

    // Animate sparkles
    const interval = setInterval(() => {
      setSparkles((prevSparkles) =>
        prevSparkles.map((sparkle, i) => {
          const baseY = (i / 29) * 100;
          const time = Date.now() / 1000; // Faster animation (was 2000)
          const offset = Math.sin(time + i * 0.2) * 2; // Subtle up and down motion
          return {
            ...sparkle,
            y: baseY + offset,
          };
        })
      );
    }, 30); // More frequent updates (was 50)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            opacity: sparkle.opacity,
            backgroundColor: sparkle.color.background,
            border: `1px solid ${sparkle.color.border}`,
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.2), 0 0 12px currentColor",
            transform: "translateZ(0)",
            transition: "top 0.1s ease-out",
          }}
        />
      ))}
    </div>
  );
};

export default SparklingBackground;
 