import { Link2 } from "lucide-react";
import { useState } from "react";

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
      className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      aria-label="Copy link"
    >
      <Link2 className="h-5 w-5" />
      <span>{showCopied ? "Copied!" : "Copy Link"}</span>
    </button>
  );
}
 