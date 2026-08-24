import type { ComponentType } from 'react';

import { Hanger } from './hanger';
import type { GlyphProps } from './types';

// Glyphs oro draws itself because Feather has none, kept to Feather's spec (24 viewBox, 2pt stroke, round caps and joins) so they read as part of the same set.
const GLYPHS = {
  hanger: Hanger,
} satisfies Record<string, ComponentType<GlyphProps>>;

export type OroGlyphName = keyof typeof GLYPHS;

// Widened so Icon can look up a name that may be either an oro glyph or a Feather one.
export const ORO_GLYPHS: Record<string, ComponentType<GlyphProps>> = GLYPHS;

export type { GlyphProps };
