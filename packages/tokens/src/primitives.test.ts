import { describe, expect, it } from 'vitest';
import { RAMP_STEPS, mix, palette, ramp, ramps, shiftLightness, withAlpha } from './primitives';
import { luminance } from './testUtils';

/** Where each brand hex is pinned in its ramp. Changing these is a design decision. */
const BASE_STEP = { plum: 800, gold: 400, rose: 500 } as const;

describe('mix()', () => {
  it('returns the endpoints exactly at t=0 and t=1', () => {
    expect(mix('#3A2646', '#FFF9ED', 0)).toBe('#3A2646');
    expect(mix('#3A2646', '#FFF9ED', 1)).toBe('#FFF9ED');
  });

  it('clamps t outside [0,1] rather than extrapolating', () => {
    expect(mix('#3A2646', '#FFF9ED', -5)).toBe('#3A2646');
    expect(mix('#3A2646', '#FFF9ED', 5)).toBe('#FFF9ED');
  });

  it('is symmetric — mix(a,b,t) === mix(b,a,1-t)', () => {
    for (const t of [0.15, 0.4, 0.75]) {
      expect(mix(palette.plum, palette.gold, t)).toBe(mix(palette.gold, palette.plum, 1 - t));
    }
  });

  it('moves monotonically in luminance between two endpoints', () => {
    const ys = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => luminance(mix(palette.plum, palette.paper, t)));
    for (let i = 1; i < ys.length; i++) expect(ys[i]!).toBeGreaterThan(ys[i - 1]!);
  });

  it('does not interpolate in naive sRGB', () => {
    // Guards the OKLab implementation: a channel-wise sRGB average is a
    // different colour. Direction is deliberately NOT asserted — perceptual
    // midpoints are not simply lighter or darker than sRGB ones, and asserting
    // that was wrong the first time. What matters is that we are not doing the
    // naive thing.
    const srgbAvg =
      '#' +
      [1, 3, 5]
        .map((i) =>
          Math.round(
            (parseInt(palette.plum.slice(i, i + 2), 16) +
              parseInt(palette.paper.slice(i, i + 2), 16)) /
              2,
          )
            .toString(16)
            .padStart(2, '0'),
        )
        .join('')
        .toUpperCase();
    expect(mix(palette.plum, palette.paper, 0.5)).not.toBe(srgbAvg);
  });
});

describe('ramp()', () => {
  it('emits exactly the declared steps', () => {
    expect(Object.keys(ramp(palette.plum, 800)).map(Number)).toEqual([...RAMP_STEPS]);
  });

  it.each(Object.entries(BASE_STEP))(
    '%s pins its brand hex EXACTLY at its base step',
    (family, step) => {
      const brand = palette[family as keyof typeof BASE_STEP];
      expect(ramps[family as keyof typeof BASE_STEP][step as 800]).toBe(brand.toUpperCase());
    },
  );

  it.each(Object.keys(ramps))('%s descends monotonically in luminance 50 → 900', (family) => {
    const ys = RAMP_STEPS.map((s) => luminance(ramps[family as 'plum'][s]));
    for (let i = 1; i < ys.length; i++) {
      expect(ys[i]!, `step ${RAMP_STEPS[i]} is not darker than ${RAMP_STEPS[i - 1]}`).toBeLessThan(
        ys[i - 1]!,
      );
    }
  });

  it.each(Object.keys(ramps))('%s never collapses to pure black or white', (family) => {
    const r = ramps[family as 'plum'];
    expect(r[50]).not.toBe('#FFFFFF');
    expect(r[900]).not.toBe('#000000');
  });

  it('retains hue at the dark end instead of going neutral', () => {
    // Regression: shading all the way to ink produced #0F0E10 for plum[900] —
    // an anonymous near-black. HUE_RETENTION keeps the plum visible.
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(ramps.plum[900].slice(i, i + 2), 16));
    expect(b!).toBeGreaterThan(g!); // still violet-leaning, not grey
    expect(r!).toBeGreaterThan(g!);
  });

  it('produces distinct values at every step', () => {
    for (const family of Object.keys(ramps)) {
      const vals = RAMP_STEPS.map((s) => ramps[family as 'plum'][s]);
      expect(new Set(vals).size, `${family} has duplicate steps`).toBe(vals.length);
    }
  });
});

describe('shiftLightness()', () => {
  it('is retained only for the brand-gradient stops, and still reproduces them', () => {
    expect(shiftLightness(palette.plum, 1.28)).toBe('#4a315a');
    expect(shiftLightness(palette.plum, 0.47)).toBe('#1b1221');
  });

  it('DOCUMENTS why it cannot build ramps: it clips mid-lightness hues to white', () => {
    // This is the defect that forced the OKLab rewrite. If this ever stops
    // being true the comment in primitives.ts is stale.
    expect(shiftLightness(palette.gold, 2.2)).toBe('#ffffff');
    expect(shiftLightness(palette.rose, 2.2)).toBe('#ffffff');
    expect(shiftLightness(palette.plum, 2.2)).not.toBe('#ffffff'); // dark base is fine
  });
});

describe('withAlpha()', () => {
  it('appends the suffix without touching the base', () => {
    expect(withAlpha('#3A2646', '12')).toBe('#3A264612');
  });
});
