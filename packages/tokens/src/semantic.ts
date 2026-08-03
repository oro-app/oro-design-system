// ─────────────────────────────────────────────────────────────────────────────
// TIER 2 — SEMANTIC
//
// Roles, not values: "the primary action", not "plum". This is the layer
// components consume, and the only layer that knows about light vs dark.
//
// Every value here references TIER 1. Never hand-write a hex in this file.
//
// The two modes are a real pair, not a light theme plus a handful of `*OnDark`
// escape hatches. `mode: 'dark'` is what the brand-moment surfaces (welcome,
// onboarding interstitials, the landing's plum sections) resolve against.
// ─────────────────────────────────────────────────────────────────────────────

import { contrastShift, palette, ramps, shiftLightness, withAlpha } from './primitives';

const p = palette;

/**
 * Accent text has to clear AA for normal text (4.5:1), and 4.8 is deliberate
 * headroom over it: the binding ground is `background` (paper), and the value
 * measures 4.54:1 on the warmest light surface we ship (`cream`). Solving to a
 * bare 4.5 would leave cream a rounding error from failing. Do not lower it.
 */
const ACCENT_TEXT_MIN_CONTRAST = 4.8;

/**
 * How much of the base gold's chroma the darkened accent keeps.
 *
 * A tuning constant, in the same spirit as `HUE_RETENTION` in primitives.ts,
 * and chosen for a measured reason rather than by eye: at 0.87 the solve lands
 * #8D691D, which is ΔE2000 **1.30** from `#8A6A21` — the hand-picked gold the
 * landing has been shipping as accent text for months, and comfortably inside
 * the ~2.3 just-noticeable difference for text. So the system's derived value
 * reproduces the shipped pixel instead of overriding it. At 1.0 the solve gives
 * #906800 (C* 54.4, ΔE2000 3.46) — constant-free but visibly more saturated
 * than anything on the site today.
 */
const ACCENT_CHROMA_RETENTION = 0.87;

/**
 * The on-dark accent, solved the same way the light one is — and the last role
 * in this file that was NOT mode-split. Both modes held plain `palette.gold`.
 *
 * Base gold is legible on plum (6.16:1 on `surface`) but it is the *light*
 * mode's value doing double duty, and on a deep plum ground it reads dull:
 * against a dark surround the eye wants more chroma, not the same. The landing
 * noticed first and hand-picked `#EEBA2B` for its hero — a gold the system had
 * no way to express, because it is not a lighter gold, it is a MORE SATURATED
 * one (C* 73.0 vs 49.6). No ramp step reaches it: gold[300] measures a fine
 * 7.66:1 on plum but at C* 36.0 it is a pale cream-gold, i.e. exactly the
 * "washed out" failure restated.
 *
 * So: hold gold's hue, amplify chroma toward the sRGB cusp (`chromaFactor` > 1,
 * which is what `contrastShift` documents this case for), and solve lightness
 * up to the floor below. Result `#F0B638` — 7.41:1 on `surface`, 10.18:1 on
 * `background`, C* 68.6, and ΔE2000 **2.67** from the `#EEBA2B` the landing
 * ships today: inside the ~2.3–3 JND, so the derived token reproduces the
 * shipped pixel instead of overriding it, exactly as `light.accentText` does
 * for `#8A6A21`.
 *
 * The two constants, so the next person doesn't retune them blind:
 * - 7.4 is AAA for normal text (7:1) plus headroom, measured on `surface`
 *   (plum[800]) because that is the LIGHTER of the two dark grounds and
 *   therefore the binding one.
 * - 1.3 is the chroma amplification that lands the ΔE inside the JND of the
 *   shipped hex. At 1.0 the solve stays at C* 48.9 and reads as the same dull
 *   gold; past ~1.5 it clamps at the cusp (#F6B400) and goes orange.
 */
const DARK_ACCENT_MIN_CONTRAST = 7.4;
const DARK_ACCENT_CHROMA_GAIN = 1.3;
const darkAccent = contrastShift(p.gold, {
  on: ramps.plum[800],
  minContrast: DARK_ACCENT_MIN_CONTRAST,
  chromaFactor: DARK_ACCENT_CHROMA_GAIN,
});

