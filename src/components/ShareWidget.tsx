import { lazy, Suspense } from "react";
import { useState } from "react";

// Lazy load icon to avoid blocking critical path
const LazyLink2 = lazy(() =>
  import("lucide-react").then((mod) => ({ default: mod.Link2 }))
);

interface ShareWidgetProps {
  url: string;
}

export default function ShareWidget({ url }: ShareWidgetProps) {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 text-brand-dynamic hover:text-brand-dynamic/80 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      aria-label="Copy link"
    >
      <Suspense fallback={<span className="h-5 w-5">🔗</span>}>
        <LazyLink2 className="h-5 w-5" />
      </Suspense>
      <span>{showCopied ? "Copied!" : "Copy Link"}</span>
    </button>
  );
}
