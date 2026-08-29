import {
  colors,
  palette,
  radii,
  ramps,
  regularSpacing
} from "./chunk-SNALUFOR.js";

// src/tailwind.ts
var oroPreset = {
  theme: {
    extend: {
      // EVERY key here is `oro-` prefixed, deliberately.
      //
      // Tailwind ships its own `neutral`, `rose`, `border`, `background` and
      // `surface` scales. Registering bare keys under `extend` OVERRIDES them
      // for the whole consuming app: an existing `text-neutral-500` silently
      // changes color, and `neutral-950` — which Tailwind ships and our ramp
      // does not — becomes an undefined class that drops with no error. On a
      // surface whose pixels are canonical that is a silent regression, and it
      // would land the moment a consumer bumps the package.
      //
      // Namespacing costs one prefix and makes collisions impossible.
      colors: {
        // Brand hexes. `oro-plum` === `oro-plum-800` (the ramp pins the base
        // hex exactly at its step), likewise `oro-gold` === `oro-gold-400`.
        oro: {
          cream: palette.cream,
          plum: palette.plum,
          gold: palette.gold,
          ink: palette.ink,
          paper: palette.paper,
          white: palette.white,
          rose: palette.rose
        },
        // Tonal ramps — `bg-oro-plum-600`, `text-oro-neutral-400`, …
        "oro-plum": ramps.plum,
        "oro-gold": ramps.gold,
        "oro-rose": ramps.rose,
        "oro-neutral": ramps.neutral,
        // Semantic roles.
        // Small gold text on a light surface, at AA. Exposed as a class because
        // the obvious guess — `text-oro-gold` (the base hex, 2.10:1) or
        // `text-oro-gold-600` (4.27:1) — is the wrong answer, and the ramp
        // classes give no hint of that. `text-oro-accent-text` is the one that
        // passes.
        "oro-accent-text": colors.accentText,
        "oro-surface": colors.surface,
        "oro-background": colors.background,
        "oro-primary-action": colors.primaryAction,
        "oro-border": colors.border
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      spacing: {
        "oro-xs": `${regularSpacing.xs}px`,
        "oro-sm": `${regularSpacing.sm}px`,
        "oro-md": `${regularSpacing.md}px`,
        "oro-lg": `${regularSpacing.lg}px`,
        "oro-xl": `${regularSpacing.xl}px`,
        "oro-xxl": `${regularSpacing.xxl}px`
      },
      borderRadius: {
        "oro-none": `${radii.none}px`,
        "oro-sm": `${radii.sm}px`,
        "oro-md": `${radii.md}px`,
        "oro-lg": `${radii.lg}px`,
        "oro-xl": `${radii.xl}px`,
        "oro-pill": `${radii.pill}px`
      }
    }
  }
};
var tailwind_default = oroPreset;
export {
  tailwind_default as default,
  oroPreset
};
//# sourceMappingURL=tailwind.js.map