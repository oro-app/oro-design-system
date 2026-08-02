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

import { palette, ramps, shiftLightness, withAlpha } from './primitives';

const p = palette;

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
  accentText: p.ink,

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
  accentText: p.gold,

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

  accent: p.gold,

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
