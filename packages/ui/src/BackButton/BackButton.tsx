import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { forMode, radii, type Mode } from '@oro/tokens';
import { Icon } from '../Icon';
import { resolveElevation } from '../style';

/** Which surface the button sits on. Selects the matching semantic mode. */
export type BackButtonTone = 'light' | 'onDark';

export type BackButtonProps = {
  onPress: () => void;
  accessibilityLabel?: string;
  tone?: BackButtonTone;
  style?: StyleProp<ViewStyle>;
};

/** Circular 44pt back affordance: plum-tinted low shadow on light surfaces. */
export function BackButton({
  onPress,
  accessibilityLabel = 'Go back',
  tone = 'light',
  style,
}: BackButtonProps) {
  const mode: Mode = tone === 'onDark' ? 'dark' : 'light';
  const c = forMode(mode);
  const onDark = mode === 'dark';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          width: 44,
          height: 44,
          borderRadius: radii.pill,
          backgroundColor: c.surface,
          alignItems: 'center',
          justifyContent: 'center',
          // A shadow can't separate two dark surfaces — on dark the affordance
          // is defined by a hairline border instead.
          ...(onDark
            ? { borderWidth: 1, borderColor: c.border }
            : resolveElevation('low', c.shadow)),
        },
        style,
      ]}
    >
      <Icon name="arrow-left" size="md" color={c.text} />
    </TouchableOpacity>
  );
}

export default BackButton;
