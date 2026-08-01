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
import { colors, fonts, brandTypography, typography, radii, spacing } from '@oro/tokens';
import { resolveElevation } from '../style';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'hero' | 'compact';

export type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onPress?: () => void;
  /** Leading content (icon) rendered before the label. */
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/**
 * Oro action button. Square corners (radii.none) are the on-brand hero convention.
 * Primary uses a Fraunces label; secondary/tertiary/danger use Inter.
 */
export function Button({
  label,
  variant = 'primary',
  size = 'hero',
  disabled = false,
  onPress,
  children,
  style,
  textStyle,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];

  const container: ViewStyle = {
    height: s.height,
    paddingHorizontal: s.paddingH,
    borderRadius: radii.none,
    backgroundColor: v.bg,
    borderWidth: v.borderColor ? 1 : 0,
    borderColor: v.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    ...(variant === 'primary' && !disabled ? resolveElevation('medium') : null),
  };

  const disabledContainer: ViewStyle | null = disabled
    ? variant === 'primary'
      ? { backgroundColor: colors.primaryActionDisabled, borderWidth: 1, borderColor: colors.secondaryActionBorder }
      : { opacity: 0.4 }
    : null;

  const labelStyle: TextStyle = {
    color: disabled && variant === 'primary' ? colors.primaryActionDisabledText : v.text,
    fontFamily: variant === 'primary' ? fonts.fraunces : fonts.interSemiBold,
    fontSize: variant === 'primary' ? (size === 'hero' ? brandTypography.cta : typography.default) : (size === 'hero' ? typography.default : typography.subtext),
    letterSpacing: variant === 'primary' ? -0.01 * brandTypography.cta : 0.2,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[container, disabledContainer, style]}
    >
      <View style={styles.content}>
        {children}
        <Text style={[labelStyle, textStyle]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const VARIANTS: Record<ButtonVariant, { bg: string; text: string; borderColor?: string }> = {
  primary: { bg: colors.primaryAction, text: colors.primaryActionText },
  secondary: { bg: colors.secondaryAction, text: colors.secondaryActionText, borderColor: colors.secondaryActionBorder },
  tertiary: { bg: 'transparent', text: colors.textMuted },
  danger: { bg: colors.surfaceDanger, text: colors.dangerText, borderColor: colors.dangerBorder },
};

const SIZES: Record<ButtonSize, { height: number; paddingH: number }> = {
  hero: { height: 58, paddingH: spacing.xl },
  compact: { height: 44, paddingH: spacing.lg },
};

const styles = StyleSheet.create({
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
});

export default Button;
