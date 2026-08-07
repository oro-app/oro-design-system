import * as react from 'react';
import { ReactNode } from 'react';
import { StyleProp, ViewStyle, TextStyle, ViewProps, PressableProps, EasingFunction } from 'react-native';
import { ButtonSize, PillSize, ElevationToken } from '@oro/tokens';
import { Feather } from '@expo/vector-icons';

/**
 * Emphasis. One `primary` per screen.
 *
 * `provider` is the exception to that reading: it is not an emphasis step but a
 * scoped treatment for third-party sign-in buttons, which have to match the
 * mandatory Apple button sitting beside them. Do not reach for it as a generic
 * dark button — see `ProviderButtonColors` in @oro/tokens.
 */
type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'provider';
/**
 * Shape/scale, independent of emphasis:
 * - `hero`: pivotal full-screen moments (welcome, onboarding, paywall).
 *   Square (radii.none), 58pt, Fraunces label, heavy shadow. Primary only.
 *   Deliberately NOT a size — it is a brand moment, so it ignores `size`.
 * - `standard`: everyday in-flow actions. Rounded (radii.lg), Inter label.
 */
type ButtonProminence = 'standard' | 'hero';
/** Which surface the button sits on. Selects the matching semantic mode. */
type ButtonTone = 'light' | 'onDark';
/** What the button renders. `iconOnly` still requires `label` — it becomes the
 *  accessibility label, so an icon button can never ship unlabelled. */
type ButtonContent = 'text' | 'iconText' | 'iconOnly';

