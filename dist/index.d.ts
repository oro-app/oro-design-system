import { R as Ramp } from './primitives-sn-nZCP4.js';
export { C as ContrastShiftOptions, a as RAMP_STEPS, b as RampFamily, c as RampStep, d as contrastShift, m as mix, p as palette, e as primitives, r as ramp, f as ramps, s as shiftLightness, w as withAlpha } from './primitives-sn-nZCP4.js';

/** Which surface a component is sitting on. Components take this as a `tone` prop. */
type Mode = 'light' | 'dark';
/** The role vocabulary. Both modes implement all of it — that's what makes
 *  `tone` safe to flip on any component. */
type SemanticColors = {
    surface: string;
    surfaceMuted: string;
    surfaceSoft: string;
    surfaceAccent: string;
    surfaceDanger: string;
    surfaceWarning: string;
    surfaceInverse: string;
    surfaceInverseText: string;
    background: string;
    border: string;
    borderStrong: string;
    borderHairline: string;
    text: string;
    textMuted: string;
    textSubtle: string;
    secondaryMuted: string;
    accentText: string;
    /** Long-form body copy. Warm near-black on light grounds — see `light`. */
    textEditorial: string;
    /** Deks, summaries, pull quotes — the muted companion to `textEditorial`. */
    textEditorialMuted: string;
    primaryAction: string;
    primaryActionText: string;
    primaryActionDisabled: string;
    primaryActionDisabledText: string;
    primaryActionHover: string;
    primaryActionPressed: string;
    secondaryAction: string;
    secondaryActionText: string;
    secondaryActionIcon: string;
    secondaryActionBorder: string;
    hoverTint: string;
    selection: string;
    selectionBorder: string;
    danger: string;
    dangerText: string;
    dangerBorder: string;
    dangerSurfaceHover: string;
    warning: string;
    warningText: string;
    focusRing: string;
    accent: string;
    progressTrack: string;
    shadow: string;
    overlay: string;
    overlayStrong: string;
};
/** Default mode — cream/paper surfaces, plum ink. The app's everyday state. */
declare const light: SemanticColors;
/**
 * Brand-moment / on-dark mode. Deep plum surfaces, cream ink.
 *
 * This subsumes what used to be scattered one-off tokens — `brandRamp*`,
 * `primaryActionHoverOnDark` — into the same role vocabulary as `light`, so a
 * component flips wholesale via `tone` instead of reaching for a special case.
 */
declare const dark: SemanticColors;
declare const semantic: {
    readonly light: SemanticColors;
    readonly dark: SemanticColors;
};
/** Resolve a role set for a mode. Components call this once from their `tone` prop. */
declare function forMode(mode: Mode): SemanticColors;

/** Non-color geometry shared by the sized components. Sizes are the `size` axis;
 *  `hero` is a separate prominence and deliberately not in this table. */
declare const buttonSizes: {
    readonly sm: {
        readonly height: 44;
        readonly paddingHorizontal: 16;
        readonly fontSize: 13;
        readonly gap: 6;
        readonly iconSize: 16;
    };
    /** Matches the pre-size-axis Button exactly — existing usage is unaffected. */
    readonly md: {
        readonly height: 52;
        readonly paddingHorizontal: 24;
        readonly fontSize: 14;
        readonly gap: 8;
        readonly iconSize: 18;
    };
    readonly lg: {
        readonly height: 60;
        readonly paddingHorizontal: 32;
        readonly fontSize: 16;
        readonly gap: 10;
        readonly iconSize: 20;
    };
};
type ButtonSize = keyof typeof buttonSizes;
declare const pillSizes: {
    readonly sm: {
        readonly paddingVertical: 6;
        readonly paddingHorizontal: 16;
        readonly fontSize: 12;
        readonly gap: 6;
        readonly iconSize: 14;
    };
    /** Matches the pre-size-axis Pill exactly. */
    readonly md: {
        readonly paddingVertical: 8;
        readonly paddingHorizontal: 22;
        readonly fontSize: 13;
        readonly gap: 8;
        readonly iconSize: 16;
    };
};
type PillSize = keyof typeof pillSizes;
/** Geometry for the app's bottom tab bar. No size axis: there is one bar per app, and it is not a scale. */
declare const tabBarGeometry: {
    readonly iconSize: 22;
    /** The dot marking the active tab. Icon-only tabs have no label to carry selection, so a second cue beyond color is required. */
    readonly markSize: 4;
    readonly markGap: 6;
    readonly paddingVertical: 8;
    readonly paddingHorizontal: 10;
    /** Apple's minimum touch target, which the icon plus its mark does not reach on its own. */
    readonly tabMinHeight: 44;
    readonly radius: 999;
};
/**
 * Geometry for the needs-attention badge. No size axis: the dot and the count
 * are one signal at two sizes, and which one renders follows from whether there
 * is a count, so a caller cannot ship a dot for a two-item state.
 */
