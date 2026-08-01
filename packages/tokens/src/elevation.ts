// Oro elevation tokens (mirrors oro-mobile-refresh/src/lib/style/elevation.ts).
// Platform-neutral shadow presets. @oro/ui converts these into RN shadow styles
// (iOS shadow* props / Android elevation) via its `resolveElevation` helper.
// Shadow color is plum (colors.shadow); opacity ranges 0.06 → 0.18.

export type ElevationPreset = {
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffsetY: number;
  androidElevation: number;
};

export const elevation = {
  none: { shadowOpacity: 0, shadowRadius: 0, shadowOffsetY: 0, androidElevation: 0 },
  low: { shadowOpacity: 0.06, shadowRadius: 6, shadowOffsetY: 2, androidElevation: 1 },
  medium: { shadowOpacity: 0.1, shadowRadius: 14, shadowOffsetY: 6, androidElevation: 3 },
  high: { shadowOpacity: 0.14, shadowRadius: 24, shadowOffsetY: 12, androidElevation: 8 },
  floating: { shadowOpacity: 0.18, shadowRadius: 36, shadowOffsetY: 18, androidElevation: 16 },
} as const satisfies Record<string, ElevationPreset>;

export type ElevationToken = keyof typeof elevation;