type ButtonProps = {
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
/**
 * Oro button.
 *
 * Orthogonal axes: `variant` (emphasis) × `prominence` (shape/scale) × `size` ×
 * `content`, plus `tone` for the surface it sits on. Hover is web-only
 * (react-native-web); native uses pressed.
 */
declare function Button({ label, variant, prominence, size, tone, content, icon, iconPosition, disabled, onPress, style, textStyle, }: ButtonProps): react.JSX.Element;

/** Which surface the pill sits on. Selects the matching semantic mode. */
type PillTone = 'light' | 'onDark';

type PillProps = {
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
declare function Pill({ label, active, size, tone, disabled, onPress, leadingIcon, trailingIcon, children, style, textStyle, }: PillProps): react.JSX.Element;

/** All Feather glyph names (arrow-left, chevron-down, check, x, ...). */
type IconName = keyof typeof Feather.glyphMap;
type IconSizeToken = 'sm' | 'md' | 'lg';
type IconProps = {
    name: IconName;
    /** Token size (sm 16 / md 20 / lg 24) or an explicit number. */
    size?: IconSizeToken | number;
    /** Defaults to colors.text. Pass a token for on-brand tinting. */
    color?: string;
};
/** Oro icon — thin wrapper over Feather so screens never hardcode a size or color. */
declare function Icon({ name, size, color }: IconProps): react.JSX.Element;

/** Which surface the button sits on. Selects the matching semantic mode. */
type BackButtonTone = 'light' | 'onDark';
type BackButtonProps = {
    onPress: () => void;
    accessibilityLabel?: string;
    tone?: BackButtonTone;
    style?: StyleProp<ViewStyle>;
};
/** Circular 44pt back affordance: plum-tinted low shadow on light surfaces. */
declare function BackButton({ onPress, accessibilityLabel, tone, style, }: BackButtonProps): react.JSX.Element;

/** Which surface the dropdown sits on. Selects the matching semantic mode. */
type DropdownTone = 'light' | 'onDark';
type DropdownOption<T extends string = string> = {
    value: T;
    label: string;
    hint?: string;
};
type DropdownProps<T extends string = string> = {
    label?: string;
    value: T;
    options: DropdownOption<T>[];
    onChange: (value: T) => void;
    placeholder?: string;
    disabled?: boolean;
    tone?: DropdownTone;
    accessibilityLabel?: string;
    triggerStyle?: StyleProp<ViewStyle>;
    triggerTextStyle?: StyleProp<TextStyle>;
    sheetTitle?: string;
};
/**
 * Oro dropdown (Option A spec): quiet muted label (Inter Medium, textSubtle),
 * the value carries the focus, soft rectangle (radii.lg), balanced padding.
 * Options open in a SlideUpSheet.
 */
declare function Dropdown<T extends string = string>({ label, value, options, onChange, placeholder, disabled, tone, accessibilityLabel, triggerStyle, triggerTextStyle, sheetTitle, }: DropdownProps<T>): react.JSX.Element;

/** Which surface the state sits on. Selects the matching semantic mode. */
type LoadErrorStateTone = 'light' | 'onDark';
type LoadErrorStateProps = {
    onRetry?: () => void;
    note?: string;
    tone?: LoadErrorStateTone;
};
/** Full-area load-failure state: icon ring, lowercase Fraunces title with the
 *  single italic-plum accent word, optional retry pill. */
declare function LoadErrorState({ onRetry, note, tone }: LoadErrorStateProps): react.JSX.Element;

type FadeUpSectionProps = ViewProps & {
    delay?: number;
    distance?: number;
    duration?: number;
    disabled?: boolean;
    /**
     * Drives replay: while false the section is held hidden; each false→true flip
     * replays the reveal. Wire this to navigation focus in the app (the port of
     * `replayOnFocus`, without a router dependency). Omit for reveal-on-mount.
     */
    active?: boolean;
};
/** Editorial reveal: fades in while translating up. Reveal-on-mount by default. */
declare function FadeUpSection({ delay, distance, duration, disabled, active, style, children, ...rest }: FadeUpSectionProps): react.JSX.Element;

type PressSpringPressableProps = PressableProps & {
    pressedScale?: number;
    springDamping?: number;
    springStiffness?: number;
    outerStyle?: StyleProp<ViewStyle>;
    /** Called on press-in; wire device haptics here (e.g. expo-haptics) — the
     *  package itself has no haptics dependency. */
    onHaptic?: () => void;
};
/** Pressable that springs down to `pressedScale` while pressed. */
declare function PressSpringPressable({ pressedScale, springDamping, springStiffness, onHaptic, onPressIn, onPressOut, outerStyle, style, children, disabled, ...rest }: PressSpringPressableProps): react.JSX.Element;

type SkeletonBlockProps = {
    width?: ViewStyle['width'];
    height?: ViewStyle['height'];
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
};
/**
 * Loading placeholder: muted plum block with a slow sheen pulse. (The app's
 * original used an expo-linear-gradient sweep; here the sheen is an opacity
 * pulse so the package stays dependency-free.)
 */
declare function SkeletonBlock({ width, height, borderRadius, style, }: SkeletonBlockProps): react.JSX.Element;

type SlideUpSheetProps = {
    visible: boolean;
    onClose: () => void;
    children: ReactNode;
    /** Render without the RN Modal wrapper (e.g. when a parent already hosts one). */
    withModal?: boolean;
};
/** Bottom sheet: dimmed backdrop + content sliding up from the bottom edge. */
declare function SlideUpSheet({ visible, onClose, children, withModal }: SlideUpSheetProps): react.JSX.Element | null;

/** Token easing curves resolved into RN Easing functions (core Animated). */
declare const motionEasing: Record<string, EasingFunction> & {
    standard: EasingFunction;
    enter: EasingFunction;
    exit: EasingFunction;
    spring: EasingFunction;
    reveal: EasingFunction;
    sheen: EasingFunction;
};

/** Tracks the OS reduce-motion setting. All @oro/ui motion primitives respect it
 *  (skip straight to the resting state). On react-native-web this resolves false. */
declare function useReducedMotion(): boolean;

/**
 * Convert a platform-neutral elevation preset into an RN shadow style
 * (iOS shadow* props / Android elevation).
 *
 * Shadows are plum-tinted, never black. `shadowColor` defaults to the light
 * mode's shadow; pass `semantic.dark.shadow` for components on dark surfaces,
 * where the lighter plum would read as a glow rather than a shadow.
 */
declare function resolveElevation(token: ElevationToken, shadowColor?: string): ViewStyle;

export { BackButton, type BackButtonProps, type BackButtonTone, Button, type ButtonProminence, type ButtonProps, type ButtonVariant, Dropdown, type DropdownOption, type DropdownProps, type DropdownTone, FadeUpSection, type FadeUpSectionProps, Icon, type IconName, type IconProps, type IconSizeToken, LoadErrorState, type LoadErrorStateProps, type LoadErrorStateTone, Pill, type PillProps, PressSpringPressable, type PressSpringPressableProps, SkeletonBlock, type SkeletonBlockProps, SlideUpSheet, type SlideUpSheetProps, motionEasing, resolveElevation, useReducedMotion };
