import { describe, expect, it } from 'vitest';
import { ramps } from './primitives';
import { oroPreset } from './tailwind';

/**
 * Regression guard for a silent, high-blast-radius bug.
 *
 * The preset once registered `neutral`, `rose`, `border`, `background` and
 * `surface` as BARE keys under `theme.extend.colors`. Under `extend` those
 * override Tailwind's own scales in the consuming app: `text-neutral-500`
 * silently changes colour, and `neutral-950` — which Tailwind ships and our
 * ramp does not — becomes an undefined class that drops with no error.
 *
 * Nothing about that fails a build, which is exactly why it needs a test.
 */

/** Tailwind's own top-level colour names, which we must never shadow. */
const TAILWIND_BUILTIN_COLORS = [
  'inherit', 'current', 'transparent', 'black', 'white',
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal',
  'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose',
];

const colorKeys = Object.keys(oroPreset.theme.extend.colors);

describe('tailwind preset', () => {
  it('namespaces every colour key under `oro`', () => {
    const unprefixed = colorKeys.filter((k) => k !== 'oro' && !k.startsWith('oro-'));
    expect(unprefixed, 'unprefixed keys will override Tailwind scales').toEqual([]);
  });

  it('shadows none of Tailwind\u2019s built-in colour names', () => {
    const collisions = colorKeys.filter((k) => TAILWIND_BUILTIN_COLORS.includes(k));
    expect(collisions).toEqual([]);
  });

  it('exposes the full ramps, not just the base hexes', () => {
    for (const family of ['plum', 'gold', 'rose', 'neutral'] as const) {
      const key = `oro-${family}` as keyof typeof oroPreset.theme.extend.colors;
      expect(oroPreset.theme.extend.colors[key], `oro-${family} missing`).toEqual(ramps[family]);
    }
  });

  it('keeps `oro.plum` and `oro-plum-800` identical (the base hex is pinned)', () => {
    const { colors } = oroPreset.theme.extend;
    const base = (colors.oro as Record<string, string>).plum;
    const step800 = (colors['oro-plum'] as Record<number, string>)[800];
    expect(base).toBeDefined();
    expect(step800).toBeDefined();
    expect(base!.toUpperCase()).toBe(step800);
  });

  it('namespaces spacing and radii too', () => {
    const { spacing, borderRadius } = oroPreset.theme.extend;
    for (const k of Object.keys(spacing)) expect(k.startsWith('oro-')).toBe(true);
    for (const k of Object.keys(borderRadius)) expect(k.startsWith('oro-')).toBe(true);
  });
});
