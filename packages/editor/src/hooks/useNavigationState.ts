import { useState, useEffect, useRef } from "react";

const NAV_IDS = ["colors", "buttons", "card", "alerts", "typography", "inputs"];

export function useNavigationState() {
  const [activeSection, setActiveSection] = useState<string>("colors");
  const [navOffsets, setNavOffsets] = useState<Record<string, number>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver for active section detection
  useEffect(() => {
    const ids = ["colors", "card", "alerts", "typography", "buttons", "inputs"];
    const elements = ids
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

  // Recalculate nav offsets when active section changes
  useEffect(() => {
    const recalcNavOffsets = () => {
      const refs = navItemRefs.current;
      const container = navContainerRef.current;
      if (!container) return;

      // Temporarily remove transforms so we can measure natural positions
      const elements: { el: HTMLAnchorElement; prev: string }[] = [];
      for (const id of NAV_IDS) {
        const el = refs[id];
        if (el) {
          elements.push({ el, prev: el.style.transform });
          el.style.transform = "none";
        }
      }

      // Force layout reflow
      void container.offsetWidth;

      // Measure natural positions
      const positions: Record<string, { left: number; width: number }> = {};
      for (const id of NAV_IDS) {
        const el = refs[id];
        if (el) {
          positions[id] = { left: el.offsetLeft, width: el.offsetWidth };
        }
      }

      // Restore transforms immediately (will be overwritten by state update)
      for (const { el, prev } of elements) {
        el.style.transform = prev;
      }

      if (!positions[activeSection]) return;

      // Compute gap from container
      const gap = parseFloat(getComputedStyle(container).gap) || 12;

      // Build the reordered list: active first, then others in original order
      const reordered = [
        activeSection,
        ...NAV_IDS.filter((id) => id !== activeSection),
      ];

      // Calculate where each item should go based on reordered positions
      let cursor = positions[NAV_IDS[0]]?.left ?? 0;
      const targetLeft: Record<string, number> = {};
      for (const id of reordered) {
        targetLeft[id] = cursor;
        cursor += (positions[id]?.width ?? 0) + gap;
      }

      // Offset = target - natural
      const offsets: Record<string, number> = {};
      for (const id of NAV_IDS) {
        offsets[id] = Math.round(
          (targetLeft[id] ?? 0) - (positions[id]?.left ?? 0),
        );
      }
      setNavOffsets(offsets);
    };

    // Delay to allow font/typography CSS to apply before measuring
    const raf = requestAnimationFrame(() => recalcNavOffsets());
    window.addEventListener("nav-recalc", recalcNavOffsets);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("nav-recalc", recalcNavOffsets);
    };
  }, [activeSection]);

  // Show/hide scroll-to-top button
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return {
    activeSection,
    navOffsets,
    mobileMenuOpen,
    setMobileMenuOpen,
    showScrollTop,
    navItemRefs,
    navContainerRef,
  };
}
