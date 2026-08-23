import Svg, { Path } from 'react-native-svg';

import type { GlyphProps } from './types';

// The path is duplicated in hanger.web.tsx because native and web share no renderer, so a change to one without the other drifts the glyph between the app and the gallery.
export function Hanger({ size = 24, color }: GlyphProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M12 9.5V7.7a2.6 2.6 0 1 1 2.6-2.6" />
      <Path d="M12 9.5L2.9 16.6a1.2 1.2 0 0 0 .8 2.1h16.6a1.2 1.2 0 0 0 .8-2.1L12 9.5z" />
    </Svg>
  );
}

export default Hanger;
