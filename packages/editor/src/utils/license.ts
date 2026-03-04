/**
 * License key validation and generation for @theemel/editor premium features.
 *
 * Key format:  THEEMEL-XXXX-XXXX-XXXX
 *   - Segments use alphanumeric chars excluding ambiguous ones (0/O, 1/I/L).
 *   - The third segment is a checksum derived from the first two.
 */

export type PremiumFeature =
  | "harmony-schemes"
  | "color-locks"
  | "pr-integration"
  | "undo"
  | "palette-export"
  | "typography-spacing";

const ALPHABET = "2345679ABCDEFGHJKMNPQRSTUVWXYZ"; // 29 chars, no 0/O/1/I/L/8

function checksumSegment(seg1: string, seg2: string): string {
  // Simple hash: sum char-codes with positional weighting, map to 4-char segment
  let hash = 0;
  const combined = seg1 + seg2;
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * 31 + combined.charCodeAt(i) * (i + 1)) >>> 0;
  }
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += ALPHABET[hash % ALPHABET.length];
    hash = Math.floor(hash / ALPHABET.length);
  }
  return result;
}

function randomSegment(): string {
  let seg = "";
  for (let i = 0; i < 4; i++) {
    seg += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return seg;
}

export interface LicenseValidation {
  isValid: boolean;
  isPremium: boolean;
}

/**
 * Validate a license key string.
 * Returns `{ isValid: true, isPremium: true }` for a correct key,
 * or `{ isValid: false, isPremium: false }` otherwise.
 */
export function validateLicenseKey(key: string | undefined | null): LicenseValidation {
  if (!key) return { isValid: false, isPremium: false };

  const normalized = key.trim().toUpperCase();
  const pattern = /^THEEMEL-([2-9A-HJ-NP-Z]{4})-([2-9A-HJ-NP-Z]{4})-([2-9A-HJ-NP-Z]{4})$/;
  const match = normalized.match(pattern);
  if (!match) return { isValid: false, isPremium: false };

  const [, seg1, seg2, seg3] = match;
  const expected = checksumSegment(seg1, seg2);
  if (seg3 !== expected) return { isValid: false, isPremium: false };

  return { isValid: true, isPremium: true };
}

/**
 * Generate a valid license key (for admin / sales tooling).
 */
export function generateLicenseKey(): string {
  const seg1 = randomSegment();
  const seg2 = randomSegment();
  const seg3 = checksumSegment(seg1, seg2);
  return `THEEMEL-${seg1}-${seg2}-${seg3}`;
}
