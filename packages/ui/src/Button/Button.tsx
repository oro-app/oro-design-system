import { ReactNode, useState } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import {
  brandTypography,
  buttonSizes,
  componentsForMode,
  fonts,
  forMode,
  radii,
  spacing,
  type ButtonSize,
  type ComponentTokens,
  type Mode,
  type SemanticColors,
} from '@oro/tokens';
import { resolveElevation } from '../style';

/**
 * Emphasis. One `primary` per screen.
 *
 * `provider` is the exception to that reading: it is not an emphasis step but a
 * scoped treatment for third-party sign-in buttons, which have to match the
 * mandatory Apple button sitting beside them. Do not reach for it as a generic
 * dark button — see `ProviderButtonColors` in @oro/tokens.
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'danger'
  | 'provider';

/**
 * Shape/scale, independent of emphasis:
 * - `hero`: pivotal full-screen moments (welcome, onboarding, paywall).
 *   Square (radii.none), 58pt, Fraunces label, heavy shadow. Primary only.
 *   Deliberately NOT a size — it is a brand moment, so it ignores `size`.
 * - `standard`: everyday in-flow actions. Rounded (radii.lg), Inter label.
 */
export type ButtonProminence = 'standard' | 'hero';

/** Which surface the button sits on. Selects the matching semantic mode. */
export type ButtonTone = 'light' | 'onDark';

/** What the button renders. `iconOnly` still requires `label` — it becomes the
 *  accessibility label, so an icon button can never ship unlabelled. */
export type ButtonContent = 'text' | 'iconText' | 'iconOnly';

export type { ButtonSize };

export type ButtonProps = {
  /** Visible label — and the accessibility label when `content` is `iconOnly`. */
  label: string;
  variant?: ButtonVariant;
  prominence?: ButtonProminence;
  /** Ignored when `prominence` is `hero`. */
  size?: ButtonSize;
  tone?: ButtonTone;
  content?: ButtonContent;
  /** Use an @oro/ui Icon. Required for `iconText` / `iconOnly`. */
  icon?: ReactNode;
  iconPosition?: 'leading' | 'trailing';
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

type VariantSpec = { bg?: string; text: string; borderColor?: string; hoverBg?: string };

/** Variants resolve from the semantic layer, so every one of them themes with
 *  `tone` — there is no separate on-dark palette to keep in sync. `provider` is
 *  the one that needs a component token, because no semantic role names a
 *  near-black fill on a light ground. */
function variantSpecs(
  c: SemanticColors,
  t: ComponentTokens,
): Record<ButtonVariant, VariantSpec> {
  return {
    primary: { bg: c.primaryAction, text: c.primaryActionText, hoverBg: c.primaryActionHover },
    secondary: {
      bg: c.secondaryAction,
      text: c.secondaryActionText,
      borderColor: c.secondaryActionBorder,
      hoverBg: c.hoverTint,
    },
    tertiary: { bg: undefined, text: c.textMuted, hoverBg: c.hoverTint },
    danger: {
      bg: c.surfaceDanger,
      text: c.dangerText,
      borderColor: c.dangerBorder,
      hoverBg: c.dangerSurfaceHover,
    },
    // Borderless on purpose: Apple's BLACK button draws no outline, and the
    // mismatched border weight is exactly what this treatment removes.
    provider: {
      bg: t.providerButton.background,
      text: t.providerButton.label,
      hoverBg: t.providerButton.backgroundHover,
    },
  };
}

/** Hero's geometry is fixed — it is one specific moment, not a scale step. */
const HERO = {
  height: 58,
  paddingHorizontal: spacing.xl,
  fontSize: brandTypography.cta,
  gap: spacing.sm,
} as const;

/**
 * Oro button.
 *
 * Orthogonal axes: `variant` (emphasis) × `prominence` (shape/scale) × `size` ×
 * `content`, plus `tone` for the surface it sits on. Hover is web-only
 * (react-native-web); native uses pressed.
 */
export function Button({
  label,
  variant = 'primary',
  prominence = 'standard',
  size = 'md',
  tone = 'light',
  content = 'text',
  icon,
  iconPosition = 'leading',
  disabled = false,
  onPress,
  style,
  textStyle,
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const mode: Mode = tone === 'onDark' ? 'dark' : 'light';
  const c = forMode(mode);
  const hero = prominence === 'hero';
  // Hero is always the primary emphasis.
  const v = hero ? 'primary' : variant;
  const spec = variantSpecs(c, componentsForMode(mode))[v];
  const dims = hero ? HERO : buttonSizes[size];
  const iconOnly = content === 'iconOnly';
  const showIcon = content !== 'text' && icon != null;

  const bg = disabled
    ? v === 'primary'
      ? c.primaryActionDisabled
      : spec.bg
    : hovered
      ? spec.hoverBg
      : spec.bg;

  const container: ViewStyle = {
    height: dims.height,
    // Icon-only buttons are square, so the hit target stays as large as the
    // equivalent labelled button rather than shrinking to fit the glyph.
    ...(iconOnly
      ? { width: dims.height, paddingHorizontal: 0 }
      : { paddingHorizontal: dims.paddingHorizontal }),
    borderRadius: hero ? radii.none : radii.lg,
    backgroundColor: bg ?? 'transparent',
    borderWidth: spec.borderColor ? 1 : 0,
    borderColor: disabled && v === 'primary' ? c.secondaryActionBorder : spec.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    ...(hero && !disabled ? resolveElevation('high', c.shadow) : null),
    ...(disabled && v !== 'primary' ? { opacity: 0.4 } : null),
  };

  const labelStyle: TextStyle = {
    color: disabled && v === 'primary' ? c.primaryActionDisabledText : spec.text,
    fontFamily: hero ? fonts.fraunces : fonts.interSemiBold,
    fontSize: dims.fontSize,
    letterSpacing: hero ? -0.01 * brandTypography.cta : 0.2,
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [container, pressed && !disabled ? styles.pressed : null, style]}
    >
      <View style={[styles.content, { gap: dims.gap }]}>
        {showIcon && iconPosition === 'leading' ? icon : null}
        {iconOnly ? null : <Text style={[labelStyle, textStyle]}>{label}</Text>}
        {showIcon && iconPosition === 'trailing' ? icon : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.85 },
});

export default Button;
