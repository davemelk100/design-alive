import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemalLogo from "./ThemalLogo";

const SECTION_IDS = ["colors", "buttons", "card", "alerts", "typography", "inputs"];
const SECTION_LINKS: { id: string; label: string }[] = [
  { id: "colors", label: "Colors" },
  { id: "buttons", label: "Buttons" },
  { id: "card", label: "Cards" },
  { id: "alerts", label: "Alerts" },
  { id: "typography", label: "Typography" },
  { id: "inputs", label: "Inputs" },
];

export default function SiteHeader() {
  const { pathname } = useLocation();
  const isEditor = pathname === "/editor";

  const [activeSection, setActiveSection] = useState("colors");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navOffsets, setNavOffsets] = useState<Record<string, number>>({});
  const navItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navContainerRef = useRef<HTMLElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const activeLabel = SECTION_LINKS.find((s) => s.id === activeSection)?.label ?? "Colors";

  // Observe which section is in view
  useEffect(() => {
    if (!isEditor) return;
    const elements = SECTION_IDS
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isEditor]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Recalculate offsets so active item slides to the left (desktop only)
  const recalcNavOffsets = useCallback(() => {
    const refs = navItemRefs.current;
    const container = navContainerRef.current;
    if (!container) return;

    // Temporarily remove transforms to measure natural positions
    const elements: { el: HTMLAnchorElement; prev: string }[] = [];
    for (const id of SECTION_IDS) {
      const el = refs[id];
      if (el) {
        elements.push({ el, prev: el.style.transform });
        el.style.transform = "none";
      }
    }

    void container.offsetWidth;

    const positions: Record<string, { left: number; width: number }> = {};
    for (const id of SECTION_IDS) {
      const el = refs[id];
      if (el) {
        positions[id] = { left: el.offsetLeft, width: el.offsetWidth };
      }
    }

    for (const { el, prev } of elements) {
      el.style.transform = prev;
    }

    if (!positions[activeSection]) return;

    const gap = parseFloat(getComputedStyle(container).gap) || 16;

    const reordered = [
      activeSection,
      ...SECTION_IDS.filter((id) => id !== activeSection),
    ];

    let cursor = positions[SECTION_IDS[0]]?.left ?? 0;
    const targetLeft: Record<string, number> = {};
    for (const id of reordered) {
      targetLeft[id] = cursor;
      cursor += (positions[id]?.width ?? 0) + gap;
    }

    const offsets: Record<string, number> = {};
    for (const id of SECTION_IDS) {
      offsets[id] = Math.round(
        (targetLeft[id] ?? 0) - (positions[id]?.left ?? 0),
      );
    }
    setNavOffsets(offsets);
  }, [activeSection]);

  useEffect(() => {
    if (!isEditor) return;
    const raf = requestAnimationFrame(() => recalcNavOffsets());
    window.addEventListener("nav-recalc", recalcNavOffsets);
    window.addEventListener("resize", recalcNavOffsets);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("nav-recalc", recalcNavOffsets);
      window.removeEventListener("resize", recalcNavOffsets);
    };
  }, [isEditor, recalcNavOffsets]);

  function scrollToSection(id: string) {
    setDropdownOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <header
      className="sticky top-0 z-50 bg-page"
    >
      {isEditor ? (
        <div className="w-full mx-auto flex flex-col lg:flex-row site-container">
          {/* Logo + mobile dropdown row */}
          <div className="flex items-center flex-shrink-0 pl-4 pr-2 lg:w-48 pt-3 pb-3 lg:py-3 gap-3">
            <Link
              to="/"
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Themal home"
            >
              <ThemalLogo className="h-6 sm:h-7" />
            </Link>

            {/* Mobile section dropdown */}
            <div ref={dropdownRef} className="relative lg:hidden">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 h-9 rounded-lg text-sm font-light text-fg hover:opacity-80 transition-opacity"
              >
                {activeLabel}
                <svg
                  className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-1 z-50 min-w-[160px] rounded-lg shadow-lg py-1 border bg-page border-theme">
                  {SECTION_LINKS.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => scrollToSection(id)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-light transition-colors hover:opacity-80 ${
                        id === activeSection ? "text-fg font-normal" : "text-muted"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop nav: hidden on mobile, visible at lg */}
          <div className="hidden lg:flex flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pb-3 pt-1 lg:py-3 items-end">
            <nav
              ref={navContainerRef}
              className="flex items-baseline gap-2 sm:gap-3 md:gap-4 lg:gap-6 overflow-x-auto flex-nowrap"
            >
              {SECTION_LINKS.map(({ id, label }) => (
                <a
                  key={id}
                  ref={(el) => { navItemRefs.current[id] = el; }}
                  href={`#${id}`}
                  className="text-sm sm:text-base md:text-lg font-light flex items-baseline gap-1 sm:gap-2 whitespace-nowrap no-underline text-fg"
                  style={{
                    transform: `translateX(${navOffsets[id] ?? 0}px)`,
                    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {label}
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 opacity-30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 5v14m0 0l-7-7m7 7l7-7"
                    />
                  </svg>
                </a>
              ))}
            </nav>
          </div>
        </div>
      ) : (
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-end gap-6 site-container">
          <Link
            to="/"
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Themal home"
          >
            <ThemalLogo className="h-6 sm:h-7" />
          </Link>
        </div>
      )}
    </header>
  );
}
