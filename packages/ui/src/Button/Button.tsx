import { ReactNode, useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { colors, fonts, brandTypography, typography, radii, spacing } from '@oro/tokens';
import { resolveElevation } from '../style';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
/**
 * Prominence is the shape/scale axis, independent of emphasis (variant):
 * - `hero`: pivotal full-screen moments (welcome, onboarding, paywall).
 *   Square (radii.none), 58pt, Fraunces label, heavy shadow. Primary only.
 * - `standard`: everyday in-flow actions. Rounded (radii.lg), Inter label.
 */
export type ButtonProminence = 'standard' | 'hero';

export type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  prominence?: ButtonProminence;
  disabled?: boolean;
  onPress?: () => void;
  /** Leading icon (use @oro/ui Icon). */
  leadingIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/**
 * Oro button. `variant` = emphasis (one primary per screen); `prominence` =
 * shape/scale. Hover is web-only (react-native-web); native uses pressed.
 */
export function Button({
  label,
  variant = 'primary',
  prominence = 'standard',
  disabled = false,
  onPress,
  leadingIcon,
  style,
  textStyle,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const hero = prominence === 'hero';
  // Hero is always the primary emphasis.
  const v = hero ? 'primary' : variant;
  const spec = VARIANTS[v];

  const bg =
    disabled
      ? v === 'primary'
        ? colors.primaryActionDisabled
        : spec.bg
      : hovered
        ? spec.hoverBg
        : spec.bg;

  const container: ViewStyle = {
    height: hero ? 58 : 52,
    paddingHorizontal: hero ? spacing.xl : spacing.lg,
    borderRadius: hero ? radii.none : radii.lg,
    backgroundColor: bg ?? 'transparent',
    borderWidth: spec.borderColor ? 1 : 0,
    borderColor: disabled && v === 'primary' ? colors.secondaryActionBorder : spec.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    ...(hero && !disabled ? resolveElevation('high') : null),
    ...(disabled && v !== 'primary' ? { opacity: 0.4 } : null),
  };

  const labelStyle: TextStyle = {
    color: disabled && v === 'primary' ? colors.primaryActionDisabledText : spec.text,
    fontFamily: hero ? fonts.fraunces : fonts.interSemiBold,
    fontSize: hero ? brandTypography.cta : typography.subtext,
    letterSpacing: hero ? -0.01 * brandTypography.cta : 0.2,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [container, pressed && !disabled ? styles.pressed : null, style]}
    >
      <View style={styles.content}>
        {leadingIcon}
        <Text style={[labelStyle, textStyle]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const VARIANTS: Record<ButtonVariant, { bg?: string; text: string; borderColor?: string; hoverBg?: string }> = {
  primary: { bg: colors.primaryAction, text: colors.primaryActionText, hoverBg: colors.primaryActionHover },
  secondary: { bg: colors.secondaryAction, text: colors.secondaryActionText, borderColor: colors.secondaryActionBorder, hoverBg: colors.hoverTint },
  tertiary: { bg: undefined, text: colors.textMuted, hoverBg: colors.hoverTint },
  danger: { bg: colors.surfaceDanger, text: colors.dangerText, borderColor: colors.dangerBorder, hoverBg: colors.dangerSurfaceHover },
};

const styles = StyleSheet.create({
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  pressed: { opacity: 0.85 },
});

export default Button;
