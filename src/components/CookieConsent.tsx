import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "themal-cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t shadow-lg"
      style={{
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        color: "hsl(var(--card-foreground))",
      }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm font-normal flex-1">
          This site uses third-party cookies from authentication and payment providers to deliver its services.
          See our{" "}
          <Link to="/cookies" className="font-normal underline hover:opacity-70 transition-opacity">
            Cookies Policy
          </Link>{" "}
          for details.
        </p>
        <button
          onClick={accept}
          className="px-4 py-2 text-sm font-normal rounded-lg transition-colors hover:opacity-80 whitespace-nowrap"
          style={{
            backgroundColor: "#111",
            color: "#fff",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
