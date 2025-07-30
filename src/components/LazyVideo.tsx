import React, { useState, useRef, useEffect } from "react";

interface LazyVideoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  className,
  style,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
}) => {
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px 0px", // Start loading 100px before the video comes into view
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={className} style={style}>
      {isInView && (
        <video
          ref={videoRef}
          className="w-full h-auto object-contain"
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {!isInView && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading video...</div>
        </div>
      )}
    </div>
  );
};

export default LazyVideo;
