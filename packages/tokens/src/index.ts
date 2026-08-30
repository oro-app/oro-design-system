// Oro design tokens.
//
// Three tiers, one-way flow — primitive → semantic → component. Consume the
// highest tier that answers your question, and never reach past it:
//
//   primitives  raw values (ramps, brand hexes). Internal to this package.
//   semantic    roles, resolved per mode (light/dark). ← what components use
//   components  per-component values, resolved per mode.
//
// `colors` is the pre-tier flat API, kept as a deprecated compatibility shim.

export * from './primitives';
export * from './semantic';
export * from './components';
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radii';
export * from './elevation';
export * from './motion';

import { primitives } from './primitives';
import { semantic, forMode } from './semantic';
import {
  components,
  buttonSizes,
  pillSizes,
  tabBarGeometry,
  badgeGeometry,
  toastGeometry,
} from './components';
import { colors } from './colors';
import { fonts, typography, brandTypography, lineHeights, letterSpacing } from './typography';
import { spacing } from './spacing';
import { radii } from './radii';
import { elevation } from './elevation';
import { motion } from './motion';

/** The whole Oro token set in one object. */
export const tokens = {
  primitives,
  semantic,
  components,
  buttonSizes,
  pillSizes,
  tabBarGeometry,
  badgeGeometry,
  toastGeometry,
  forMode,
  /** @deprecated flat pre-tier API — prefer `semantic`. */
  colors,
  fonts,
  typography,
  brandTypography,
  lineHeights,
  letterSpacing,
  spacing,
  radii,
  elevation,
  motion,
} as const;

export default tokens;
