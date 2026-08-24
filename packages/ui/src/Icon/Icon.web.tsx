import type { ComponentType } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Grid,
  Heart,
  Plus,
  RotateCcw,
  Search,
  Sliders,
  Square,
  User,
  X,
} from 'react-feather';
import { colors } from '@oro/tokens';

import { ORO_GLYPHS } from './glyphs';

// Web implementation of Icon — same Feather glyphs as the native build, but as
// pure SVG (react-feather) so the browser gallery needs no RN/Expo font toolchain.
// Glyphs are named imports (NOT `import * as Feather`) so bundlers tree-shake the
// other ~275 icons out of consumer bundles. Add to GLYPHS when the curated set grows.
export type IconName = string;
export type IconSizeToken = 'sm' | 'md' | 'lg';

const SIZES: Record<IconSizeToken, number> = { sm: 16, md: 20, lg: 24 };

type GlyphComponent = ComponentType<{ size?: number | string; color?: string }>;

const GLYPHS: Record<string, GlyphComponent> = {
  ...ORO_GLYPHS,
  'alert-circle': AlertCircle,
  'arrow-left': ArrowLeft,
  'book-open': BookOpen,
  camera: Camera,
  check: Check,
  'chevron-down': ChevronDown,
  'chevron-right': ChevronRight,
  grid: Grid,
  heart: Heart,
  plus: Plus,
  'rotate-ccw': RotateCcw,
  search: Search,
  sliders: Sliders,
  user: User,
  x: X,
};

export type IconProps = {
  name: IconName;
  size?: IconSizeToken | number;
  color?: string;
};

export function Icon({ name, size = 'md', color = colors.text }: IconProps) {
  const px = typeof size === 'number' ? size : SIZES[size];
  const Glyph = GLYPHS[name] ?? Square;
  return <Glyph size={px} color={color} />;
}

export default Icon;
