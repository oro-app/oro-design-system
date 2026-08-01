export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radii';
export * from './elevation';
export * from './motion';

import { colors } from './colors';
import { fonts, typography, brandTypography, lineHeights, letterSpacing } from './typography';
import { spacing } from './spacing';
import { radii } from './radii';
import { elevation } from './elevation';
import { motion } from './motion';

/** The whole Oro token set in one object. */
export const tokens = {
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
