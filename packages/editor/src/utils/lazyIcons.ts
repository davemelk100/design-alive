import React from "react";

type LucideModule = Record<string, React.ComponentType<{ className?: string }>>;

/** Factory for lazily importing a single icon from lucide-react by export name. */
function lazyIcon(name: string) {
  return React.lazy(() =>
    import("lucide-react").then((mod) => ({
      default: (mod as unknown as LucideModule)[name],
    })),
  );
}

export const LazyHome = lazyIcon("Home");
export const LazyPalette = lazyIcon("Palette");
export const LazyBookOpen = lazyIcon("BookOpen");
export const LazyBriefcase = lazyIcon("Briefcase");
export const LazySearch = lazyIcon("Search");
export const LazySun = lazyIcon("Sun");
export const LazyMoon = lazyIcon("Moon");
export const LazyEye = lazyIcon("Eye");
export const LazyHeart = lazyIcon("Heart");
export const LazyCheck = lazyIcon("Check");
export const LazyExternalLink = lazyIcon("ExternalLink");
export const LazyLink2 = lazyIcon("Link2");
export const LazyFlaskConical = lazyIcon("FlaskConical");
export const LazyUsers = lazyIcon("Users");
export const LazyAlertCircle = lazyIcon("AlertCircle");
export const LazyZap = lazyIcon("Zap");
export const LazyGlobe = lazyIcon("Globe");
export const LazyShield = lazyIcon("Shield");
export const LazySettings = lazyIcon("Settings");
export const LazyCode = lazyIcon("Code");
export const LazyDatabase = lazyIcon("Database");
export const LazySmartphone = lazyIcon("Smartphone");
export const LazyCamera = lazyIcon("Camera");
export const LazyMail = lazyIcon("Mail");
export const LazyBell = lazyIcon("Bell");
export const LazyClock = lazyIcon("Clock");
export const LazyDownload = lazyIcon("Download");
