// src/primitives.ts
var palette = {
  cream: "#FFF2D7",
  plum: "#3A2646",
  // the brand ink — does ~90% of the work
  gold: "#D4A853",
  // the single accent
  ink: "#0B0B0B",
  paper: "#FFF9ED",
  white: "#FFFDF8",
  rose: "#A84E5C"
  // destructive
};
var clamp01 = (v) => Math.min(1, Math.max(0, v));
function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255
  };
}
function rgbToHex({ r, g, b }) {
  const c = (v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}
var toLinear = (v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
var toGamma = (v) => v <= 31308e-7 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
function rgbToOklab({ r, g, b }) {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  };
}
function oklabToRgb({ L, a, b }) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return {
    r: toGamma(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: toGamma(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: toGamma(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)
  };
}
function mix(a, b, t) {
  const A = rgbToOklab(hexToRgb(a));
  const B = rgbToOklab(hexToRgb(b));
  const k = clamp01(t);
  return rgbToHex(
    oklabToRgb({
      L: A.L + (B.L - A.L) * k,
      a: A.a + (B.a - A.a) * k,
      b: A.b + (B.b - A.b) * k
    })
  );
}
function withAlpha(hexColor, alphaHex) {
  return `${hexColor}${alphaHex}`;
}
var oklabToLch = ({ L, a, b }) => ({
  L,
  C: Math.hypot(a, b),
  h: (Math.atan2(b, a) * 180 / Math.PI + 360) % 360
});
var lchToOklab = ({ L, C, h }) => ({
  L,
  a: C * Math.cos(h * Math.PI / 180),
  b: C * Math.sin(h * Math.PI / 180)
});
var SOLVE_STEPS = 32;
function inSrgbGamut(c) {
  const { r, g, b } = oklabToRgb(lchToOklab(c));
  const e = 1e-4;
  return r >= -e && r <= 1 + e && g >= -e && g <= 1 + e && b >= -e && b <= 1 + e;
}
function maxChroma(L, h) {
  let lo = 0;
  let hi = 0.5;
  for (let i = 0; i < SOLVE_STEPS; i++) {
    const mid = (lo + hi) / 2;
    if (inSrgbGamut({ L, C: mid, h })) lo = mid;
    else hi = mid;
  }
  return lo;
}
function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
function contrastRatio(a, b) {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
function contrastShift(base, opts) {
  const { on, minContrast, chromaFactor = 1 } = opts;
  const b = oklabToLch(rgbToOklab(hexToRgb(base)));
  const targetC = b.C * chromaFactor;
  const at = (L) => rgbToHex(oklabToRgb(lchToOklab({ L, C: Math.min(targetC, maxChroma(L, b.h)), h: b.h })));
  const start = at(b.L);
  if (contrastRatio(start, on) >= minContrast) return start;
  const darken = relativeLuminance(base) < relativeLuminance(on);
  let lo = darken ? 0 : b.L;
  let hi = darken ? b.L : 1;
  for (let i = 0; i < SOLVE_STEPS; i++) {
    const mid = (lo + hi) / 2;
    const passes = contrastRatio(at(mid), on) >= minContrast;
    if (darken === passes) lo = mid;
    else hi = mid;
  }
  return at(darken ? lo : hi);
}
function shiftLightness(hexColor, factor) {
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
  const nl = clamp01(l * factor);
  const q = nl < 0.5 ? nl * (1 + s) : nl + s - nl * s;
  const p3 = 2 * nl - q;
  const hue = (t0) => {
    let t = t0;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p3 + (q - p3) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p3 + (q - p3) * (2 / 3 - t) * 6;
    return p3;
  };
  const to255 = (v) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${to255(hue(h + 1 / 3))}${to255(hue(h))}${to255(hue(h - 1 / 3))}`;
}
var RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
var LIGHTEST_STEP = 50;
var DARKEST_STEP = 900;
var TINT_ANCHOR = palette.paper;
var HUE_RETENTION = 0.15;
var shadeAnchor = (base) => mix(palette.ink, base, HUE_RETENTION);
var MAX_TINT = 0.94;
var MAX_SHADE = 0.9;
function ramp(base, baseStep) {
  const out = {};
  const lightSpan = baseStep - LIGHTEST_STEP;
  const darkSpan = DARKEST_STEP - baseStep;
  const dark2 = shadeAnchor(base);
  for (const step of RAMP_STEPS) {
    if (step === baseStep) {
      out[step] = base.toUpperCase();
    } else if (step < baseStep) {
      out[step] = mix(base, TINT_ANCHOR, (baseStep - step) / lightSpan * MAX_TINT);
    } else {
      out[step] = mix(base, dark2, (step - baseStep) / darkSpan * MAX_SHADE);
    }
  }
  return out;
}
var ramps = {
  plum: ramp(palette.plum, 800),
  gold: ramp(palette.gold, 400),
  rose: ramp(palette.rose, 500),
  /**
   * Warm grey. Anchored at the midpoint of ink→**cream**, not ink→paper.
   *
   * The anchor is the whole ramp. `paper` is only C* 5.4 itself, so halving it
   * against ink produced a base at C* 3.2 — the scale was already near-grey
   * BEFORE a single step was derived, and shading toward `shadeAnchor()` then
   * bled out what little was left (600 landed at C* 2.7, 900 at C* 0.7). That
   * is why editorial type on the landing had to hand-pick `#5A554D` (C* 5.4)
   * rather than reach for a step.
   *
   * `cream` is the warmest palette member, so the same 0.5 midpoint lands a
   * base at C* 7.5 at essentially the SAME lightness (L* 48.6 vs 49.8). The
   * edit changes the ramp's temperature, not its tonal positions: no step moves
   * more than L* 1.11, and every step's contrast on paper improves slightly.
   *
   * Deliberately NOT fixed by raising HUE_RETENTION — that is shared with plum,
   * gold and rose, and moving it would move `ramps.plum`, which the landing
   * renders. Measured, it also doesn't work: at 0.45 the neutral 600 goes
   * C* 2.74 → 2.69. You cannot retain downstream a warmth the base never had.
   */
  neutral: ramp(mix(palette.ink, palette.cream, 0.5), 500)
};
var primitives = { palette, ramps };

// src/semantic.ts
var p = palette;
var ACCENT_TEXT_MIN_CONTRAST = 4.8;
var ACCENT_CHROMA_RETENTION = 0.87;
var DARK_ACCENT_MIN_CONTRAST = 7.4;
var DARK_ACCENT_CHROMA_GAIN = 1.3;
var darkAccent = contrastShift(p.gold, {
  on: ramps.plum[800],
  minContrast: DARK_ACCENT_MIN_CONTRAST,
  chromaFactor: DARK_ACCENT_CHROMA_GAIN
});
var EDITORIAL_BODY_WARMTH = 0.56;
var editorialBodyAnchor = mix(p.cream, p.gold, EDITORIAL_BODY_WARMTH);
var EDITORIAL_BODY_LIFT = 0.145;
var EDITORIAL_MUTED_LIFT = 0.37;
var WARNING_MIN_CONTRAST = 5.65;
var warningLight = contrastShift(p.gold, { on: p.paper, minContrast: WARNING_MIN_CONTRAST });
var light = {
  surface: p.white,
  surfaceMuted: withAlpha(p.plum, "12"),
  surfaceSoft: withAlpha(p.plum, "08"),
  surfaceAccent: withAlpha(p.gold, "26"),
  surfaceDanger: withAlpha(p.rose, "14"),
  surfaceWarning: withAlpha(warningLight, "14"),
  surfaceInverse: p.plum,
  surfaceInverseText: p.white,
  background: p.paper,
  border: withAlpha(p.plum, "1F"),
  borderStrong: withAlpha(p.plum, "4A"),
  borderHairline: withAlpha(p.plum, "14"),
  text: p.ink,
  textMuted: p.plum,
  textSubtle: withAlpha(p.plum, "A6"),
  secondaryMuted: withAlpha(p.plum, "75"),
  // Gold, dark enough to read as small text on a light ground — the one thing
  // the system could not previously express. This slot used to hold `ink`,
  // which is not an accent at all; it was a placeholder nothing consumed.
  //
  // DERIVED, not picked: hold gold's hue, keep 87% of its chroma, and solve
  // lightness down until it clears 4.8:1 on paper. Result #8D691D — 4.80:1 on
  // `background`, 4.95:1 on `surface`, 4.54:1 on cream, C* 46.0 (vs base gold's
  // 49.7 and gold[600]'s 33.9). It tracks the palette: move `gold` or `paper`
  // and the accent follows instead of going quietly non-compliant.
  //
  // Note this is NOT a ramp step. gold[600] is the closest one and it fails at
  // 4.27:1 precisely because ramps mix toward near-achromatic anchors and shed
  // chroma on the way down — it reads brown. A ramp is a surface scale; this is
  // a text role, so it gets solved for its requirement.
  accentText: contrastShift(p.gold, {
    on: p.paper,
    minContrast: ACCENT_TEXT_MIN_CONTRAST,
    chromaFactor: ACCENT_CHROMA_RETENTION
  }),
  // Long-form editorial type. `text` (ink) is achromatic and reads cold against
  // cream-and-plum surfaces, which is why consumers kept inventing warm greys
  // at the call site. Solved rather than taken from the ramp — see the
  // EDITORIAL_* block above for the measurement behind that.
  // #25211C, 15.73:1 on surface, 14.42:1 on cream, C* 4.2.
  textEditorial: mix(p.ink, editorialBodyAnchor, EDITORIAL_BODY_LIFT),
  // #59554D, 7.30:1 on surface, 6.69:1 on cream, C* 5.2.
  textEditorialMuted: mix(p.ink, p.cream, EDITORIAL_MUTED_LIFT),
  primaryAction: p.plum,
  primaryActionText: p.white,
  primaryActionDisabled: withAlpha(p.plum, "29"),
  primaryActionDisabledText: p.plum,
  // One clear lightness step — hover must be perceptible, not a guess.
  // Deliberately the pre-ramp derivation, NOT ramps.plum[700]: this value ships
  // today and the ramp step is visibly lighter (#503D59 vs #33213E). Introducing
  // the ramps must not move a pixel. Revisit as a considered design change.
  primaryActionHover: shiftLightness(palette.plum, 0.88),
  primaryActionPressed: ramps.plum[900],
  secondaryAction: p.white,
  secondaryActionText: p.ink,
  secondaryActionIcon: p.plum,
  secondaryActionBorder: withAlpha(p.plum, "33"),
  hoverTint: withAlpha(p.plum, "12"),
  selection: withAlpha(p.plum, "1E"),
  selectionBorder: p.plum,
  danger: p.rose,
  dangerText: p.rose,
  dangerBorder: withAlpha(p.rose, "52"),
  dangerSurfaceHover: withAlpha(p.rose, "20"),
  warning: warningLight,
  warningText: warningLight,
  // WCAG 2.4.11 requires a focus indicator to hit 3:1 against the surface it
  // sits on. The brand gold at 70% alpha composited to 1.70:1 on cream —
  // technically present, visually invisible. Even solid `gold` only reaches
  // 2.17:1, so the light ring cannot be the base gold at any opacity.
  // gold[600] is 4.41:1 on `surface` and 4.27:1 on `background`, and still
  // reads unmistakably gold rather than falling back to plum.
  focusRing: ramps.gold[600],
  accent: p.gold,
  progressTrack: withAlpha(p.plum, "1A"),
  shadow: p.plum,
  overlay: withAlpha(p.ink, "66"),
  overlayStrong: withAlpha(p.ink, "C7")
};
var dark = {
  surface: ramps.plum[800],
  surfaceMuted: withAlpha(p.paper, "12"),
  surfaceSoft: withAlpha(p.paper, "08"),
  surfaceAccent: withAlpha(p.gold, "2E"),
  surfaceDanger: withAlpha(p.rose, "2E"),
  surfaceWarning: withAlpha(p.gold, "2E"),
  surfaceInverse: p.paper,
  surfaceInverseText: p.plum,
  background: ramps.plum[900],
  border: withAlpha(p.paper, "2E"),
  borderStrong: withAlpha(p.paper, "5C"),
  borderHairline: withAlpha(p.paper, "1F"),
  text: p.paper,
  textMuted: withAlpha(p.paper, "D9"),
  textSubtle: withAlpha(p.paper, "B3"),
  secondaryMuted: withAlpha(p.paper, "8C"),
  // Mode-split, not shared with `light` — see `darkAccent` above.
  accentText: darkAccent,
  // On a dark ground the warm-grey distinction collapses. The neutral ramp's
  // warm steps exist to keep editorial type from reading cold against cream;
  // against plum the same job is done by paper, which is already warm. So these
  // intentionally mirror `text`/`textMuted` rather than reaching for a light
  // ramp step — neutral[100] on plum measures flatter and greyer than paper.
  // The roles exist in both modes so a component can flip wholesale.
  textEditorial: p.paper,
  textEditorialMuted: withAlpha(p.paper, "D9"),
  // On plum, the primary action inverts to cream — a darker plum would vanish.
  primaryAction: p.paper,
  primaryActionText: p.plum,
  primaryActionDisabled: withAlpha(p.paper, "29"),
  primaryActionDisabledText: withAlpha(p.paper, "8C"),
  primaryActionHover: p.white,
  primaryActionPressed: ramps.gold[100],
  secondaryAction: "transparent",
  secondaryActionText: p.paper,
  secondaryActionIcon: p.paper,
  secondaryActionBorder: withAlpha(p.paper, "4A"),
  hoverTint: withAlpha(p.paper, "14"),
  selection: withAlpha(p.paper, "1F"),
  selectionBorder: p.paper,
  danger: ramps.rose[300],
  dangerText: ramps.rose[200],
  dangerBorder: withAlpha(ramps.rose[300], "7A"),
  dangerSurfaceHover: withAlpha(p.rose, "3D"),
  // Nothing to solve on plum, because the base gold already clears AA there
  // (6.16:1 on `surface`). Taking it also points this mode the same way light
  // points: `warning` is the darker of the warning/accent pair, here base gold
  // against the chroma-amplified accent, and in light mode the darkened solve
  // against base gold. Chroma cannot carry that separation, since the light
  // solve lands within 2% of base gold's, so lightness is the axis that has to
  // stay consistent. `semantic.test.ts` pins the direction.
  warning: p.gold,
  warningText: ramps.gold[300],
  focusRing: withAlpha(p.gold, "D9"),
  // Deliberately the same value as `accentText` above. `accent` can be a fill
  // or a rule and only owes 3:1, so it could be pushed further — but one gold
  // per mode is the point, and this one already clears 7.4:1 as text. Kept as a
  // single const so the two can never drift.
  accent: darkAccent,
  progressTrack: withAlpha(p.paper, "24"),
  shadow: ramps.plum[900],
  overlay: withAlpha(p.ink, "8C"),
  overlayStrong: withAlpha(p.ink, "DB")
};
var semantic = { light, dark };
function forMode(mode) {
  return semantic[mode];
}

// src/radii.ts
var radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999
};

// src/colors.ts
var p2 = palette;
var colors = {
  ...p2,
  // aliases matching the code's original semantic names
  primary: p2.cream,
  secondary: p2.plum,
  accent: p2.gold,
  text: p2.ink,
  background: p2.paper,
  red: p2.rose,
  // surfaces
  surface: light.surface,
  surfaceMuted: light.surfaceMuted,
  surfaceSoft: light.surfaceSoft,
  surfaceAccent: light.surfaceAccent,
  surfaceDanger: light.surfaceDanger,
  surfaceInverse: light.surfaceInverse,
  surfaceInverseText: light.surfaceInverseText,
  // borders
  border: light.border,
  borderStrong: light.borderStrong,
  borderHairline: light.borderHairline,
  // primary action
  primaryAction: light.primaryAction,
  primaryActionText: light.primaryActionText,
  primaryActionDisabled: light.primaryActionDisabled,
  primaryActionDisabledText: light.primaryActionDisabledText,
  // hover (web / landing only — RN has no hover, it uses pressed)
  primaryActionHover: light.primaryActionHover,
  /** @deprecated use `semantic.dark` via a `tone` prop. */
  primaryActionHoverOnDark: shiftLightness(p2.plum, 1.5),
  hoverTint: light.hoverTint,
  dangerSurfaceHover: light.dangerSurfaceHover,
  // focus (web only — keyboard :focus-visible ring; gold reads on plum and cream)
  focusRing: light.focusRing,
  // secondary action
  secondaryAction: light.secondaryAction,
  secondaryActionText: light.secondaryActionText,
  secondaryActionIcon: light.secondaryActionIcon,
  secondaryActionBorder: light.secondaryActionBorder,
  // selection
  selection: light.selection,
  selectionBorder: light.selectionBorder,
  // text
  accentText: light.accentText,
  textMuted: light.textMuted,
  textSubtle: light.textSubtle,
  secondaryMuted: light.secondaryMuted,
  // danger (destructive)
  dangerText: light.dangerText,
  dangerBorder: light.dangerBorder,
  // misc / effects
  progressTrack: light.progressTrack,
  shadow: light.shadow,
  overlay: light.overlay,
  overlayStrong: light.overlayStrong,
  // Brand-moment gradient stops.
  // These are STOPS IN A BAKED RADIAL GRADIENT (assets/welcome-bg.png), not
  // surface roles — which is why they stayed here rather than moving into
  // `semantic.dark`'s role vocabulary. Regenerate the asset if plum changes.
  brandRampTop: shiftLightness(p2.plum, 1.28),
  brandRamp: shiftLightness(p2.plum, 0.86),
  brandRampDeep: shiftLightness(p2.plum, 0.57),
  brandRampBlack: shiftLightness(p2.plum, 0.47),
  brandInk: p2.plum,
  brandGold: p2.gold,
  brandCream: p2.paper
};

// src/spacing.ts
var compactSpacing = {
  xs: 4,
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  xxl: 36
};
var regularSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};
var spacing = regularSpacing;

export {
  palette,
  mix,
  withAlpha,
  contrastShift,
  shiftLightness,
  RAMP_STEPS,
  ramp,
  ramps,
  primitives,
  light,
  dark,
  semantic,
  forMode,
  radii,
  colors,
  compactSpacing,
  regularSpacing,
  spacing
};
//# sourceMappingURL=chunk-SNALUFOR.js.map