/** Which surface a component is sitting on. Components take this as a `tone` prop. */
export type Mode = 'light' | 'dark';

/** The role vocabulary. Both modes implement all of it — that's what makes
 *  `tone` safe to flip on any component. */
export type SemanticColors = {
  // surfaces
  surface: string;
  surfaceMuted: string;
  surfaceSoft: string;
  surfaceAccent: string;
  surfaceDanger: string;
  surfaceInverse: string;
  surfaceInverseText: string;
  background: string;

  // borders
  border: string;
  borderStrong: string;
  borderHairline: string;

  // text
  text: string;
  textMuted: string;
  textSubtle: string;
  secondaryMuted: string;
  accentText: string;

  // primary action
  primaryAction: string;
  primaryActionText: string;
  primaryActionDisabled: string;
  primaryActionDisabledText: string;
  primaryActionHover: string;
  primaryActionPressed: string;

  // secondary action
  secondaryAction: string;
  secondaryActionText: string;
  secondaryActionIcon: string;
  secondaryActionBorder: string;

  // ghost / tertiary
  hoverTint: string;

  // selection
  selection: string;
  selectionBorder: string;

  // danger
  danger: string;
  dangerText: string;
  dangerBorder: string;
  dangerSurfaceHover: string;

  // focus (keyboard :focus-visible — gold reads on both plum and cream)
  focusRing: string;

  // accent
  accent: string;

  // misc / effects
  progressTrack: string;
  shadow: string;
  overlay: string;
  overlayStrong: string;
};

/** Default mode — cream/paper surfaces, plum ink. The app's everyday state. */
export const light: SemanticColors = {
  surface: p.white,
  surfaceMuted: withAlpha(p.plum, '12'),
  surfaceSoft: withAlpha(p.plum, '08'),
  surfaceAccent: withAlpha(p.gold, '26'),
  surfaceDanger: withAlpha(p.rose, '14'),
  surfaceInverse: p.plum,
  surfaceInverseText: p.white,
  background: p.paper,

  border: withAlpha(p.plum, '1F'),
  borderStrong: withAlpha(p.plum, '4A'),
  borderHairline: withAlpha(p.plum, '14'),

  text: p.ink,
  textMuted: p.plum,
  textSubtle: withAlpha(p.plum, 'A6'),
  secondaryMuted: withAlpha(p.plum, '75'),
  // Gold, dark enough to read as small text on a light ground — the one thing
  // the system could not previously express. This slot used to hold `ink`,
  // which is not an accent at all; it was a placeholder nothing consumed.
  //
  // DERIVED, not picked: hold gold's hue, keep 87% of its chroma, and solve
  // lightness down until it clears 4.8:1 on paper. Result #8D691D — 4.80:1 on
  // `background`, 4.95:1 on `surface`, 4.54:1 on cream, C* 46.0 (vs base gold's
  // 49.7 and gold[600]'s 33.9). It tracks the palette: move `gold` or `paper`
  // and the accent follows instead of going quietly non-compliant.
  //
  // Note this is NOT a ramp step. gold[600] is the closest one and it fails at
  // 4.27:1 precisely because ramps mix toward near-achromatic anchors and shed
  // chroma on the way down — it reads brown. A ramp is a surface scale; this is
  // a text role, so it gets solved for its requirement.
  accentText: contrastShift(p.gold, {
    on: p.paper,
    minContrast: ACCENT_TEXT_MIN_CONTRAST,
    chromaFactor: ACCENT_CHROMA_RETENTION,
  }),

  primaryAction: p.plum,
  primaryActionText: p.white,
  primaryActionDisabled: withAlpha(p.plum, '29'),
  primaryActionDisabledText: p.plum,
  // One clear lightness step — hover must be perceptible, not a guess.
  // Deliberately the pre-ramp derivation, NOT ramps.plum[700]: this value ships
  // today and the ramp step is visibly lighter (#503D59 vs #33213E). Introducing
  // the ramps must not move a pixel. Revisit as a considered design change.
  primaryActionHover: shiftLightness(palette.plum, 0.88),
  primaryActionPressed: ramps.plum[900],

  secondaryAction: p.white,
  secondaryActionText: p.ink,
  secondaryActionIcon: p.plum,
  secondaryActionBorder: withAlpha(p.plum, '33'),

  hoverTint: withAlpha(p.plum, '12'),

  selection: withAlpha(p.plum, '1E'),
  selectionBorder: p.plum,

  danger: p.rose,
  dangerText: p.rose,
  dangerBorder: withAlpha(p.rose, '52'),
  dangerSurfaceHover: withAlpha(p.rose, '20'),

  // WCAG 2.4.11 requires a focus indicator to hit 3:1 against the surface it
  // sits on. The brand gold at 70% alpha composited to 1.70:1 on cream —
  // technically present, visually invisible. Even solid `gold` only reaches
  // 2.17:1, so the light ring cannot be the base gold at any opacity.
  // gold[600] is 4.41:1 on `surface` and 4.27:1 on `background`, and still
  // reads unmistakably gold rather than falling back to plum.
  focusRing: ramps.gold[600],

  accent: p.gold,

  progressTrack: withAlpha(p.plum, '1A'),
  shadow: p.plum,
  overlay: withAlpha(p.ink, '66'),
  overlayStrong: withAlpha(p.ink, 'C7'),
};

