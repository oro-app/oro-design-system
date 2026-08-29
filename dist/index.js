import {
  RAMP_STEPS,
  colors,
  compactSpacing,
  contrastShift,
  dark,
  forMode,
  light,
  mix,
  palette,
  primitives,
  radii,
  ramp,
  ramps,
  regularSpacing,
  semantic,
  shiftLightness,
  spacing,
  withAlpha
} from "./chunk-SNALUFOR.js";

// src/components.ts
var buttonSizes = {
  sm: { height: 44, paddingHorizontal: 16, fontSize: 13, gap: 6, iconSize: 16 },
  /** Matches the pre-size-axis Button exactly — existing usage is unaffected. */
  md: { height: 52, paddingHorizontal: 24, fontSize: 14, gap: 8, iconSize: 18 },
  lg: { height: 60, paddingHorizontal: 32, fontSize: 16, gap: 10, iconSize: 20 }
};
var pillSizes = {
  sm: { paddingVertical: 6, paddingHorizontal: 16, fontSize: 12, gap: 6, iconSize: 14 },
  /** Matches the pre-size-axis Pill exactly. */
  md: { paddingVertical: 8, paddingHorizontal: 22, fontSize: 13, gap: 8, iconSize: 16 }
};
var tabBarGeometry = {
  iconSize: 22,
  /** The dot marking the active tab. Icon-only tabs have no label to carry selection, so a second cue beyond color is required. */
  markSize: 4,
  markGap: 6,
  paddingVertical: 8,
  paddingHorizontal: 10,
  /** Apple's minimum touch target, which the icon plus its mark does not reach on its own. */
  tabMinHeight: 44,
  radius: radii.pill
};
var badgeGeometry = {
  dotSize: 9,
  countPaddingVertical: 3,
  countPaddingHorizontal: 7,
  countMinWidth: 18,
  fontSize: 11,
  /** Counts above this render as `99+`, because a four-digit capsule breaks the layout. */
  maxCount: 99
};
function pillColors(c, mode) {
  return {
    // On dark the resting pill is an outline, not a filled chip — a white
    // surface on plum reads as a card, not a filter.
    background: mode === "light" ? c.secondaryAction : "transparent",
    backgroundSelected: c.primaryAction,
    border: c.secondaryActionBorder,
    borderSelected: c.selectionBorder,
    label: c.textMuted,
    labelSelected: c.primaryActionText,
    backgroundDisabled: mode === "light" ? c.surfaceSoft : "transparent",
    // A *text* token, not `primaryActionDisabled` (a surface at 16% alpha).
    // The Pill also applies opacity 0.5 to its container, so a faint alpha here
    // compounds to ~8% and the label becomes unreadable — caught in the
    // Pill/Tone visual baseline.
    labelDisabled: c.primaryActionDisabledText
  };
}
function providerButtonColors(c) {
  return {
    background: c.text,
    label: c.background,
    // Hover is web-only, and must be a visible lightness step rather than a
    // guess — 14% toward the ground reads on both modes.
    backgroundHover: mix(c.text, c.background, 0.14)
  };
}
function badgeColors(c, mode) {
  return {
    background: c.warning,
    countText: mode === "light" ? c.primaryActionText : c.surface
  };
}
function componentsForMode(mode) {
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
      radius: radii.lg
    }
  };
}
var components = {
  light: componentsForMode("light"),
  dark: componentsForMode("dark")
};

// src/typography.ts
var fonts = {
  // v2 editorial system
  frauncesLight: "Fraunces-Light",
  fraunces: "Fraunces-Regular",
  frauncesMedium: "Fraunces-Medium",
  frauncesSemiBold: "Fraunces-SemiBold",
  frauncesItalic: "Fraunces-Italic",
  frauncesMediumItalic: "Fraunces-MediumItalic",
  inter: "Inter-Regular",
  interMedium: "Inter-Medium",
  interSemiBold: "Inter-SemiBold",
  // legacy — phasing out, do not use in new work
  title: "Cormorant-SemiBold",
  serif: "Cormorant-Regular",
  sans: "HelveticaNeueRoman",
  sansLight: "HelveticaNeueLight",
  sansBold: "HelveticaNeueBold"
};
var compactTypography = {
  display: 40,
  title: 32,
  heading: 22,
  large: 16,
  default: 14,
  subtext: 13,
  tabs: 11,
  micro: 10
};
var regularTypography = {
  display: 48,
  title: 36,
  heading: 24,
  large: 18,
  default: 16,
  subtext: 14,
  tabs: 12,
  micro: 11
};
var typography = regularTypography;
var brandTypography = {
  tagline: 21,
  taglineSmall: 18,
  cta: 19,
  secondaryLabel: 13.5,
  secondaryLink: 14.5
};
var lineHeights = {
  tight: 1.05,
  snug: 1.2,
  normal: 1.4,
  relaxed: 1.55,
  loose: 1.7
};
var letterSpacing = {
  tight: -0.4,
  normal: 0,
  wide: 0.4
};

// src/elevation.ts
var elevation = {
  none: { shadowOpacity: 0, shadowRadius: 0, shadowOffsetY: 0, androidElevation: 0 },
  low: { shadowOpacity: 0.06, shadowRadius: 6, shadowOffsetY: 2, androidElevation: 1 },
  medium: { shadowOpacity: 0.1, shadowRadius: 14, shadowOffsetY: 6, androidElevation: 3 },
  high: { shadowOpacity: 0.14, shadowRadius: 24, shadowOffsetY: 12, androidElevation: 8 },
  floating: { shadowOpacity: 0.18, shadowRadius: 36, shadowOffsetY: 18, androidElevation: 16 }
};

// src/motion.ts
var motion = {
  duration: {
    instant: 80,
    fast: 140,
    normal: 220,
    slow: 320,
    page: 480,
    reveal: 520,
    sheen: 1400,
    crossfade: 320,
    countUp: 720
  },
  spring: {
    press: { damping: 18, stiffness: 240 }
  },
  stagger: {
    lead: 220,
    step: 70,
    max: 10,
    distance: 28
  },
  brandCascade: {
    rise: 16,
    duration: 900,
    bloomDuration: 1600,
    bloomDelay: 100,
    delays: { wordmark: 250, tagline: 620, cta: 950, secondary: 1180 }
  },
  easing: {
    standard: [0.2, 0, 0, 1],
    enter: [0, 0, 0.2, 1],
    exit: [0.4, 0, 1, 1],
    spring: [0.34, 1.56, 0.64, 1]
  }
};

// src/index.ts
var tokens = {
  primitives,
  semantic,
  components,
  buttonSizes,
  pillSizes,
  tabBarGeometry,
  badgeGeometry,
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
  motion
};
var index_default = tokens;
export {
  RAMP_STEPS,
  badgeGeometry,
  brandTypography,
  buttonSizes,
  colors,
  compactSpacing,
  compactTypography,
  components,
  componentsForMode,
  contrastShift,
  dark,
  index_default as default,
  elevation,
  fonts,
  forMode,
  letterSpacing,
  light,
  lineHeights,
  mix,
  motion,
  palette,
  pillSizes,
  primitives,
  radii,
  ramp,
  ramps,
  regularSpacing,
  regularTypography,
  semantic,
  shiftLightness,
  spacing,
  tabBarGeometry,
  tokens,
  typography,
  withAlpha
};
//# sourceMappingURL=index.js.map