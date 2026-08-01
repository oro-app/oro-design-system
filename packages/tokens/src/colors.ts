// Oro color tokens — single source of truth (mirrors oro-mobile-refresh/src/lib/style/theme.ts).
// Platform-neutral: consumed by @oro/ui (React Native) and the landing Tailwind preset.

export const palette = {
  cream: '#FFF2D7', // code: primary
  plum: '#3A2646', // code: secondary — the brand ink
  lilac: '#CCB7E3', // code: tertiary
  gold: '#D4A853', // code: accent
  ink: '#0B0B0B', // code: text / black
  paper: '#FFF9ED', // code: background
  white: '#FFFDF8', // code: white
  rose: '#A84E5C', // code: red
} as const;

/** Append an 8-bit hex alpha suffix to a hex color (e.g. withAlpha('#3A2646', '12')). */
export function withAlpha(hexColor: string, alphaHex: string): string {
  return `${hexColor}${alphaHex}`;
}

/** Scale a hex color's HSL lightness by `factor`, clamped to [0,1]. Derives the
 *  dark brand-moment ramp stops from the single brand plum. */
export function shiftLightness(hexColor: string, factor: number): string {
  const r = parseInt(hexColor.slice(1, 3), 16) / 255;
  const g = parseInt(hexColor.slice(3, 5), 16) / 255;
  const b = parseInt(hexColor.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  const nl = Math.min(1, Math.max(0, l * factor));
  const q = nl < 0.5 ? nl * (1 + s) : nl + s - nl * s;
  const p = 2 * nl - q;
  const hue = (t0: number) => {
    let t = t0;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const to255 = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${to255(hue(h + 1 / 3))}${to255(hue(h))}${to255(hue(h - 1 / 3))}`;
}

const p = palette;

export const colors = {
  ...p,
  // aliases matching the code's semantic names
  primary: p.cream,
  secondary: p.plum,
  tertiary: p.lilac,
  accent: p.gold,
  text: p.ink,
  background: p.paper,
  red: p.rose,

  // surfaces
  surface: p.white,
  surfaceMuted: withAlpha(p.plum, '12'),
  surfaceSoft: withAlpha(p.plum, '08'),
  surfaceAccent: withAlpha(p.gold, '26'),
  surfaceDanger: withAlpha(p.rose, '14'),
  surfaceInverse: p.plum,
  surfaceInverseText: p.white,

  // borders
  border: withAlpha(p.plum, '1F'),
  borderStrong: withAlpha(p.plum, '4A'),
  borderHairline: withAlpha(p.plum, '14'),

  // primary action
  primaryAction: p.plum,
  primaryActionText: p.white,
  primaryActionDisabled: withAlpha(p.plum, '29'),
  primaryActionDisabledText: p.plum,

  // secondary action
  secondaryAction: p.white,
  secondaryActionText: p.ink,
  secondaryActionIcon: p.plum,
  secondaryActionBorder: withAlpha(p.plum, '33'),

  // selection
  selection: withAlpha(p.plum, '1E'),
  selectionBorder: p.plum,

  // text
  accentText: p.ink,
  textMuted: p.plum,
  textSubtle: withAlpha(p.plum, 'A6'),
  secondaryMuted: withAlpha(p.plum, '75'),

  // danger
  dangerText: p.rose,
  dangerBorder: withAlpha(p.rose, '52'),

  // misc / effects
  progressTrack: withAlpha(p.plum, '1A'),
  shadow: p.plum,
  overlay: withAlpha(p.ink, '66'),
  overlayStrong: withAlpha(p.ink, 'C7'),

  // brand-moment (derived from the single brand plum)
  brandRampTop: shiftLightness(p.plum, 1.28),
  brandRamp: shiftLightness(p.plum, 0.86),
  brandRampDeep: shiftLightness(p.plum, 0.57),
  brandRampBlack: shiftLightness(p.plum, 0.47),
  brandInk: p.plum,
  brandGold: p.gold,
  brandCream: p.paper,
} as const;

export type ColorToken = keyof typeof colors;
