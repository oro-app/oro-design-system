/**
 * Colour maths for the token tests only. Deliberately a SECOND, independent
 * implementation of luminance/contrast rather than importing from
 * `primitives.ts` — a test that reuses the code under test can only prove the
 * code is self-consistent, not that it's correct.
 *
 * Not exported from the package (`index.ts` does not re-export it) and not
 * shipped (`files: ["dist"]`).
 */

/** Composite an 8-digit `#RRGGBBAA` over an opaque background. Pass-through for 6-digit. */
export function flatten(fg: string, bg: string): string {
  if (fg.length < 9) return fg;
  const a = parseInt(fg.slice(7, 9), 16) / 255;
  const ch = (i: number) =>
    Math.round(parseInt(fg.slice(i, i + 2), 16) * a + parseInt(bg.slice(i, i + 2), 16) * (1 - a));
  return (
    '#' +
    [1, 3, 5]
      .map((i) => ch(i).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

/** WCAG 2.x relative luminance. */
export function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

/**
 * WCAG contrast ratio.
 *
 * Both arguments may be translucent — several semantic tokens are (e.g.
 * `surfaceDanger` is `#A84E5C14`). A translucent *background* is composited
 * over `base` first; treating it as opaque yields a meaningless ratio of ~1.
 * The foreground is then composited over the resolved background.
 */
export function contrast(fg: string, bg: string, base = '#FFFFFF'): number {
  const solidBg = flatten(bg, base);
  const [hi, lo] = [luminance(flatten(fg, solidBg)), luminance(solidBg)].sort((a, b) => b - a);
  return Math.round(((hi! + 0.05) / (lo! + 0.05)) * 100) / 100;
}
