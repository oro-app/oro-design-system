import { ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { componentsForMode, fonts, pillSizes, radii, type Mode, type PillSize } from '@oro/tokens';

/** Which surface the pill sits on. Selects the matching semantic mode. */
export type PillTone = 'light' | 'onDark';

export type { PillSize };

export type PillProps = {
  label: string;
  /** Selected state. Filled rather than outlined. */
  active?: boolean;
  size?: PillSize;
  tone?: PillTone;
  disabled?: boolean;
  onPress?: () => void;
  /** Use an @oro/ui Icon. */
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** @deprecated pass `leadingIcon` instead — kept so existing children still render. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/**
 * Filter / selection chip. Full radius.
 *
 * On dark surfaces the resting pill is an outline rather than a filled chip —
 * a white surface on plum reads as a card, not a filter — so `tone` changes the
 * treatment, not just the colors. Selection stays filled in both tones.
 */
export function Pill({
  label,
  active = false,
  size = 'md',
  tone = 'light',
  disabled = false,
  onPress,
  leadingIcon,
  trailingIcon,
  children,
  style,
  textStyle,
}: PillProps) {
  const mode: Mode = tone === 'onDark' ? 'dark' : 'light';
  const t = componentsForMode(mode).pill;
  const dims = pillSizes[size];

  const container: ViewStyle = {
    paddingVertical: dims.paddingVertical,
    paddingHorizontal: dims.paddingHorizontal,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: active ? t.borderSelected : t.border,
    backgroundColor: disabled ? t.backgroundDisabled : active ? t.backgroundSelected : t.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...(disabled ? { opacity: 0.5 } : null),
  };

  const label_: TextStyle = {
    color: disabled ? t.labelDisabled : active ? t.labelSelected : t.label,
    fontFamily: fonts.interMedium,
    fontSize: dims.fontSize,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected: active, disabled }}
      accessibilityLabel={label}
      style={[container, style]}
    >
      <View style={[styles.content, { gap: dims.gap }]}>
        {leadingIcon ?? children}
        <Text style={[label_, textStyle]}>{label}</Text>
        {trailingIcon}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: { flexDirection: 'row', alignItems: 'center' },
});

export default Pill;
