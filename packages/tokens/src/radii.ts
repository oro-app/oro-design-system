// Oro radius tokens (mirrors oro-mobile-refresh/src/lib/style/radii.ts).
// Editorial convention: hero/primary CTA = none (square is on-brand);
// cards/media/sheets = lg–xl; pills/chips/avatars = pill.

export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
} as const;

export type RadiiToken = keyof typeof radii;
