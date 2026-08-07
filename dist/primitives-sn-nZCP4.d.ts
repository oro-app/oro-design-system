/** The seven fixed brand values. Everything else in the system derives from these. */
declare const palette: {
    readonly cream: "#FFF2D7";
    readonly plum: "#3A2646";
    readonly gold: "#D4A853";
    readonly ink: "#0B0B0B";
    readonly paper: "#FFF9ED";
    readonly white: "#FFFDF8";
    readonly rose: "#A84E5C";
};
/**
 * Perceptually blend two hex colors. `t` is how far to travel from `a` to `b`
 * (0 = a, 1 = b). Used to build every ramp step.
 */
declare function mix(a: string, b: string, t: number): string;
/** Append an 8-bit hex alpha suffix (e.g. withAlpha('#3A2646', '12')). */
declare function withAlpha(hexColor: string, alphaHex: string): string;
type ContrastShiftOptions = {
    /** The ground the result has to be legible against. */
    on: string;
    /** WCAG ratio to reach (4.5 normal text, 3 large text / non-text). */
    minContrast: number;
    /**
     * Fraction of the base's chroma to keep. 1 = as saturated as the gamut allows
     * at the solved lightness. Values > 1 are legal — they amplify toward the
     * cusp, which is what a dark-mode accent needs — and are gamut-clamped, never
     * clipped.
     */
    chromaFactor?: number;
};
/**
 * Move `base` along lightness only, holding its hue, until it clears
 * `minContrast` against `on`. Returns `base` unchanged if it already does.
 *
 * Direction is inferred: a base darker than its ground darkens further, a
 * lighter one lightens. Pure function, ~1ms, no allocation of note — it runs at
 * module-eval time when semantic.ts is imported.
 */
declare function contrastShift(base: string, opts: ContrastShiftOptions): string;
/**
 * Scale a hex color's HSL lightness by `factor`.
 *
 * RETAINED FOR THE EXISTING BRAND-MOMENT RAMP ONLY. Do not build new ramps with
 * this — multiplicative lightness blows out to pure white for any base that
 * isn't already dark (gold at L=58% and rose at L=48% both clip to #FFFFFF well
 * before the light end of a ramp). Use `ramp()` / `mix()` instead.
 */
declare function shiftLightness(hexColor: string, factor: number): string;
declare const RAMP_STEPS: readonly [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
type RampStep = (typeof RAMP_STEPS)[number];
type Ramp = Record<RampStep, string>;
/**
 * Build a 50–900 ramp around a brand base.
 *
 * The base hex is pinned EXACTLY at `baseStep` — ramps are generated around the
 * brand color, never over it, so adding ramps can never shift a shipped pixel.
 * Steps lighter than the base interpolate toward paper; darker toward ink.
 */
declare function ramp(base: string, baseStep: RampStep): Ramp;
/**
 * The tonal ramps.
 *
 * Base steps are chosen so each brand hex lands where its lightness naturally
 * sits — plum is dark (800), gold is light-mid (400), rose is mid (500).
 *
 * NOTE: `plum[100]`–`plum[300]` are pale violets. These are TINTS OF THE BRAND
 * PLUM, derived by `mix()`. They are not a reintroduction of the `lilac` hue
 * that was cut from the palette — that was a separate, undeclared hue. Deriving
 * every purple from the one plum is exactly the point of the ramp.
 */
declare const ramps: {
    readonly plum: Ramp;
    readonly gold: Ramp;
    readonly rose: Ramp;
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
    readonly neutral: Ramp;
};
type RampFamily = keyof typeof ramps;
/** Everything in tier 1, one object. A DTCG emitter is a pure function over this. */
declare const primitives: {
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
        readonly neutral: Ramp;
    };
};

export { type ContrastShiftOptions as C, type Ramp as R, RAMP_STEPS as a, type RampFamily as b, type RampStep as c, contrastShift as d, primitives as e, ramps as f, mix as m, palette as p, ramp as r, shiftLightness as s, withAlpha as w };