/**
 * Brand-moment / on-dark mode. Deep plum surfaces, cream ink.
 *
 * This subsumes what used to be scattered one-off tokens — `brandRamp*`,
 * `primaryActionHoverOnDark` — into the same role vocabulary as `light`, so a
 * component flips wholesale via `tone` instead of reaching for a special case.
 */
export const dark: SemanticColors = {
  surface: ramps.plum[800],
  surfaceMuted: withAlpha(p.paper, '12'),
  surfaceSoft: withAlpha(p.paper, '08'),
  surfaceAccent: withAlpha(p.gold, '2E'),
  surfaceDanger: withAlpha(p.rose, '2E'),
  surfaceInverse: p.paper,
  surfaceInverseText: p.plum,
  background: ramps.plum[900],

  border: withAlpha(p.paper, '2E'),
  borderStrong: withAlpha(p.paper, '5C'),
  borderHairline: withAlpha(p.paper, '1F'),

  text: p.paper,
  textMuted: withAlpha(p.paper, 'D9'),
  textSubtle: withAlpha(p.paper, 'B3'),
  secondaryMuted: withAlpha(p.paper, '8C'),
  // Mode-split, not shared with `light` — see `darkAccent` above.
  accentText: darkAccent,

  // On plum, the primary action inverts to cream — a darker plum would vanish.
  primaryAction: p.paper,
  primaryActionText: p.plum,
  primaryActionDisabled: withAlpha(p.paper, '29'),
  primaryActionDisabledText: withAlpha(p.paper, '8C'),
  primaryActionHover: p.white,
  primaryActionPressed: ramps.gold[100],

  secondaryAction: 'transparent',
  secondaryActionText: p.paper,
  secondaryActionIcon: p.paper,
  secondaryActionBorder: withAlpha(p.paper, '4A'),

  hoverTint: withAlpha(p.paper, '14'),

  selection: withAlpha(p.paper, '1F'),
  selectionBorder: p.paper,

  danger: ramps.rose[300],
  dangerText: ramps.rose[200],
  dangerBorder: withAlpha(ramps.rose[300], '7A'),
  dangerSurfaceHover: withAlpha(p.rose, '3D'),

  focusRing: withAlpha(p.gold, 'D9'),

  // Deliberately the same value as `accentText` above. `accent` can be a fill
  // or a rule and only owes 3:1, so it could be pushed further — but one gold
  // per mode is the point, and this one already clears 7.4:1 as text. Kept as a
  // single const so the two can never drift.
  accent: darkAccent,

  progressTrack: withAlpha(p.paper, '24'),
  shadow: ramps.plum[900],
  overlay: withAlpha(p.ink, '8C'),
  overlayStrong: withAlpha(p.ink, 'DB'),
};

export const semantic = { light, dark } as const;

/** Resolve a role set for a mode. Components call this once from their `tone` prop. */
export function forMode(mode: Mode): SemanticColors {
  return semantic[mode];
}

export default semantic;
