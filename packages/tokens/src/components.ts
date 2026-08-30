// ─────────────────────────────────────────────────────────────────────────────
// TIER 3 — COMPONENT TOKENS
//
// Per-component values, resolved per mode. Everything here references TIER 2.
//
// Keep this layer THIN. A component token earns its place only when a component
// genuinely diverges from the semantic role — if `button.background` is just
// `primaryAction`, the component should read the semantic token directly. This
// tier exists for the cases where the divergence is real (a pill's resting
// surface differs from a generic `surface`), not to mirror every role.
// ─────────────────────────────────────────────────────────────────────────────

import { mix } from './primitives';
import { radii } from './radii';
import { forMode, type Mode, type SemanticColors } from './semantic';

/** Non-color geometry shared by the sized components. Sizes are the `size` axis;
 *  `hero` is a separate prominence and deliberately not in this table. */
export const buttonSizes = {
  sm: { height: 44, paddingHorizontal: 16, fontSize: 13, gap: 6, iconSize: 16 },
  /** Matches the pre-size-axis Button exactly — existing usage is unaffected. */
  md: { height: 52, paddingHorizontal: 24, fontSize: 14, gap: 8, iconSize: 18 },
  lg: { height: 60, paddingHorizontal: 32, fontSize: 16, gap: 10, iconSize: 20 },
} as const;

export type ButtonSize = keyof typeof buttonSizes;

export const pillSizes = {
  sm: { paddingVertical: 6, paddingHorizontal: 16, fontSize: 12, gap: 6, iconSize: 14 },
  /** Matches the pre-size-axis Pill exactly. */
  md: { paddingVertical: 8, paddingHorizontal: 22, fontSize: 13, gap: 8, iconSize: 16 },
} as const;

export type PillSize = keyof typeof pillSizes;

/** Geometry for the app's bottom tab bar. No size axis: there is one bar per app, and it is not a scale. */
export const tabBarGeometry = {
  iconSize: 22,
  /** The dot marking the active tab. Icon-only tabs have no label to carry selection, so a second cue beyond color is required. */
  markSize: 4,
  markGap: 6,
  paddingVertical: 8,
  paddingHorizontal: 10,
  /** Apple's minimum touch target, which the icon plus its mark does not reach on its own. */
  tabMinHeight: 44,
  radius: radii.pill,
} as const;

/**
 * Geometry and dwell for the transient toast. No size axis: one message, one
 * height, and the caller positions it.
 */
export const toastGeometry = {
  /** How long the toast stays up before it dismisses itself. */
  dwell: 4000,
  /** How far the toast rises on entry, short enough to read as a settle rather than a slide. */
  enterDistance: 12,
  paddingVertical: 12,
  paddingHorizontal: 16,
  gap: 12,
  iconSize: 16,
  radius: radii.lg,
} as const;

/**
 * Geometry for the needs-attention badge. No size axis: the dot and the count
 * are one signal at two sizes, and which one renders follows from whether there
 * is a count, so a caller cannot ship a dot for a two-item state.
 */
export const badgeGeometry = {
  dotSize: 9,
  countPaddingVertical: 3,
  countPaddingHorizontal: 7,
  countMinWidth: 18,
  fontSize: 11,
  /** Counts above this render as `99+`, because a four-digit capsule breaks the layout. */
  maxCount: 99,
} as const;

/** Colors a Pill needs beyond the plain semantic roles. */
export type PillColors = {
  background: string;
  backgroundSelected: string;
  border: string;
  borderSelected: string;
  label: string;
  labelSelected: string;
  backgroundDisabled: string;
  labelDisabled: string;
};

function pillColors(c: SemanticColors, mode: Mode): PillColors {
  return {
    // On dark the resting pill is an outline, not a filled chip — a white
    // surface on plum reads as a card, not a filter.
    background: mode === 'light' ? c.secondaryAction : 'transparent',
    backgroundSelected: c.primaryAction,
    border: c.secondaryActionBorder,
    borderSelected: c.selectionBorder,
    label: c.textMuted,
    labelSelected: c.primaryActionText,
    backgroundDisabled: mode === 'light' ? c.surfaceSoft : 'transparent',
    // A *text* token, not `primaryActionDisabled` (a surface at 16% alpha).
    // The Pill also applies opacity 0.5 to its container, so a faint alpha here
    // compounds to ~8% and the label becomes unreadable — caught in the
    // Pill/Tone visual baseline.
    labelDisabled: c.primaryActionDisabledText,
  };
}

/**
 * Colors the third-party sign-in (provider) button needs beyond the plain
 * semantic roles.
 *
 * Scoped to that one job on purpose. The obvious alternative — a generic
 * `dark`/`ink` Button variant — reads as "use me for emphasis" and would be
 * reached for anywhere; this one names the situation it belongs to.
 *
 * The situation: Apple's `AppleAuthenticationButton` is mandatory (App Store
 * Guideline 4.8) and exposes only WHITE / WHITE_OUTLINE / BLACK, so Apple sets
 * the treatment and every sibling provider button has to match it. On a light
 * ground that means a near-black fill, which no semantic role names — a filled
 * `primaryAction` is plum and would duplicate the screen's hero CTA, and
 * `surfaceInverse` is plum too.
 */
export type ProviderButtonColors = {
  background: string;
  label: string;
  backgroundHover: string;
};

/**
 * Deliberately mode-agnostic: `text`/`background` already invert per mode, so
 * this resolves to ink-on-paper in light and paper-on-plum in dark without a
 * branch — which is also the correct pairing, since Apple's button flips to
 * WHITE on a dark ground for the same reason.
 */
function providerButtonColors(c: SemanticColors): ProviderButtonColors {
  return {
    background: c.text,
    label: c.background,
    // Hover is web-only, and must be a visible lightness step rather than a
    // guess — 14% toward the ground reads on both modes.
    backgroundHover: mix(c.text, c.background, 0.14),
  };
}

/**
 * The badge's fill is the plain `warning` role in both modes. Its count text is
 * the divergence that earns this a tier-3 entry: white works on the light fill
 * (5.88:1) but measures 2.17:1 on the dark one, because dark `warning` is the
 * base gold. On plum the readable pairing is the surface color itself (6.16:1),
 * so the text has to flip with the mode while the fill does not.
 */
export type BadgeColors = {
  background: string;
  countText: string;
};

function badgeColors(c: SemanticColors, mode: Mode): BadgeColors {
  return {
    background: c.warning,
    countText: mode === 'light' ? c.primaryActionText : c.surface,
  };
}

export type ComponentTokens = {
  pill: PillColors;
  providerButton: ProviderButtonColors;
  badge: BadgeColors;
  dropdown: {
    trigger: string;
    triggerBorder: string;
    label: string;
    value: string;
    placeholder: string;
    radius: number;
  };
};

/** Resolve every component's tokens for a mode. */
export function componentsForMode(mode: Mode): ComponentTokens {
  const c = forMode(mode);
  return {
    pill: pillColors(c, mode),
    providerButton: providerButtonColors(c),
    badge: badgeColors(c, mode),
    dropdown: {
      trigger: c.surface,
      triggerBorder: c.border,
      // Option A: quiet muted label, the value carries the focus.
      label: c.textSubtle,
      value: c.text,
      placeholder: c.secondaryMuted,
      radius: radii.lg,
    },
  };
}

export const components = {
  light: componentsForMode('light'),
  dark: componentsForMode('dark'),
} as const;

export default components;
