// Oro spacing tokens (mirrors oro-mobile-refresh/src/lib/style/spacing.ts).

export const compactSpacing = {
  xs: 4,
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  xxl: 36,
} as const;

export const regularSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/** Default resolved spacing (regular). `xxl` is the section-break rhythm. */
export const spacing = regularSpacing;

export type SpacingToken = keyof typeof regularSpacing;
