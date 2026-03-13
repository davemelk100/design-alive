import { useState, useEffect, useRef, useCallback } from "react";

const SECTION_IDS = ["colors", "buttons", "card", "alerts", "typography", "inputs"];
const SECTION_LINKS: { id: string; label: string }[] = [
  { id: "colors", label: "Colors" },
  { id: "buttons", label: "Buttons" },
  { id: "card", label: "Cards" },
  { id: "alerts", label: "Alerts" },
  { id: "typography", label: "Typography" },
  { id: "inputs", label: "Inputs" },
];

export function SectionNav() {
  const [activeSection, setActiveSection] = useState("colors");
  const [navOffsets, setNavOffsets] = useState<Record<string, number>>({});
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
      className="ds-section-nav sticky top-0 z-50"
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      <div className="w-full mx-auto flex" style={{ maxWidth: "1500px" }}>
        <div className="hidden lg:flex items-end w-48 flex-shrink-0 pl-4 pr-2 py-3" />
        <div className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-3 flex items-end">
          <nav
            ref={navContainerRef}
            className="flex items-baseline gap-2 sm:gap-3 md:gap-4 lg:gap-6 overflow-x-auto flex-nowrap"
          >
            {SECTION_LINKS.map(({ id, label }) => (
              <a
                key={id}
                ref={(el) => { navItemRefs.current[id] = el; }}
                href={`#${id}`}
                className="text-[14px] sm:text-[16px] md:text-[20px] font-light flex items-baseline gap-1 sm:gap-2 whitespace-nowrap no-underline"
                style={{
                  color: "hsl(var(--foreground))",
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
    </div>
  );
}
