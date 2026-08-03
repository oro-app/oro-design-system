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

// ── CIELAB, for chroma/hue assertions ────────────────────────────────────────
// Deliberately CIELAB and not OKLCh: `contrastShift()` solves in OKLCh, so
// measuring its output with the same space would only prove it is internally
// consistent. CIELAB is an independent yardstick, and C*ab is also the number
// quoted in the accessibility write-ups.

function labOf(hex: string): { L: number; a: number; b: number } {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)) as [
    number,
    number,
    number,
  ];
  const X = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const Y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  const Z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : (841 / 108) * t + 4 / 29);
  const [fx, fy, fz] = [f(X / 0.95047), f(Y / 1), f(Z / 1.08883)];
  return { L: 116 * fy! - 16, a: 500 * (fx! - fy!), b: 200 * (fy! - fz!) };
}

/** CIELAB chroma (C*ab) — how saturated the colour is. */
export function chroma(hex: string): number {
  const { a, b } = labOf(hex);
  return Math.hypot(a, b);
}

/** CIELAB hue angle in degrees. */
export function hue(hex: string): number {
  const { a, b } = labOf(hex);
  return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
}
