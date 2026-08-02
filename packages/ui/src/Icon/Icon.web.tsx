import * as Feather from 'react-feather';
import { colors } from '@oro/tokens';

// Web implementation of Icon — same Feather glyphs as the native build, but as
// pure SVG (react-feather) so the browser gallery needs no RN/Expo font toolchain.
export type IconName = string;
export type IconSizeToken = 'sm' | 'md' | 'lg';

const SIZES: Record<IconSizeToken, number> = { sm: 16, md: 20, lg: 24 };

export type IconProps = {
  name: IconName;
  size?: IconSizeToken | number;
  color?: string;
};

function toPascal(name: string): string {
  return name
    .split('-')
    .map((s) => (s ? s[0]!.toUpperCase() + s.slice(1) : s))
    .join('');
}

export function Icon({ name, size = 'md', color = colors.text }: IconProps) {
  const px = typeof size === 'number' ? size : SIZES[size];
  const Glyph = (Feather as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[toPascal(name)] ?? Feather.Square;
  return <Glyph size={px} color={color} />;
}

export default Icon;
