import { Feather } from '@expo/vector-icons';
import { colors } from '@oro/tokens';

import { ORO_GLYPHS, type OroGlyphName } from './glyphs';

/** All Feather glyph names (arrow-left, chevron-down, check, x, ...) plus the glyphs oro draws itself. */
export type IconName = keyof typeof Feather.glyphMap | OroGlyphName;
export type IconSizeToken = 'sm' | 'md' | 'lg';

const SIZES: Record<IconSizeToken, number> = { sm: 16, md: 20, lg: 24 };

export type IconProps = {
  name: IconName;
  /** Token size (sm 16 / md 20 / lg 24) or an explicit number. */
  size?: IconSizeToken | number;
  /** Defaults to colors.text. Pass a token for on-brand tinting. */
  color?: string;
};

/** Oro icon — thin wrapper over Feather so screens never hardcode a size or color. */
export function Icon({ name, size = 'md', color = colors.text }: IconProps) {
  const px = typeof size === 'number' ? size : SIZES[size];
  const OroGlyph = ORO_GLYPHS[name];

  if (OroGlyph) {
    return <OroGlyph size={px} color={color} />;
  }

  return <Feather name={name as keyof typeof Feather.glyphMap} size={px} color={color} />;
}

export default Icon;
