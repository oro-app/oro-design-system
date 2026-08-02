// Oro typography tokens (mirrors oro-mobile-refresh/src/lib/style/font.ts).
// The responsive compact/regular resolution stays app-side; the package exports
// both scales plus the resolved regular scale as the default.

export const fonts = {
  // v2 editorial system
  frauncesLight: 'Fraunces-Light',
  fraunces: 'Fraunces-Regular',
  frauncesMedium: 'Fraunces-Medium',
  frauncesSemiBold: 'Fraunces-SemiBold',
  frauncesItalic: 'Fraunces-Italic',
  frauncesMediumItalic: 'Fraunces-MediumItalic',
  inter: 'Inter-Regular',
  interMedium: 'Inter-Medium',
  interSemiBold: 'Inter-SemiBold',
  // legacy — phasing out, do not use in new work
  title: 'Cormorant-SemiBold',
  serif: 'Cormorant-Regular',
  sans: 'HelveticaNeueRoman',
  sansLight: 'HelveticaNeueLight',
  sansBold: 'HelveticaNeueBold',
} as const;

export const compactTypography = {
  display: 40,
  title: 32,
  heading: 22,
  large: 16,
  default: 14,
  subtext: 13,
  tabs: 11,
  micro: 10,
} as const;

export const regularTypography = {
  display: 48,
  title: 36,
  heading: 24,
  large: 18,
  default: 16,
  subtext: 14,
  tabs: 12,
  micro: 11,
} as const;

/** Default resolved scale (regular). Apps may swap to compact on small devices. */
export const typography = regularTypography;

/** Brand-moment type — fixed, non-responsive (welcome screen / dark interstitials). */
export const brandTypography = {
  tagline: 21,
  taglineSmall: 18,
  cta: 19,
  secondaryLabel: 13.5,
  secondaryLink: 14.5,
} as const;

export const lineHeights = {
  tight: 1.05,
  snug: 1.2,
  normal: 1.4,
  relaxed: 1.55,
  loose: 1.7,
} as const;

// No wide-tracking steps: the brand forbids all-caps + wide letter-spacing
// (see CLAUDE.md). `wide` is a subtle optical nudge, nothing more.
export const letterSpacing = {
  tight: -0.4,
  normal: 0,
  wide: 0.4,
} as const;

export type TypographyToken = keyof typeof regularTypography;
export type LineHeightToken = keyof typeof lineHeights;
export type LetterSpacingToken = keyof typeof letterSpacing;
