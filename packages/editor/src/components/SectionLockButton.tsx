import React from "react";
import { FEATURE_FLAGS } from "../utils/featureFlags";
import type { LockableSection } from "../DesignSystemEditor";

interface SectionLockButtonProps {
  section: LockableSection;
  locked: boolean;
  onToggle: () => void;
}

export const SectionLockButton: React.FC<SectionLockButtonProps> = ({ section, locked, onToggle }) => {
  if (!FEATURE_FLAGS.sectionLocks) return null;

  return (
    <button
      onClick={onToggle}
      className={`ml-2 p-1 rounded transition-opacity hover:opacity-70 ${locked ? "ds-text-brand" : "ds-text-subtle"}`}
      title={locked ? `Unlock ${section} section` : `Lock ${section} section — preserves styles during global changes`}
      aria-label={locked ? `Unlock ${section} section` : `Lock ${section} section`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        {locked ? (
          <>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </>
        ) : (
          <>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 019.9-1" />
          </>
        )}
      </svg>
    </button>
  );
};
