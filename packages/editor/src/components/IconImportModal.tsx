import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { ImportedIconData } from "../utils/iconImport";
import {
  parseSvgSprite,
  parseIconFont,
  fetchCdnIconIndex,
  fetchCdnIconSvg,
  cdnIconToImported,
  CDN_LIBRARIES,
} from "../utils/iconImport";

type Tab = "sprite" | "font" | "cdn";

const FONT_PRESETS: { label: string; url: string }[] = [
  {
    label: "Font Awesome 6 Free",
    url: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css",
  },
  {
    label: "Bootstrap Icons",
    url: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
  },
  {
    label: "Material Icons",
    url: "https://fonts.googleapis.com/icon?family=Material+Icons",
  },
];

const PAGE_SIZE = 60;

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (icons: ImportedIconData[]) => void;
}

export function IconImportModal({ open, onClose, onImport }: Props) {
  const [tab, setTab] = useState<Tab>("cdn");

  // Sprite state
  const [spriteUrl, setSpriteUrl] = useState("");
  const [spriteIcons, setSpriteIcons] = useState<ImportedIconData[]>([]);
  const [spriteLoading, setSpriteLoading] = useState(false);
  const [spriteError, setSpriteError] = useState<string | null>(null);

  // Font state
  const [fontUrl, setFontUrl] = useState("");
  const [fontIcons, setFontIcons] = useState<ImportedIconData[]>([]);
  const [fontLoading, setFontLoading] = useState(false);
  const [fontError, setFontError] = useState<string | null>(null);

  // CDN state
  const [cdnLibrary, setCdnLibrary] = useState("lucide");
  const [cdnIndex, setCdnIndex] = useState<{ name: string; svgUrl: string }[]>([]);
  const [cdnLoading, setCdnLoading] = useState(false);
  const [cdnError, setCdnError] = useState<string | null>(null);
  const [cdnSearch, setCdnSearch] = useState("");
  const [cdnPage, setCdnPage] = useState(1);
  const [cdnFetchingSelected, setCdnFetchingSelected] = useState(false);

  // Shared selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const backdropRef = useRef<HTMLDivElement>(null);

  // Reset selection when switching tabs
  useEffect(() => {
    setSelected(new Set());
  }, [tab]);

  const toggleSelect = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = ids.every((id) => next.has(id));
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  }, []);

  // Sprite fetch
  const handleFetchSprite = async () => {
    if (!spriteUrl.trim()) return;
    setSpriteLoading(true);
    setSpriteError(null);
    setSpriteIcons([]);
    setSelected(new Set());
    try {
      const icons = await parseSvgSprite(spriteUrl.trim());
      setSpriteIcons(icons);
    } catch (err) {
      setSpriteError(err instanceof Error ? err.message : "Failed to fetch sprite");
    }
    setSpriteLoading(false);
  };

  // Font fetch
  const handleFetchFont = async () => {
    if (!fontUrl.trim()) return;
    setFontLoading(true);
    setFontError(null);
    setFontIcons([]);
    setSelected(new Set());
    try {
      const icons = await parseIconFont(fontUrl.trim());
      setFontIcons(icons);
    } catch (err) {
      setFontError(err instanceof Error ? err.message : "Failed to parse icon font");
    }
    setFontLoading(false);
  };

  // CDN fetch index
  const handleFetchCdn = useCallback(async (lib: string) => {
    setCdnLoading(true);
    setCdnError(null);
    setCdnIndex([]);
    setCdnSearch("");
    setCdnPage(1);
    setSelected(new Set());
    try {
      const index = await fetchCdnIconIndex(lib);
      setCdnIndex(index);
    } catch (err) {
      setCdnError(err instanceof Error ? err.message : "Failed to fetch icon library");
    }
    setCdnLoading(false);
  }, []);

  // Auto-fetch CDN on library change
  useEffect(() => {
    if (tab === "cdn") handleFetchCdn(cdnLibrary);
  }, [cdnLibrary, tab, handleFetchCdn]);

  // Filtered and paginated CDN icons
  const filteredCdn = useMemo(() => {
    if (!cdnSearch.trim()) return cdnIndex;
    const q = cdnSearch.toLowerCase();
    return cdnIndex.filter((i) => i.name.toLowerCase().includes(q));
  }, [cdnIndex, cdnSearch]);

  const paginatedCdn = useMemo(() => {
    return filteredCdn.slice(0, cdnPage * PAGE_SIZE);
  }, [filteredCdn, cdnPage]);

  const hasMoreCdn = paginatedCdn.length < filteredCdn.length;

  // Import handler
  const handleImport = async () => {
    if (tab === "sprite") {
      const toImport = spriteIcons.filter((i) => selected.has(i.id));
      onImport(toImport);
      onClose();
    } else if (tab === "font") {
      const toImport = fontIcons.filter((i) => selected.has(i.id));
      onImport(toImport);
      onClose();
    } else if (tab === "cdn") {
      // Fetch SVGs for selected icons
      setCdnFetchingSelected(true);
      try {
        const toFetch = cdnIndex.filter((i) => selected.has(`cdn:${cdnLibrary}:${i.name}`));
        const results = await Promise.all(
          toFetch.map(async (entry) => {
            const svg = await fetchCdnIconSvg(entry.svgUrl);
            return cdnIconToImported(entry.name, svg, cdnLibrary, entry.svgUrl);
          }),
        );
        onImport(results);
        onClose();
      } catch (err) {
        setCdnError(err instanceof Error ? err.message : "Failed to fetch icon SVGs");
      }
      setCdnFetchingSelected(false);
    }
  };

  if (!open) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "cdn", label: "CDN Package" },
    { id: "sprite", label: "SVG Sprite" },
    { id: "font", label: "Icon Font" },
  ];

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div
        className="rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col ds-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-5 pb-3"
        >
          <h2 className="text-lg font-medium">Import Icons</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg transition-opacity hover:opacity-70 ds-text-muted"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="ds-icon-import-tab px-3 py-1.5 rounded-lg text-xs font-light transition-colors"
              style={{
                backgroundColor: tab === t.id ? "hsl(var(--foreground) / 0.1)" : "transparent",
                color: tab === t.id ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-3 min-h-0">
          {tab === "sprite" && (
            <SpriteTab
              url={spriteUrl}
              onUrlChange={setSpriteUrl}
              icons={spriteIcons}
              loading={spriteLoading}
              error={spriteError}
              selected={selected}
              onToggle={toggleSelect}
              onSelectAll={selectAll}
              onFetch={handleFetchSprite}
            />
          )}
          {tab === "font" && (
            <FontTab
              url={fontUrl}
              onUrlChange={setFontUrl}
              icons={fontIcons}
              loading={fontLoading}
              error={fontError}
              selected={selected}
              onToggle={toggleSelect}
              onSelectAll={selectAll}
              onFetch={handleFetchFont}
              presets={FONT_PRESETS}
            />
          )}
          {tab === "cdn" && (
            <CdnTab
              library={cdnLibrary}
              onLibraryChange={setCdnLibrary}
              icons={paginatedCdn}
              totalCount={filteredCdn.length}
              loading={cdnLoading}
              error={cdnError}
              search={cdnSearch}
              onSearchChange={setCdnSearch}
              selected={selected}
              onToggle={toggleSelect}
              onSelectAll={selectAll}
              hasMore={hasMoreCdn}
              onLoadMore={() => setCdnPage((p) => p + 1)}
              currentLibrary={cdnLibrary}
            />
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t ds-border"
        >
          <span className="text-xs font-light ds-text-muted">
            {selected.size} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-light rounded-lg transition-opacity hover:opacity-70 ds-text-muted"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={selected.size === 0 || cdnFetchingSelected}
              className="px-4 py-2 text-xs font-medium rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40 ds-surface-invert"
            >
              {cdnFetchingSelected ? "Fetching..." : `Import (${selected.size})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab Components
// ---------------------------------------------------------------------------

function SpriteTab({
  url,
  onUrlChange,
  icons,
  loading,
  error,
  selected,
  onToggle,
  onSelectAll,
  onFetch,
}: {
  url: string;
  onUrlChange: (v: string) => void;
  icons: ImportedIconData[];
  loading: boolean;
  error: string | null;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onFetch: () => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-light ds-text-muted">
        Paste a URL to an SVG sprite file containing &lt;symbol&gt; elements.
      </p>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com/icons.svg"
          className="flex-1 px-3 py-2 text-xs font-light rounded-lg border outline-none ds-border ds-surface-bg"
          onKeyDown={(e) => { if (e.key === "Enter") onFetch(); }}
        />
        <button
          onClick={onFetch}
          disabled={loading || !url.trim()}
          className="px-4 py-2 text-xs font-medium rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40 ds-surface-invert"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>
      {error && <ErrorMessage message={error} />}
      {icons.length > 0 && (
        <IconGrid
          icons={icons}
          selected={selected}
          onToggle={onToggle}
          onSelectAll={onSelectAll}
          renderIcon={(ic) =>
            ic.svgMarkup ? (
              <span
                className="ds-icon-import-preview"
                dangerouslySetInnerHTML={{ __html: ic.svgMarkup }}
              />
            ) : null
          }
        />
      )}
    </div>
  );
}

function FontTab({
  url,
  onUrlChange,
  icons,
  loading,
  error,
  selected,
  onToggle,
  onSelectAll,
  onFetch,
  presets,
}: {
  url: string;
  onUrlChange: (v: string) => void;
  icons: ImportedIconData[];
  loading: boolean;
  error: string | null;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onFetch: () => void;
  presets: { label: string; url: string }[];
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-light ds-text-muted">
        Paste a URL to an icon font CSS file, or choose a preset.
      </p>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => onUrlChange(p.url)}
            className="px-3 py-1 text-[12px] font-light rounded-full border transition-colors"
            style={{
              borderColor: url === p.url ? "hsl(var(--foreground))" : "hsl(var(--border))",
              color: url === p.url ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
              backgroundColor: url === p.url ? "hsl(var(--foreground) / 0.05)" : "transparent",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://cdn.example.com/icons.css"
          className="flex-1 px-3 py-2 text-xs font-light rounded-lg border outline-none ds-border ds-surface-bg"
          onKeyDown={(e) => { if (e.key === "Enter") onFetch(); }}
        />
        <button
          onClick={onFetch}
          disabled={loading || !url.trim()}
          className="px-4 py-2 text-xs font-medium rounded-lg transition-opacity hover:opacity-90 disabled:opacity-40 ds-surface-invert"
        >
          {loading ? "Loading..." : "Fetch"}
        </button>
      </div>
      {error && <ErrorMessage message={error} />}
      {icons.length > 0 && (
        <IconGrid
          icons={icons}
          selected={selected}
          onToggle={onToggle}
          onSelectAll={onSelectAll}
          renderIcon={(ic) => {
            if (ic.className === "material-icons") {
              return (
                <i className="material-icons ds-icon-import-preview" style={{ fontSize: "20px" }}>
                  {ic.name.toLowerCase().replace(/ /g, "_")}
                </i>
              );
            }
            return <i className={`${ic.className} ds-icon-import-preview`} style={{ fontSize: "20px" }} />;
          }}
        />
      )}
    </div>
  );
}

function CdnTab({
  library,
  onLibraryChange,
  icons,
  totalCount,
  loading,
  error,
  search,
  onSearchChange,
  selected,
  onToggle,
  onSelectAll,
  hasMore,
  onLoadMore,
  currentLibrary,
}: {
  library: string;
  onLibraryChange: (v: string) => void;
  icons: { name: string; svgUrl: string }[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (v: string) => void;
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  hasMore: boolean;
  onLoadMore: () => void;
  currentLibrary: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-light ds-text-muted">
        Pick an icon library and select icons to import.
      </p>
      <div className="flex gap-2 flex-wrap">
        {CDN_LIBRARIES.map((lib) => (
          <button
            key={lib.id}
            onClick={() => onLibraryChange(lib.id)}
            className="px-3 py-1.5 text-xs font-light rounded-lg border transition-colors"
            style={{
              borderColor: library === lib.id ? "hsl(var(--foreground))" : "hsl(var(--border))",
              color: library === lib.id ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
              backgroundColor: library === lib.id ? "hsl(var(--foreground) / 0.05)" : "transparent",
            }}
          >
            {lib.name}
          </button>
        ))}
      </div>
      {!loading && icons.length > 0 && (
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search icons..."
          className="w-full px-3 py-2 text-xs font-light rounded-lg border outline-none ds-border ds-surface-bg"
        />
      )}
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {!loading && icons.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-light ds-text-muted">
              {totalCount} icons
            </span>
            <button
              onClick={() =>
                onSelectAll(icons.map((i) => `cdn:${currentLibrary}:${i.name}`))
              }
              className="text-[12px] font-light px-2 py-0.5 rounded transition-colors hover:opacity-80 ds-text-muted"
              style={{
                border: "1px solid hsl(var(--border))",
              }}
            >
              {icons.every((i) => selected.has(`cdn:${currentLibrary}:${i.name}`))
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
          <div className="ds-icon-import-grid">
            {icons.map((entry) => {
              const id = `cdn:${currentLibrary}:${entry.name}`;
              const isSelected = selected.has(id);
              return (
                <button
                  key={id}
                  onClick={() => onToggle(id)}
                  className="ds-icon-import-item ds-text-fg"
                  style={{
                    backgroundColor: isSelected
                      ? "hsl(var(--foreground) / 0.1)"
                      : "transparent",
                    borderColor: isSelected
                      ? "hsl(var(--foreground) / 0.3)"
                      : "hsl(var(--border))",
                  }}
                  title={entry.name}
                >
                  <span className="ds-icon-import-cdn-name">
                    {entry.name.replace(/[-_]/g, " ")}
                  </span>
                </button>
              );
            })}
          </div>
          {hasMore && (
            <button
              onClick={onLoadMore}
              className="w-full py-2 text-xs font-light rounded-lg transition-colors hover:opacity-80 ds-text-muted"
              style={{
                border: "1px solid hsl(var(--border))",
              }}
            >
              Load More
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared Components
// ---------------------------------------------------------------------------

function IconGrid({
  icons,
  selected,
  onToggle,
  onSelectAll,
  renderIcon,
}: {
  icons: ImportedIconData[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  renderIcon: (ic: ImportedIconData) => React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-light ds-text-muted">
          {icons.length} icons found
        </span>
        <button
          onClick={() => onSelectAll(icons.map((i) => i.id))}
          className="text-[12px] font-light px-2 py-0.5 rounded transition-colors hover:opacity-80 ds-text-muted"
          style={{
            border: "1px solid hsl(var(--border))",
          }}
        >
          {icons.every((i) => selected.has(i.id)) ? "Deselect All" : "Select All"}
        </button>
      </div>
      <div className="ds-icon-import-grid">
        {icons.map((ic) => {
          const isSelected = selected.has(ic.id);
          return (
            <button
              key={ic.id}
              onClick={() => onToggle(ic.id)}
              className="ds-icon-import-item ds-text-fg"
              style={{
                backgroundColor: isSelected
                  ? "hsl(var(--foreground) / 0.1)"
                  : "transparent",
                borderColor: isSelected
                  ? "hsl(var(--foreground) / 0.3)"
                  : "hsl(var(--border))",
              }}
              title={ic.name}
            >
              {renderIcon(ic)}
              <span className="ds-icon-import-item-label">{ic.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      className="text-xs font-light rounded-lg p-3 ds-text-destructive"
      style={{
        backgroundColor: "hsl(var(--destructive) / 0.1)",
      }}
    >
      {message}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div
        className="ds-icon-import-spinner"
        style={{ borderColor: "hsl(var(--border))", borderTopColor: "hsl(var(--foreground))" }}
      />
    </div>
  );
}
