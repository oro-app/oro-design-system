import { Platform, ViewStyle } from 'react-native';
import { colors, elevation, ElevationToken, ElevationPreset } from '@oro/tokens';

/**
 * Convert a platform-neutral elevation preset into an RN shadow style
 * (iOS shadow* props / Android elevation).
 *
 * Shadows are plum-tinted, never black. `shadowColor` defaults to the light
 * mode's shadow; pass `semantic.dark.shadow` for components on dark surfaces,
 * where the lighter plum would read as a glow rather than a shadow.
 */
export function resolveElevation(
  token: ElevationToken,
  shadowColor: string = colors.shadow,
): ViewStyle {
  const preset: ElevationPreset = elevation[token];
  if (preset.androidElevation === 0 && preset.shadowOpacity === 0) return {};
  return Platform.select<ViewStyle>({
    ios: {
      shadowColor,
      shadowOffset: { width: 0, height: preset.shadowOffsetY },
      shadowOpacity: preset.shadowOpacity,
      shadowRadius: preset.shadowRadius,
    },
    default: { elevation: preset.androidElevation },
  }) as ViewStyle;
}
