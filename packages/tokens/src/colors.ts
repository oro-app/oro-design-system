// ─────────────────────────────────────────────────────────────────────────────
// COMPATIBILITY SHIM — the flat pre-tier color API.
//
// @deprecated Prefer the tiered imports:
//   primitives.ts (tier 1) → semantic.ts (tier 2) → components.ts (tier 3)
//
// Every name below resolves to the EXACT value it did before the tier split.
// That is deliberate and load-bearing: @oro/web's generated CSS, the Tailwind
// preset, and the Storybook visual baselines all read these, so drift here
// would move shipped pixels. `scripts/assert-inert.ts` asserts byte-equality
// against a snapshot — if you change a value here it will fail, and it is right
// to fail.
//
// New code should import from `semantic` and flip modes via a `tone` prop,
// rather than reaching for the `*OnDark` / `brandRamp*` one-offs preserved here.
// ─────────────────────────────────────────────────────────────────────────────

import { palette, shiftLightness, withAlpha } from './primitives';
import { light } from './semantic';

export { palette, withAlpha, shiftLightness };

const p = palette;

export const colors = {
  ...p,

  // aliases matching the code's original semantic names
  primary: p.cream,
  secondary: p.plum,
  accent: p.gold,
  text: p.ink,
  background: p.paper,
  red: p.rose,

  // surfaces
  surface: light.surface,
  surfaceMuted: light.surfaceMuted,
  surfaceSoft: light.surfaceSoft,
  surfaceAccent: light.surfaceAccent,
  surfaceDanger: light.surfaceDanger,
  surfaceInverse: light.surfaceInverse,
  surfaceInverseText: light.surfaceInverseText,

  // borders
  border: light.border,
  borderStrong: light.borderStrong,
  borderHairline: light.borderHairline,

  // primary action
  primaryAction: light.primaryAction,
  primaryActionText: light.primaryActionText,
  primaryActionDisabled: light.primaryActionDisabled,
  primaryActionDisabledText: light.primaryActionDisabledText,

  // hover (web / landing only — RN has no hover, it uses pressed)
  primaryActionHover: light.primaryActionHover,
  /** @deprecated use `semantic.dark` via a `tone` prop. */
  primaryActionHoverOnDark: shiftLightness(p.plum, 1.5),
  hoverTint: light.hoverTint,
  dangerSurfaceHover: light.dangerSurfaceHover,

  // focus (web only — keyboard :focus-visible ring; gold reads on plum and cream)
  focusRing: light.focusRing,

  // secondary action
  secondaryAction: light.secondaryAction,
  secondaryActionText: light.secondaryActionText,
  secondaryActionIcon: light.secondaryActionIcon,
  secondaryActionBorder: light.secondaryActionBorder,

  // selection
  selection: light.selection,
  selectionBorder: light.selectionBorder,

  // text
  accentText: light.accentText,
  textMuted: light.textMuted,
  textSubtle: light.textSubtle,
  secondaryMuted: light.secondaryMuted,

  // danger (destructive)
  dangerText: light.dangerText,
  dangerBorder: light.dangerBorder,

  // misc / effects
  progressTrack: light.progressTrack,
  shadow: light.shadow,
  overlay: light.overlay,
  overlayStrong: light.overlayStrong,

  // Brand-moment gradient stops.
  // These are STOPS IN A BAKED RADIAL GRADIENT (assets/welcome-bg.png), not
  // surface roles — which is why they stayed here rather than moving into
  // `semantic.dark`'s role vocabulary. Regenerate the asset if plum changes.
  brandRampTop: shiftLightness(p.plum, 1.28),
  brandRamp: shiftLightness(p.plum, 0.86),
  brandRampDeep: shiftLightness(p.plum, 0.57),
  brandRampBlack: shiftLightness(p.plum, 0.47),
  brandInk: p.plum,
  brandGold: p.gold,
  brandCream: p.paper,
} as const;

export type ColorToken = keyof typeof colors;
