import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FEATURE_FLAGS } from "../utils/featureFlags";
import { BREAKPOINTS } from "../utils/breakpoints";

const BASE_SECTION_IDS = ["colors", "buttons", "card", "alerts", "typography", "inputs"];
const BASE_SECTION_LINKS: { id: string; label: string }[] = [
  { id: "colors", label: "Colors" },
  { id: "buttons", label: "Buttons" },
  { id: "card", label: "Cards" },
  { id: "alerts", label: "Alerts" },
  { id: "typography", label: "Typography" },
  { id: "inputs", label: "Inputs" },
];

export function SectionNav() {
  const SECTION_IDS = useMemo(() => {
    const ids = [...BASE_SECTION_IDS];
    if (FEATURE_FLAGS.tables) ids.push("tables");
    return ids;
  }, []);

  const SECTION_LINKS = useMemo(() => {
    const links = [...BASE_SECTION_LINKS];
    if (FEATURE_FLAGS.tables) links.push({ id: "tables", label: "Tables" });
    return links;
  }, []);

  const [activeSection, setActiveSection] = useState("colors");
  const [, setNavOffsets] = useState<Record<string, number>>({});
  const navItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navContainerRef = useRef<HTMLElement | null>(null);

  // Observe which section is in view
  useEffect(() => {
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
  }, []);

  // Recalculate offsets so active item slides to the left (desktop only)
  const recalcNavOffsets = useCallback(() => {
    const refs = navItemRefs.current;
    const container = navContainerRef.current;
    if (!container) return;

    // Only reorder on desktop (lg+) — on tablet/mobile show natural order
    if (window.innerWidth < BREAKPOINTS.lg) {
      setNavOffsets({});
      return;
    }

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
    const raf = requestAnimationFrame(() => recalcNavOffsets());
    window.addEventListener("nav-recalc", recalcNavOffsets);
    window.addEventListener("resize", recalcNavOffsets);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("nav-recalc", recalcNavOffsets);
      window.removeEventListener("resize", recalcNavOffsets);
    };
  }, [recalcNavOffsets]);

  return (
    <div
      className="ds-section-nav sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 py-3"
    >
          <nav
            ref={navContainerRef}
            className="flex items-baseline gap-2 sm:gap-3 md:gap-4 lg:gap-6 overflow-x-auto flex-nowrap"
          >
            {SECTION_LINKS.map(({ id, label }) => (
              <a
                key={id}
                ref={(el) => { navItemRefs.current[id] = el; }}
                href={`#${id}`}
                className={`whitespace-nowrap flex items-center gap-2 no-underline ds-text-fg ds-nav-link-item${activeSection === id ? " ds-active" : ""}`}
              >
                <h2 className={`text-sm sm:text-base md:text-lg tracking-wider m-0 p-0 flex items-baseline gap-2${activeSection === id ? " font-bold" : " font-normal"}`}>
                  {label}
                  <svg
                    className="w-[1em] h-[1em] opacity-60"
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
                </h2>
              </a>
            ))}
          </nav>
    </div>
  );
}
