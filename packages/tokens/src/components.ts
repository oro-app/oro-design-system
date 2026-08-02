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
    labelDisabled: c.primaryActionDisabled,
  };
}

export type ComponentTokens = {
  pill: PillColors;
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
