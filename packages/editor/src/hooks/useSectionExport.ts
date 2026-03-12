import { useState, useCallback } from "react";

export function useSectionExport() {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<"css" | "tokens">("css");

  const toggleCss = useCallback(() => {
    setVisible((v) => {
      if (v && format === "css") return false;
      return true;
    });
    setFormat("css");
  }, [format]);

  const toggleTokens = useCallback(() => {
    setVisible((v) => {
      if (v && format === "tokens") return false;
      return true;
    });
    setFormat("tokens");
  }, [format]);

  const copyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const close = useCallback(() => setVisible(false), []);

  return { visible, copied, format, toggleCss, toggleTokens, copyCode, close };
}
