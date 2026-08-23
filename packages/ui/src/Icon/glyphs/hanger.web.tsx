import type { GlyphProps } from './types';

// The path is duplicated in hanger.tsx because native and web share no renderer, so a change to one without the other drifts the glyph between the app and the gallery.
export function Hanger({ size = 24, color }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 9.5V7.7a2.6 2.6 0 1 1 2.6-2.6" />
      <path d="M12 9.5L2.9 16.6a1.2 1.2 0 0 0 .8 2.1h16.6a1.2 1.2 0 0 0 .8-2.1L12 9.5z" />
    </svg>
  );
}

export default Hanger;