declare const badgeGeometry: {
    readonly dotSize: 9;
    readonly countPaddingVertical: 3;
    readonly countPaddingHorizontal: 7;
    readonly countMinWidth: 18;
    readonly fontSize: 11;
    /** Counts above this render as `99+`, because a four-digit capsule breaks the layout. */
    readonly maxCount: 99;
};
/** Colors a Pill needs beyond the plain semantic roles. */
type PillColors = {
    background: string;
    backgroundSelected: string;
    border: string;
    borderSelected: string;
    label: string;
    labelSelected: string;
    backgroundDisabled: string;
    labelDisabled: string;
};
/**
 * Colors the third-party sign-in (provider) button needs beyond the plain
 * semantic roles.
 *
 * Scoped to that one job on purpose. The obvious alternative — a generic
 * `dark`/`ink` Button variant — reads as "use me for emphasis" and would be
 * reached for anywhere; this one names the situation it belongs to.
 *
 * The situation: Apple's `AppleAuthenticationButton` is mandatory (App Store
 * Guideline 4.8) and exposes only WHITE / WHITE_OUTLINE / BLACK, so Apple sets
 * the treatment and every sibling provider button has to match it. On a light
 * ground that means a near-black fill, which no semantic role names — a filled
 * `primaryAction` is plum and would duplicate the screen's hero CTA, and
 * `surfaceInverse` is plum too.
 */
type ProviderButtonColors = {
    background: string;
    label: string;
    backgroundHover: string;
};
/**
 * The badge's fill is the plain `warning` role in both modes. Its count text is
 * the divergence that earns this a tier-3 entry: white works on the light fill
 * (5.88:1) but measures 2.17:1 on the dark one, because dark `warning` is the
 * base gold. On plum the readable pairing is the surface color itself (6.16:1),
 * so the text has to flip with the mode while the fill does not.
 */
