import { describe, expect, it } from 'vitest';
import { componentsForMode } from './components';
import { dark, forMode, light, type SemanticColors } from './semantic';
import { contrast } from './testUtils';

describe('mode parity', () => {
  it('light and dark implement the identical role vocabulary', () => {
    // This is what makes `tone` safe to flip on any component: a role that
    // exists in one mode and not the other would render `undefined`.
    expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
  });

  it('every role in both modes is a non-empty string', () => {
    for (const [mode, set] of Object.entries({ light, dark })) {
      for (const [role, value] of Object.entries(set)) {
        expect(value, `${mode}.${role}`).toBeTruthy();
        expect(typeof value, `${mode}.${role}`).toBe('string');
      }
    }
  });

  it('the two modes are actually different', () => {
    const differing = (Object.keys(light) as (keyof SemanticColors)[]).filter(
      (k) => light[k] !== dark[k],
    );
    expect(differing.length).toBeGreaterThan(20);
  });

  it('forMode() returns the right set', () => {
    expect(forMode('light')).toBe(light);
    expect(forMode('dark')).toBe(dark);
  });
});

/**
 * Contrast contract.
 *
 * `min` is the WCAG threshold that pair must meet. Pairs currently BELOW their
 * threshold are listed in KNOWN_BELOW with the ratio measured at the time — the
 * test asserts they have not got *worse*, so existing debt is tracked rather
 * than hidden, and a regression still fails the build.
 *
 * When you fix one, delete its KNOWN_BELOW entry; the test will then enforce
 * the real threshold and tell you if it slips back.
 */
const AA_TEXT = 4.5;
const AA_LARGE = 3;
const NON_TEXT = 3; // WCAG 1.4.11 / 2.4.11 — UI components and focus indicators

type Pair = { name: string; fg: string; bg: string; min: number; base?: string };

const pairs = (c: SemanticColors, mode: string): Pair[] => [
  { name: `${mode}: text on surface`, fg: c.text, bg: c.surface, min: AA_TEXT },
  { name: `${mode}: text on background`, fg: c.text, bg: c.background, min: AA_TEXT },
  { name: `${mode}: textMuted on surface`, fg: c.textMuted, bg: c.surface, min: AA_TEXT },
  { name: `${mode}: textSubtle on surface`, fg: c.textSubtle, bg: c.surface, min: AA_TEXT },
  { name: `${mode}: secondaryMuted on surface`, fg: c.secondaryMuted, bg: c.surface, min: AA_TEXT },
  {
    name: `${mode}: primaryActionText on primaryAction`,
    fg: c.primaryActionText,
    bg: c.primaryAction,
    min: AA_TEXT,
  },
  // surfaceDanger is translucent — composite it over the real surface first.
  {
    name: `${mode}: dangerText on surfaceDanger`,
    fg: c.dangerText,
    bg: c.surfaceDanger,
    min: AA_LARGE,
    base: c.surface,
  },
  // The one that shipped broken: a focus ring nobody could see.
  { name: `${mode}: focusRing on surface`, fg: c.focusRing, bg: c.surface, min: NON_TEXT },
  { name: `${mode}: focusRing on background`, fg: c.focusRing, bg: c.background, min: NON_TEXT },
];

/** Measured debt. Delete an entry when you fix it. */
const KNOWN_BELOW: Record<string, number> = {
  'light: textSubtle on surface': 4.49,
  'light: secondaryMuted on surface': 2.65,
};

describe('contrast', () => {
  const all = [...pairs(light, 'light'), ...pairs(dark, 'dark')];

  it.each(all)('$name', ({ name, fg, bg, min, base }) => {
    const ratio = contrast(fg, bg, base);
    const known = KNOWN_BELOW[name];
    if (known !== undefined) {
      // Tracked debt: must not regress, and must still actually be failing —
      // if it now passes, the entry is stale and should be removed.
      expect(ratio, `${name} regressed below its recorded ${known}`).toBeGreaterThanOrEqual(known);
      expect(ratio, `${name} now passes ${min} — delete it from KNOWN_BELOW`).toBeLessThan(min);
      return;
    }
    expect(ratio, `${name} is ${ratio}, needs ${min}`).toBeGreaterThanOrEqual(min);
  });
});

describe('component tokens', () => {
  it.each(['light', 'dark'] as const)('%s pill labels are legible on their own surface', (mode) => {
    const t = componentsForMode(mode).pill;
    const c = forMode(mode);
    // Resting pill: on dark the background is transparent, so the real
    // backdrop is the surface behind it.
    const restingBg = t.background === 'transparent' ? c.surface : t.background;
    expect(contrast(t.label, restingBg, c.surface)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrast(t.labelSelected, t.backgroundSelected, c.surface)).toBeGreaterThanOrEqual(
      AA_TEXT,
    );
  });

  it('exposes the same component keys in both modes', () => {
    expect(Object.keys(componentsForMode('light').pill).sort()).toEqual(
      Object.keys(componentsForMode('dark').pill).sort(),
    );
  });
});
