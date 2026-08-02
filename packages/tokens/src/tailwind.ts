// Tailwind preset for the landing (oro-landing). Import in tailwind.config.js:
//   const { oroPreset } = require('@oro/tokens/tailwind');
//   module.exports = { presets: [oroPreset], ... }
// Keeps the web surface on the same color/type/spacing/radii source of truth as the app.

import { palette, colors } from './colors';
import { regularSpacing } from './spacing';
import { radii } from './radii';

export const oroPreset = {
  theme: {
    extend: {
      colors: {
        oro: {
          cream: palette.cream,
          plum: palette.plum,
          gold: palette.gold,
          ink: palette.ink,
          paper: palette.paper,
          white: palette.white,
          rose: palette.rose,
        },
        surface: colors.surface,
        background: colors.background,
        'primary-action': colors.primaryAction,
        border: colors.border,
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'oro-xs': `${regularSpacing.xs}px`,
        'oro-sm': `${regularSpacing.sm}px`,
        'oro-md': `${regularSpacing.md}px`,
        'oro-lg': `${regularSpacing.lg}px`,
        'oro-xl': `${regularSpacing.xl}px`,
        'oro-xxl': `${regularSpacing.xxl}px`,
      },
      borderRadius: {
        'oro-none': `${radii.none}px`,
        'oro-sm': `${radii.sm}px`,
        'oro-md': `${radii.md}px`,
        'oro-lg': `${radii.lg}px`,
        'oro-xl': `${radii.xl}px`,
        'oro-pill': `${radii.pill}px`,
      },
    },
  },
} as const;

export default oroPreset;
