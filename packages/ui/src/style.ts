import { Platform, ViewStyle } from 'react-native';
import { colors, elevation, ElevationToken, ElevationPreset } from '@oro/tokens';

/** Convert a platform-neutral elevation preset into an RN shadow style
 *  (iOS shadow* props / Android elevation), using the plum shadow color. */
export function resolveElevation(token: ElevationToken): ViewStyle {
  const preset: ElevationPreset = elevation[token];
  if (preset.androidElevation === 0 && preset.shadowOpacity === 0) return {};
  return Platform.select<ViewStyle>({
    ios: {
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: preset.shadowOffsetY },
      shadowOpacity: preset.shadowOpacity,
      shadowRadius: preset.shadowRadius,
    },
    default: { elevation: preset.androidElevation },
  }) as ViewStyle;
}