type BadgeColors = {
    background: string;
    countText: string;
};
type ComponentTokens = {
    pill: PillColors;
    providerButton: ProviderButtonColors;
    badge: BadgeColors;
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
declare function componentsForMode(mode: Mode): ComponentTokens;
declare const components: {
    readonly light: ComponentTokens;
    readonly dark: ComponentTokens;
};

declare const colors: {
    readonly primary: "#FFF2D7";
    readonly secondary: "#3A2646";
    readonly accent: "#D4A853";
    readonly text: "#0B0B0B";
    readonly background: "#FFF9ED";
    readonly red: "#A84E5C";
    readonly surface: string;
    readonly surfaceMuted: string;
    readonly surfaceSoft: string;
    readonly surfaceAccent: string;
    readonly surfaceDanger: string;
    readonly surfaceInverse: string;
    readonly surfaceInverseText: string;
    readonly border: string;
    readonly borderStrong: string;
    readonly borderHairline: string;
    readonly primaryAction: string;
    readonly primaryActionText: string;
    readonly primaryActionDisabled: string;
    readonly primaryActionDisabledText: string;
    readonly primaryActionHover: string;
    /** @deprecated use `semantic.dark` via a `tone` prop. */
    readonly primaryActionHoverOnDark: string;
    readonly hoverTint: string;
    readonly dangerSurfaceHover: string;
    readonly focusRing: string;
    readonly secondaryAction: string;
    readonly secondaryActionText: string;
    readonly secondaryActionIcon: string;
    readonly secondaryActionBorder: string;
    readonly selection: string;
    readonly selectionBorder: string;
    readonly accentText: string;
    readonly textMuted: string;
    readonly textSubtle: string;
    readonly secondaryMuted: string;
    readonly dangerText: string;
    readonly dangerBorder: string;
    readonly progressTrack: string;
    readonly shadow: string;
    readonly overlay: string;
    readonly overlayStrong: string;
    readonly brandRampTop: string;
    readonly brandRamp: string;
    readonly brandRampDeep: string;
    readonly brandRampBlack: string;
    readonly brandInk: "#3A2646";
    readonly brandGold: "#D4A853";
    readonly brandCream: "#FFF9ED";
    readonly cream: "#FFF2D7";
    readonly plum: "#3A2646";
    readonly gold: "#D4A853";
    readonly ink: "#0B0B0B";
    readonly paper: "#FFF9ED";
    readonly white: "#FFFDF8";
    readonly rose: "#A84E5C";
};
type ColorToken = keyof typeof colors;

declare const fonts: {
    readonly frauncesLight: "Fraunces-Light";
    readonly fraunces: "Fraunces-Regular";
    readonly frauncesMedium: "Fraunces-Medium";
    readonly frauncesSemiBold: "Fraunces-SemiBold";
    readonly frauncesItalic: "Fraunces-Italic";
    readonly frauncesMediumItalic: "Fraunces-MediumItalic";
    readonly inter: "Inter-Regular";
    readonly interMedium: "Inter-Medium";
    readonly interSemiBold: "Inter-SemiBold";
    readonly title: "Cormorant-SemiBold";
    readonly serif: "Cormorant-Regular";
    readonly sans: "HelveticaNeueRoman";
    readonly sansLight: "HelveticaNeueLight";
    readonly sansBold: "HelveticaNeueBold";
};
declare const compactTypography: {
    readonly display: 40;
    readonly title: 32;
    readonly heading: 22;
    readonly large: 16;
    readonly default: 14;
    readonly subtext: 13;
    readonly tabs: 11;
    readonly micro: 10;
};
declare const regularTypography: {
    readonly display: 48;
    readonly title: 36;
    readonly heading: 24;
    readonly large: 18;
    readonly default: 16;
    readonly subtext: 14;
    readonly tabs: 12;
    readonly micro: 11;
};
/** Default resolved scale (regular). Apps may swap to compact on small devices. */
declare const typography: {
    readonly display: 48;
    readonly title: 36;
    readonly heading: 24;
    readonly large: 18;
    readonly default: 16;
    readonly subtext: 14;
    readonly tabs: 12;
    readonly micro: 11;
};
/** Brand-moment type — fixed, non-responsive (welcome screen / dark interstitials). */
declare const brandTypography: {
    readonly tagline: 21;
    readonly taglineSmall: 18;
    readonly cta: 19;
    readonly secondaryLabel: 13.5;
    readonly secondaryLink: 14.5;
};
declare const lineHeights: {
    readonly tight: 1.05;
    readonly snug: 1.2;
    readonly normal: 1.4;
    readonly relaxed: 1.55;
    readonly loose: 1.7;
};
declare const letterSpacing: {
    readonly tight: -0.4;
    readonly normal: 0;
    readonly wide: 0.4;
};
type TypographyToken = keyof typeof regularTypography;
type LineHeightToken = keyof typeof lineHeights;
type LetterSpacingToken = keyof typeof letterSpacing;

declare const compactSpacing: {
    readonly xs: 4;
    readonly sm: 6;
    readonly md: 12;
    readonly lg: 18;
    readonly xl: 24;
    readonly xxl: 36;
};
declare const regularSpacing: {
    readonly xs: 4;
    readonly sm: 8;
    readonly md: 16;
    readonly lg: 24;
    readonly xl: 32;
    readonly xxl: 48;
};
/** Default resolved spacing (regular). `xxl` is the section-break rhythm. */
declare const spacing: {
    readonly xs: 4;
    readonly sm: 8;
    readonly md: 16;
    readonly lg: 24;
    readonly xl: 32;
    readonly xxl: 48;
};
type SpacingToken = keyof typeof regularSpacing;

declare const radii: {
    readonly none: 0;
    readonly xs: 4;
    readonly sm: 8;
    readonly md: 12;
    readonly lg: 16;
    readonly xl: 20;
    readonly xxl: 28;
    readonly pill: 999;
};
type RadiiToken = keyof typeof radii;

type ElevationPreset = {
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffsetY: number;
    androidElevation: number;
};
declare const elevation: {
    readonly none: {
        readonly shadowOpacity: 0;
        readonly shadowRadius: 0;
        readonly shadowOffsetY: 0;
        readonly androidElevation: 0;
    };
    readonly low: {
        readonly shadowOpacity: 0.06;
        readonly shadowRadius: 6;
        readonly shadowOffsetY: 2;
        readonly androidElevation: 1;
    };
    readonly medium: {
        readonly shadowOpacity: 0.1;
        readonly shadowRadius: 14;
        readonly shadowOffsetY: 6;
        readonly androidElevation: 3;
    };
    readonly high: {
        readonly shadowOpacity: 0.14;
        readonly shadowRadius: 24;
        readonly shadowOffsetY: 12;
        readonly androidElevation: 8;
    };
    readonly floating: {
        readonly shadowOpacity: 0.18;
        readonly shadowRadius: 36;
        readonly shadowOffsetY: 18;
        readonly androidElevation: 16;
    };
};
type ElevationToken = keyof typeof elevation;

declare const motion: {
    readonly duration: {
        readonly instant: 80;
        readonly fast: 140;
        readonly normal: 220;
        readonly slow: 320;
        readonly page: 480;
        readonly reveal: 520;
        readonly sheen: 1400;
        readonly crossfade: 320;
        readonly countUp: 720;
    };
    readonly spring: {
        readonly press: {
            readonly damping: 18;
            readonly stiffness: 240;
        };
    };
    readonly stagger: {
        readonly lead: 220;
        readonly step: 70;
        readonly max: 10;
        readonly distance: 28;
    };
    readonly brandCascade: {
        readonly rise: 16;
        readonly duration: 900;
        readonly bloomDuration: 1600;
        readonly bloomDelay: 100;
        readonly delays: {
            readonly wordmark: 250;
            readonly tagline: 620;
            readonly cta: 950;
            readonly secondary: 1180;
        };
    };
    readonly easing: {
        readonly standard: readonly [0.2, 0, 0, 1];
        readonly enter: readonly [0, 0, 0.2, 1];
        readonly exit: readonly [0.4, 0, 1, 1];
        readonly spring: readonly [0.34, 1.56, 0.64, 1];
    };
};

/** The whole Oro token set in one object. */
declare const tokens: {
    readonly primitives: {
        readonly palette: {
            readonly cream: "#FFF2D7";
            readonly plum: "#3A2646";
            readonly gold: "#D4A853";
            readonly ink: "#0B0B0B";
            readonly paper: "#FFF9ED";
            readonly white: "#FFFDF8";
            readonly rose: "#A84E5C";
        };
        readonly ramps: {
            readonly plum: Ramp;
            readonly gold: Ramp;
            readonly rose: Ramp;
            readonly neutral: Ramp;
        };
    };
    readonly semantic: {
        readonly light: SemanticColors;
        readonly dark: SemanticColors;
    };
    readonly components: {
        readonly light: ComponentTokens;
        readonly dark: ComponentTokens;
    };
    readonly buttonSizes: {
        readonly sm: {
            readonly height: 44;
            readonly paddingHorizontal: 16;
            readonly fontSize: 13;
            readonly gap: 6;
            readonly iconSize: 16;
        };
        readonly md: {
            readonly height: 52;
            readonly paddingHorizontal: 24;
            readonly fontSize: 14;
            readonly gap: 8;
            readonly iconSize: 18;
        };
        readonly lg: {
            readonly height: 60;
            readonly paddingHorizontal: 32;
            readonly fontSize: 16;
            readonly gap: 10;
            readonly iconSize: 20;
        };
    };
    readonly pillSizes: {
        readonly sm: {
            readonly paddingVertical: 6;
            readonly paddingHorizontal: 16;
            readonly fontSize: 12;
            readonly gap: 6;
            readonly iconSize: 14;
        };
        readonly md: {
            readonly paddingVertical: 8;
            readonly paddingHorizontal: 22;
            readonly fontSize: 13;
            readonly gap: 8;
            readonly iconSize: 16;
        };
    };
    readonly tabBarGeometry: {
        readonly iconSize: 22;
        readonly markSize: 4;
        readonly markGap: 6;
        readonly paddingVertical: 8;
        readonly paddingHorizontal: 10;
        readonly tabMinHeight: 44;
        readonly radius: 999;
    };
    readonly badgeGeometry: {
        readonly dotSize: 9;
        readonly countPaddingVertical: 3;
        readonly countPaddingHorizontal: 7;
        readonly countMinWidth: 18;
        readonly fontSize: 11;
        readonly maxCount: 99;
    };
    readonly forMode: typeof forMode;
    /** @deprecated flat pre-tier API — prefer `semantic`. */
    readonly colors: {
        readonly primary: "#FFF2D7";
        readonly secondary: "#3A2646";
        readonly accent: "#D4A853";
        readonly text: "#0B0B0B";
        readonly background: "#FFF9ED";
        readonly red: "#A84E5C";
        readonly surface: string;
        readonly surfaceMuted: string;
        readonly surfaceSoft: string;
        readonly surfaceAccent: string;
        readonly surfaceDanger: string;
        readonly surfaceInverse: string;
        readonly surfaceInverseText: string;
        readonly border: string;
        readonly borderStrong: string;
        readonly borderHairline: string;
        readonly primaryAction: string;
        readonly primaryActionText: string;
        readonly primaryActionDisabled: string;
        readonly primaryActionDisabledText: string;
        readonly primaryActionHover: string;
        readonly primaryActionHoverOnDark: string;
        readonly hoverTint: string;
        readonly dangerSurfaceHover: string;
        readonly focusRing: string;
        readonly secondaryAction: string;
        readonly secondaryActionText: string;
        readonly secondaryActionIcon: string;
        readonly secondaryActionBorder: string;
        readonly selection: string;
        readonly selectionBorder: string;
        readonly accentText: string;
        readonly textMuted: string;
        readonly textSubtle: string;
        readonly secondaryMuted: string;
        readonly dangerText: string;
        readonly dangerBorder: string;
        readonly progressTrack: string;
        readonly shadow: string;
        readonly overlay: string;
        readonly overlayStrong: string;
        readonly brandRampTop: string;
        readonly brandRamp: string;
        readonly brandRampDeep: string;
        readonly brandRampBlack: string;
        readonly brandInk: "#3A2646";
        readonly brandGold: "#D4A853";
        readonly brandCream: "#FFF9ED";
        readonly cream: "#FFF2D7";
        readonly plum: "#3A2646";
        readonly gold: "#D4A853";
        readonly ink: "#0B0B0B";
        readonly paper: "#FFF9ED";
        readonly white: "#FFFDF8";
        readonly rose: "#A84E5C";
    };
    readonly fonts: {
        readonly frauncesLight: "Fraunces-Light";
        readonly fraunces: "Fraunces-Regular";
        readonly frauncesMedium: "Fraunces-Medium";
        readonly frauncesSemiBold: "Fraunces-SemiBold";
        readonly frauncesItalic: "Fraunces-Italic";
        readonly frauncesMediumItalic: "Fraunces-MediumItalic";
        readonly inter: "Inter-Regular";
        readonly interMedium: "Inter-Medium";
        readonly interSemiBold: "Inter-SemiBold";
        readonly title: "Cormorant-SemiBold";
        readonly serif: "Cormorant-Regular";
        readonly sans: "HelveticaNeueRoman";
        readonly sansLight: "HelveticaNeueLight";
        readonly sansBold: "HelveticaNeueBold";
    };
    readonly typography: {
        readonly display: 48;
        readonly title: 36;
        readonly heading: 24;
        readonly large: 18;
        readonly default: 16;
        readonly subtext: 14;
        readonly tabs: 12;
        readonly micro: 11;
    };
    readonly brandTypography: {
        readonly tagline: 21;
        readonly taglineSmall: 18;
        readonly cta: 19;
        readonly secondaryLabel: 13.5;
        readonly secondaryLink: 14.5;
    };
    readonly lineHeights: {
        readonly tight: 1.05;
        readonly snug: 1.2;
        readonly normal: 1.4;
        readonly relaxed: 1.55;
        readonly loose: 1.7;
    };
    readonly letterSpacing: {
        readonly tight: -0.4;
        readonly normal: 0;
        readonly wide: 0.4;
    };
    readonly spacing: {
        readonly xs: 4;
        readonly sm: 8;
        readonly md: 16;
        readonly lg: 24;
        readonly xl: 32;
        readonly xxl: 48;
    };
    readonly radii: {
        readonly none: 0;
        readonly xs: 4;
        readonly sm: 8;
        readonly md: 12;
        readonly lg: 16;
        readonly xl: 20;
        readonly xxl: 28;
        readonly pill: 999;
    };
    readonly elevation: {
        readonly none: {
            readonly shadowOpacity: 0;
            readonly shadowRadius: 0;
            readonly shadowOffsetY: 0;
            readonly androidElevation: 0;
        };
        readonly low: {
            readonly shadowOpacity: 0.06;
            readonly shadowRadius: 6;
            readonly shadowOffsetY: 2;
            readonly androidElevation: 1;
        };
        readonly medium: {
            readonly shadowOpacity: 0.1;
            readonly shadowRadius: 14;
            readonly shadowOffsetY: 6;
            readonly androidElevation: 3;
        };
        readonly high: {
            readonly shadowOpacity: 0.14;
            readonly shadowRadius: 24;
            readonly shadowOffsetY: 12;
            readonly androidElevation: 8;
        };
        readonly floating: {
            readonly shadowOpacity: 0.18;
            readonly shadowRadius: 36;
            readonly shadowOffsetY: 18;
            readonly androidElevation: 16;
        };
    };
    readonly motion: {
        readonly duration: {
            readonly instant: 80;
            readonly fast: 140;
            readonly normal: 220;
            readonly slow: 320;
            readonly page: 480;
            readonly reveal: 520;
            readonly sheen: 1400;
            readonly crossfade: 320;
            readonly countUp: 720;
        };
        readonly spring: {
            readonly press: {
                readonly damping: 18;
                readonly stiffness: 240;
            };
        };
        readonly stagger: {
            readonly lead: 220;
            readonly step: 70;
            readonly max: 10;
            readonly distance: 28;
        };
        readonly brandCascade: {
            readonly rise: 16;
            readonly duration: 900;
            readonly bloomDuration: 1600;
            readonly bloomDelay: 100;
            readonly delays: {
                readonly wordmark: 250;
                readonly tagline: 620;
                readonly cta: 950;
                readonly secondary: 1180;
            };
        };
        readonly easing: {
            readonly standard: readonly [0.2, 0, 0, 1];
            readonly enter: readonly [0, 0, 0.2, 1];
            readonly exit: readonly [0.4, 0, 1, 1];
            readonly spring: readonly [0.34, 1.56, 0.64, 1];
        };
    };
};

export { type BadgeColors, type ButtonSize, type ColorToken, type ComponentTokens, type ElevationPreset, type ElevationToken, type LetterSpacingToken, type LineHeightToken, type Mode, type PillColors, type PillSize, type ProviderButtonColors, type RadiiToken, Ramp, type SemanticColors, type SpacingToken, type TypographyToken, badgeGeometry, brandTypography, buttonSizes, colors, compactSpacing, compactTypography, components, componentsForMode, dark, tokens as default, elevation, fonts, forMode, letterSpacing, light, lineHeights, motion, pillSizes, radii, regularSpacing, regularTypography, semantic, spacing, tabBarGeometry, tokens, typography };
