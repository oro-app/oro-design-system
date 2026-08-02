// ─────────────────────────────────────────────────────────────────────────────
// TIER 1 — PRIMITIVES
//
// Raw values with no meaning attached. These are the "what", never the "why".
// NOTHING outside packages/tokens should import this file: components consume
// TIER 2 (semantic.ts), which is the layer that carries intent and themes.
//
// Every ramp step is DERIVED from a brand base hex — no ramp value is ever
// hand-written. That's what keeps "one plum, one gold, one rose" true as the
// system grows.
// ─────────────────────────────────────────────────────────────────────────────

/** The seven fixed brand values. Everything else in the system derives from these. */
export const palette = {
  cream: '#FFF2D7',
  plum: '#3A2646', // the brand ink — does ~90% of the work
  gold: '#D4A853', // the single accent
  ink: '#0B0B0B',
  paper: '#FFF9ED',
  white: '#FFFDF8',
  rose: '#A84E5C', // destructive
} as const;

// ── color math ───────────────────────────────────────────────────────────────
// Interpolation happens in OKLab, not sRGB. sRGB mixing darkens and muddies the
// middle of a ramp (the classic grey-mud problem); OKLab is perceptually uniform,
// so the steps read as evenly spaced. ~60 lines of matrix math, zero deps.

type Rgb = { r: number; g: number; b: number };
type Lab = { L: number; a: number; b: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function hexToRgb(hex: string): Rgb {
  return {
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const c = (v: number) =>
    Math.round(clamp01(v) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

/** sRGB gamma → linear light. */
const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
/** Linear light → sRGB gamma. */
const toGamma = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

function rgbToOklab({ r, g, b }: Rgb): Lab {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

function oklabToRgb({ L, a, b }: Lab): Rgb {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  return {
    r: toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  };
}

/**
 * Perceptually blend two hex colors. `t` is how far to travel from `a` to `b`
 * (0 = a, 1 = b). Used to build every ramp step.
 */
export function mix(a: string, b: string, t: number): string {
  const A = rgbToOklab(hexToRgb(a));
  const B = rgbToOklab(hexToRgb(b));
  const k = clamp01(t);
  return rgbToHex(
    oklabToRgb({
      L: A.L + (B.L - A.L) * k,
      a: A.a + (B.a - A.a) * k,
      b: A.b + (B.b - A.b) * k,
    }),
  );
}

/** Append an 8-bit hex alpha suffix (e.g. withAlpha('#3A2646', '12')). */
export function withAlpha(hexColor: string, alphaHex: string): string {
  return `${hexColor}${alphaHex}`;
}

/**
 * Scale a hex color's HSL lightness by `factor`.
 *
 * RETAINED FOR THE EXISTING BRAND-MOMENT RAMP ONLY. Do not build new ramps with
 * this — multiplicative lightness blows out to pure white for any base that
 * isn't already dark (gold at L=58% and rose at L=48% both clip to #FFFFFF well
 * before the light end of a ramp). Use `ramp()` / `mix()` instead.
 */
export function shiftLightness(hexColor: string, factor: number): string {
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  const nl = clamp01(l * factor);
  const q = nl < 0.5 ? nl * (1 + s) : nl + s - nl * s;
  const p = 2 * nl - q;
  const hue = (t0: number) => {
    let t = t0;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const to255 = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to255(hue(h + 1 / 3))}${to255(hue(h))}${to255(hue(h - 1 / 3))}`;
}

// ── ramps ────────────────────────────────────────────────────────────────────

export const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export type RampStep = (typeof RAMP_STEPS)[number];
export type Ramp = Record<RampStep, string>;

/** Ramp bounds, named rather than indexed off the tuple so the ends are explicit. */
const LIGHTEST_STEP = 50;
const DARKEST_STEP = 900;

/**
 * Tints run toward `paper` and shades toward `ink` — NOT toward white and black.
 * Warm anchors keep the light end of every ramp warm instead of chalky, which is
 * what makes the ramps read as Oro rather than as a generic UI kit.
 */
const TINT_ANCHOR = palette.paper;

/**
 * Shades run toward ink that still carries a trace of the hue (15%), not toward
 * pure ink. Travelling all the way to ink strips the hue out of the dark end —
 * plum[900] came out `#0F0E10`, an anonymous near-black, where the brand's
 * established deep plum is `#1B1221`. Keeping 15% of the base holds the hue at
 * the bottom of every ramp.
 */
const HUE_RETENTION = 0.15;
const shadeAnchor = (base: string) => mix(palette.ink, base, HUE_RETENTION);

/** How close the extreme steps get to their anchor. Short of 1 so 50 never
 *  collides with `paper` and 900 never collapses to flat black. */
const MAX_TINT = 0.94;
const MAX_SHADE = 0.9;

/**
 * Build a 50–900 ramp around a brand base.
 *
 * The base hex is pinned EXACTLY at `baseStep` — ramps are generated around the
 * brand color, never over it, so adding ramps can never shift a shipped pixel.
 * Steps lighter than the base interpolate toward paper; darker toward ink.
 */
export function ramp(base: string, baseStep: RampStep): Ramp {
  const out = {} as Ramp;
  const lightSpan = baseStep - LIGHTEST_STEP;
  const darkSpan = DARKEST_STEP - baseStep;
  const dark = shadeAnchor(base);

  for (const step of RAMP_STEPS) {
    if (step === baseStep) {
      out[step] = base.toUpperCase();
    } else if (step < baseStep) {
      out[step] = mix(base, TINT_ANCHOR, ((baseStep - step) / lightSpan) * MAX_TINT);
    } else {
      out[step] = mix(base, dark, ((step - baseStep) / darkSpan) * MAX_SHADE);
    }
  }
  return out;
}

/**
 * The tonal ramps.
 *
 * Base steps are chosen so each brand hex lands where its lightness naturally
 * sits — plum is dark (800), gold is light-mid (400), rose is mid (500).
 *
 * NOTE: `plum[100]`–`plum[300]` are pale violets. These are TINTS OF THE BRAND
 * PLUM, derived by `mix()`. They are not a reintroduction of the `lilac` hue
 * that was cut from the palette — that was a separate, undeclared hue. Deriving
 * every purple from the one plum is exactly the point of the ramp.
 */
export const ramps = {
  plum: ramp(palette.plum, 800),
  gold: ramp(palette.gold, 400),
  rose: ramp(palette.rose, 500),
  /** Warm grey. Anchored at the midpoint of ink→paper so it stays warm rather
   *  than going flat neutral-grey. */
  neutral: ramp(mix(palette.ink, palette.paper, 0.5), 500),
} as const;

export type RampFamily = keyof typeof ramps;

/** Everything in tier 1, one object. A DTCG emitter is a pure function over this. */
export const primitives = { palette, ramps } as const;

export default primitives;
