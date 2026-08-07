// src/Button/Button.tsx
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  brandTypography,
  buttonSizes,
  componentsForMode,
  fonts,
  forMode,
  radii,
  spacing
} from "@oro/tokens";

// src/style.ts
import { Platform } from "react-native";
import { colors, elevation } from "@oro/tokens";
function resolveElevation(token, shadowColor = colors.shadow) {
  const preset = elevation[token];
  if (preset.androidElevation === 0 && preset.shadowOpacity === 0) return {};
  return Platform.select({
    ios: {
      shadowColor,
      shadowOffset: { width: 0, height: preset.shadowOffsetY },
      shadowOpacity: preset.shadowOpacity,
      shadowRadius: preset.shadowRadius
    },
    default: { elevation: preset.androidElevation }
  });
}

// src/Button/Button.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function variantSpecs(c, t) {
  return {
    primary: { bg: c.primaryAction, text: c.primaryActionText, hoverBg: c.primaryActionHover },
    secondary: {
      bg: c.secondaryAction,
      text: c.secondaryActionText,
      borderColor: c.secondaryActionBorder,
      hoverBg: c.hoverTint
    },
    tertiary: { bg: void 0, text: c.textMuted, hoverBg: c.hoverTint },
    danger: {
      bg: c.surfaceDanger,
      text: c.dangerText,
      borderColor: c.dangerBorder,
      hoverBg: c.dangerSurfaceHover
    },
    // Borderless on purpose: Apple's BLACK button draws no outline, and the
    // mismatched border weight is exactly what this treatment removes.
    provider: {
      bg: t.providerButton.background,
      text: t.providerButton.label,
      hoverBg: t.providerButton.backgroundHover
    }
  };
}
var HERO = {
  height: 58,
  paddingHorizontal: spacing.xl,
  fontSize: brandTypography.cta,
  gap: spacing.sm
};
function Button({
  label,
  variant = "primary",
  prominence = "standard",
  size = "md",
  tone = "light",
  content = "text",
  icon,
  iconPosition = "leading",
  disabled = false,
  onPress,
  style,
  textStyle
}) {
  const [hovered, setHovered] = useState(false);
  const mode = tone === "onDark" ? "dark" : "light";
  const c = forMode(mode);
  const hero = prominence === "hero";
  const v = hero ? "primary" : variant;
  const spec = variantSpecs(c, componentsForMode(mode))[v];
  const dims = hero ? HERO : buttonSizes[size];
  const iconOnly = content === "iconOnly";
  const showIcon = content !== "text" && icon != null;
  const bg = disabled ? v === "primary" ? c.primaryActionDisabled : spec.bg : hovered ? spec.hoverBg : spec.bg;
  const container = {
    height: dims.height,
    // Icon-only buttons are square, so the hit target stays as large as the
    // equivalent labelled button rather than shrinking to fit the glyph.
    ...iconOnly ? { width: dims.height, paddingHorizontal: 0 } : { paddingHorizontal: dims.paddingHorizontal },
    borderRadius: hero ? radii.none : radii.lg,
    backgroundColor: bg ?? "transparent",
    borderWidth: spec.borderColor ? 1 : 0,
    borderColor: disabled && v === "primary" ? c.secondaryActionBorder : spec.borderColor,
    alignItems: "center",
    justifyContent: "center",
    ...hero && !disabled ? resolveElevation("high", c.shadow) : null,
    ...disabled && v !== "primary" ? { opacity: 0.4 } : null
  };
  const labelStyle = {
    color: disabled && v === "primary" ? c.primaryActionDisabledText : spec.text,
    fontFamily: hero ? fonts.fraunces : fonts.interSemiBold,
    fontSize: dims.fontSize,
    letterSpacing: hero ? -0.01 * brandTypography.cta : 0.2
  };
  return /* @__PURE__ */ jsx(
    Pressable,
    {
      accessibilityRole: "button",
      accessibilityState: { disabled },
      accessibilityLabel: label,
      onPress,
      disabled,
      onHoverIn: () => setHovered(true),
      onHoverOut: () => setHovered(false),
      style: ({ pressed }) => [container, pressed && !disabled ? styles.pressed : null, style],
      children: /* @__PURE__ */ jsxs(View, { style: [styles.content, { gap: dims.gap }], children: [
        showIcon && iconPosition === "leading" ? icon : null,
        iconOnly ? null : /* @__PURE__ */ jsx(Text, { style: [labelStyle, textStyle], children: label }),
        showIcon && iconPosition === "trailing" ? icon : null
      ] })
    }
  );
}
var styles = StyleSheet.create({
  content: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.85 }
});

// src/Pill/Pill.tsx
import {
  StyleSheet as StyleSheet2,
  Text as Text2,
  TouchableOpacity,
  View as View2
} from "react-native";
import { componentsForMode as componentsForMode2, fonts as fonts2, pillSizes, radii as radii2 } from "@oro/tokens";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function Pill({
  label,
  active = false,
  size = "md",
  tone = "light",
  disabled = false,
  onPress,
  leadingIcon,
  trailingIcon,
  children,
  style,
  textStyle
}) {
  const mode = tone === "onDark" ? "dark" : "light";
  const t = componentsForMode2(mode).pill;
  const dims = pillSizes[size];
  const container = {
    paddingVertical: dims.paddingVertical,
    paddingHorizontal: dims.paddingHorizontal,
    borderRadius: radii2.pill,
    borderWidth: 1.5,
    borderColor: active ? t.borderSelected : t.border,
    backgroundColor: disabled ? t.backgroundDisabled : active ? t.backgroundSelected : t.background,
    alignItems: "center",
    justifyContent: "center",
    ...disabled ? { opacity: 0.5 } : null
  };
  const label_ = {
    color: disabled ? t.labelDisabled : active ? t.labelSelected : t.label,
    fontFamily: fonts2.interMedium,
    fontSize: dims.fontSize
  };
  return /* @__PURE__ */ jsx2(
    TouchableOpacity,
    {
      onPress,
      disabled,
      activeOpacity: 0.8,
      accessibilityRole: "button",
      accessibilityState: { selected: active, disabled },
      accessibilityLabel: label,
      style: [container, style],
      children: /* @__PURE__ */ jsxs2(View2, { style: [styles2.content, { gap: dims.gap }], children: [
        leadingIcon ?? children,
        /* @__PURE__ */ jsx2(Text2, { style: [label_, textStyle], children: label }),
        trailingIcon
      ] })
    }
  );
}
var styles2 = StyleSheet2.create({
  content: { flexDirection: "row", alignItems: "center" }
});

// src/Icon/Icon.tsx
import { Feather } from "@expo/vector-icons";
import { colors as colors2 } from "@oro/tokens";
import { jsx as jsx3 } from "react/jsx-runtime";
var SIZES = { sm: 16, md: 20, lg: 24 };
function Icon({ name, size = "md", color = colors2.text }) {
  const px = typeof size === "number" ? size : SIZES[size];
  return /* @__PURE__ */ jsx3(Feather, { name, size: px, color });
}

// src/BackButton/BackButton.tsx
import { TouchableOpacity as TouchableOpacity2 } from "react-native";
import { forMode as forMode2, radii as radii3 } from "@oro/tokens";
import { jsx as jsx4 } from "react/jsx-runtime";
function BackButton({
  onPress,
  accessibilityLabel = "Go back",
  tone = "light",
  style
}) {
  const mode = tone === "onDark" ? "dark" : "light";
  const c = forMode2(mode);
  const onDark = mode === "dark";
  return /* @__PURE__ */ jsx4(
    TouchableOpacity2,
    {
      onPress,
      activeOpacity: 0.7,
      accessibilityRole: "button",
      accessibilityLabel,
      style: [
        {
          width: 44,
          height: 44,
          borderRadius: radii3.pill,
          backgroundColor: c.surface,
          alignItems: "center",
          justifyContent: "center",
          // A shadow can't separate two dark surfaces — on dark the affordance
          // is defined by a hairline border instead.
          ...onDark ? { borderWidth: 1, borderColor: c.border } : resolveElevation("low", c.shadow)
        },
        style
      ],
      children: /* @__PURE__ */ jsx4(Icon, { name: "arrow-left", size: "md", color: c.text })
    }
  );
}

// src/Dropdown/Dropdown.tsx
import { useMemo, useState as useState4 } from "react";
import {
  Pressable as Pressable3,
  ScrollView,
  StyleSheet as StyleSheet4,
  Text as Text3,
  TouchableOpacity as TouchableOpacity3,
  useWindowDimensions,
  View as View4
} from "react-native";
import {
  componentsForMode as componentsForMode3,
  fonts as fonts3,
  forMode as forMode3,
  radii as radii4,
  spacing as spacing2,
  typography
} from "@oro/tokens";

// src/motion/SlideUpSheet/SlideUpSheet.tsx
import { useEffect as useEffect2, useState as useState3 } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform as Platform2,
  Pressable as Pressable2,
  StyleSheet as StyleSheet3,
  View as View3
} from "react-native";
import { colors as colors3, motion } from "@oro/tokens";

// src/motion/useReducedMotion.ts
import { useEffect, useState as useState2 } from "react";
import { AccessibilityInfo } from "react-native";
function useReducedMotion() {
  const [reduced, setReduced] = useState2(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((value) => {
      if (mounted) setReduced(Boolean(value));
    });
    const sub = AccessibilityInfo.addEventListener?.(
      "reduceMotionChanged",
      (value) => setReduced(Boolean(value))
    );
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);
  return reduced;
}

// src/motion/SlideUpSheet/SlideUpSheet.tsx
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function screenHeight() {
  try {
    return Dimensions.get("window").height || 800;
  } catch {
    return 800;
  }
}
function SlideUpSheet({ visible, onClose, children, withModal = true }) {
  const reduced = useReducedMotion();
  const [translateY] = useState3(() => new Animated.Value(screenHeight()));
  const [backdropOpacity] = useState3(() => new Animated.Value(0));
  useEffect2(() => {
    if (!visible) return;
    if (reduced) {
      translateY.setValue(0);
      backdropOpacity.setValue(1);
      return;
    }
    translateY.setValue(screenHeight());
    backdropOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: motion.duration.slow,
        useNativeDriver: true
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: motion.duration.slow,
        useNativeDriver: true
      })
    ]).start();
  }, [visible, reduced, translateY, backdropOpacity]);
  const content = /* @__PURE__ */ jsxs3(View3, { style: styles3.root, children: [
    /* @__PURE__ */ jsx5(Animated.View, { style: [styles3.backdrop, { opacity: backdropOpacity }], children: /* @__PURE__ */ jsx5(
      Pressable2,
      {
        style: StyleSheet3.absoluteFill,
        onPress: onClose,
        accessibilityRole: "button",
        accessibilityLabel: "Close"
      }
    ) }),
    /* @__PURE__ */ jsx5(KeyboardAvoidingView, { behavior: Platform2.OS === "ios" ? "padding" : void 0, children: /* @__PURE__ */ jsx5(Animated.View, { style: { transform: [{ translateY }] }, children }) })
  ] });
  if (!withModal) {
    return visible ? content : null;
  }
  return /* @__PURE__ */ jsx5(
    Modal,
    {
      visible,
      transparent: true,
      animationType: "none",
      onRequestClose: onClose,
      statusBarTranslucent: true,
      children: content
    }
  );
}
var styles3 = StyleSheet3.create({
  root: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "flex-end"
  },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors3.overlayStrong
  }
});

// src/Dropdown/Dropdown.tsx
import { Fragment, jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
function Dropdown({
  label,
  value,
  options,
  onChange,
  placeholder = "select\u2026",
  disabled = false,
  tone = "light",
  accessibilityLabel,
  triggerStyle,
  triggerTextStyle,
  sheetTitle
}) {
  const mode = tone === "onDark" ? "dark" : "light";
  const c = forMode3(mode);
  const styles4 = STYLES[mode];
  const [isOpen, setIsOpen] = useState4(false);
  const windowHeight = useWindowDimensions().height;
  const sheetMaxHeight = windowHeight ? Math.round(windowHeight * 0.7) : 560;
  const activeOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );
  const triggerLabel = activeOption?.label ?? placeholder;
  const handleSelect = (next) => {
    setIsOpen(false);
    if (next !== value) {
      onChange(next);
    }
  };
  return /* @__PURE__ */ jsxs4(Fragment, { children: [
    /* @__PURE__ */ jsxs4(
      TouchableOpacity3,
      {
        onPress: () => !disabled && setIsOpen(true),
        style: [styles4.trigger, disabled && styles4.triggerDisabled, triggerStyle],
        activeOpacity: 0.85,
        accessibilityRole: "button",
        accessibilityLabel: accessibilityLabel ?? `${label ?? "Filter"}: ${triggerLabel}`,
        accessibilityState: { expanded: isOpen, disabled },
        children: [
          label ? /* @__PURE__ */ jsx6(Text3, { style: styles4.triggerLabelText, children: label }) : null,
          /* @__PURE__ */ jsxs4(View4, { style: styles4.triggerRow, children: [
            /* @__PURE__ */ jsx6(Text3, { numberOfLines: 1, style: [styles4.triggerValue, triggerTextStyle], children: triggerLabel }),
            /* @__PURE__ */ jsx6(Icon, { name: "chevron-down", size: 16, color: c.secondaryActionIcon })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx6(SlideUpSheet, { visible: isOpen, onClose: () => setIsOpen(false), children: /* @__PURE__ */ jsx6(Pressable3, { onPress: () => {
    }, style: styles4.sheetWrap, children: /* @__PURE__ */ jsxs4(View4, { style: [styles4.sheet, { maxHeight: sheetMaxHeight }], children: [
      /* @__PURE__ */ jsx6(View4, { style: styles4.handle }),
      sheetTitle ? /* @__PURE__ */ jsx6(Text3, { style: styles4.sheetTitle, children: sheetTitle }) : null,
      /* @__PURE__ */ jsx6(
        ScrollView,
        {
          bounces: false,
          showsVerticalScrollIndicator: false,
          contentContainerStyle: styles4.optionsList,
          children: options.map((option) => {
            const isActive = option.value === value;
            return /* @__PURE__ */ jsxs4(
              TouchableOpacity3,
              {
                onPress: () => handleSelect(option.value),
                style: [styles4.option, isActive && styles4.optionActive],
                activeOpacity: 0.7,
                accessibilityRole: "button",
                accessibilityState: { selected: isActive },
                accessibilityLabel: option.label,
                children: [
                  /* @__PURE__ */ jsxs4(View4, { style: styles4.optionCopy, children: [
                    /* @__PURE__ */ jsx6(Text3, { style: [styles4.optionLabel, isActive && styles4.optionLabelActive], children: option.label }),
                    option.hint ? /* @__PURE__ */ jsx6(Text3, { style: styles4.optionHint, children: option.hint }) : null
                  ] }),
                  isActive ? /* @__PURE__ */ jsx6(Icon, { name: "check", size: 18, color: c.primaryAction }) : null
                ]
              },
              option.value
            );
          })
        }
      )
    ] }) }) })
  ] });
}
var makeStyles = (c, t) => StyleSheet4.create({
  trigger: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingVertical: spacing2.sm + 2,
    paddingHorizontal: spacing2.md,
    borderRadius: radii4.lg,
    borderWidth: 1,
    borderColor: t.triggerBorder,
    backgroundColor: t.trigger
  },
  triggerDisabled: {
    opacity: 0.5
  },
  triggerLabelText: {
    color: t.label,
    fontFamily: fonts3.interMedium,
    fontSize: typography.subtext,
    marginBottom: 2
  },
  triggerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing2.sm
  },
  triggerValue: {
    color: t.value,
    fontFamily: fonts3.inter,
    fontSize: typography.default,
    flexShrink: 1
  },
  sheetWrap: {
    width: "100%"
  },
  sheet: {
    backgroundColor: c.background,
    borderTopLeftRadius: radii4.xxl,
    borderTopRightRadius: radii4.xxl,
    paddingTop: spacing2.sm,
    paddingHorizontal: spacing2.lg,
    // No safe-area dependency in the package; xl clears the home indicator.
    paddingBottom: spacing2.xl
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: radii4.pill,
    backgroundColor: c.borderStrong,
    marginBottom: spacing2.md
  },
  sheetTitle: {
    color: t.label,
    fontFamily: fonts3.interMedium,
    fontSize: typography.subtext,
    marginBottom: spacing2.sm,
    paddingHorizontal: spacing2.xs
  },
  optionsList: {
    paddingBottom: spacing2.sm,
    gap: spacing2.xs
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing2.md,
    paddingHorizontal: spacing2.md,
    borderRadius: radii4.lg,
    borderWidth: StyleSheet4.hairlineWidth,
    borderColor: "transparent",
    backgroundColor: "transparent"
  },
  optionActive: {
    backgroundColor: c.selection,
    borderColor: c.selectionBorder
  },
  optionCopy: {
    flex: 1,
    gap: 2
  },
  optionLabel: {
    color: c.text,
    fontFamily: fonts3.inter,
    fontSize: typography.default
  },
  optionLabelActive: {
    fontFamily: fonts3.interSemiBold,
    color: c.text
  },
  optionHint: {
    color: c.textMuted,
    fontFamily: fonts3.inter,
    fontSize: typography.subtext
  }
});
var STYLES = {
  light: makeStyles(forMode3("light"), componentsForMode3("light").dropdown),
  dark: makeStyles(forMode3("dark"), componentsForMode3("dark").dropdown)
};

// src/LoadErrorState/LoadErrorState.tsx
import { StyleSheet as StyleSheet5, Text as Text4 } from "react-native";
import { View as View5 } from "react-native";
import {
  fonts as fonts4,
  forMode as forMode4,
  letterSpacing,
  lineHeights,
  radii as radii5,
  spacing as spacing3,
  typography as typography2,
  withAlpha
} from "@oro/tokens";

// src/motion/FadeUpSection/FadeUpSection.tsx
import { useEffect as useEffect3, useRef, useState as useState5 } from "react";
import { Animated as Animated2 } from "react-native";
import { motion as motion3 } from "@oro/tokens";

// src/motion/easing.ts
import { Easing } from "react-native";
import { motion as motion2 } from "@oro/tokens";
var bezier = (token) => Easing.bezier(token[0], token[1], token[2], token[3]);
var motionEasing = {
  standard: bezier(motion2.easing.standard),
  enter: bezier(motion2.easing.enter),
  exit: bezier(motion2.easing.exit),
  spring: bezier(motion2.easing.spring),
  reveal: Easing.out(Easing.cubic),
  sheen: Easing.inOut(Easing.cubic)
};

// src/motion/FadeUpSection/FadeUpSection.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
function FadeUpSection({
  delay = 0,
  distance = 14,
  duration = motion3.duration.reveal,
  disabled = false,
  active,
  style,
  children,
  ...rest
}) {
  const reduced = useReducedMotion();
  const skip = reduced || disabled;
  const [opacity] = useState5(() => new Animated2.Value(0));
  const [ty] = useState5(() => new Animated2.Value(distance));
  const hasAnimated = useRef(false);
  useEffect3(() => {
    const reveal = () => {
      const timing = { duration, delay, easing: motionEasing.reveal, useNativeDriver: true };
      Animated2.parallel([
        Animated2.timing(opacity, { toValue: 1, ...timing }),
        Animated2.timing(ty, { toValue: 0, ...timing })
      ]).start();
    };
    if (skip) {
      opacity.setValue(1);
      ty.setValue(0);
      return;
    }
    if (active === void 0) {
      if (hasAnimated.current) return;
      hasAnimated.current = true;
      reveal();
      return;
    }
    if (active) {
      opacity.setValue(0);
      ty.setValue(distance);
      reveal();
    }
  }, [active, delay, duration, distance, skip, opacity, ty]);
  return /* @__PURE__ */ jsx7(Animated2.View, { style: [{ opacity, transform: [{ translateY: ty }] }, style], ...rest, children });
}

// src/motion/PressSpringPressable/PressSpringPressable.tsx
import { useState as useState6 } from "react";
import { Animated as Animated3, Pressable as Pressable4 } from "react-native";
import { motion as motion4 } from "@oro/tokens";
import { jsx as jsx8 } from "react/jsx-runtime";
function PressSpringPressable({
  pressedScale = 0.97,
  springDamping = motion4.spring.press.damping,
  springStiffness = motion4.spring.press.stiffness,
  onHaptic,
  onPressIn,
  onPressOut,
  outerStyle,
  style,
  children,
  disabled,
  ...rest
}) {
  const [scale] = useState6(() => new Animated3.Value(1));
  const springTo = (toValue) => Animated3.spring(scale, {
    toValue,
    damping: springDamping,
    stiffness: springStiffness,
    useNativeDriver: true
  }).start();
  return /* @__PURE__ */ jsx8(Animated3.View, { style: [{ transform: [{ scale }] }, outerStyle], children: /* @__PURE__ */ jsx8(
    Pressable4,
    {
      onPressIn: (event) => {
        if (!disabled) {
          springTo(pressedScale);
          onHaptic?.();
        }
        onPressIn?.(event);
      },
      onPressOut: (event) => {
        springTo(1);
        onPressOut?.(event);
      },
      style,
      disabled,
      ...rest,
      children
    }
  ) });
}

// src/LoadErrorState/LoadErrorState.tsx
import { jsx as jsx9, jsxs as jsxs5 } from "react/jsx-runtime";
function LoadErrorState({ onRetry, note, tone = "light" }) {
  const mode = tone === "onDark" ? "dark" : "light";
  const c = forMode4(mode);
  const styles4 = STYLES2[mode];
  return /* @__PURE__ */ jsxs5(FadeUpSection, { style: styles4.wrap, children: [
    /* @__PURE__ */ jsx9(View5, { style: styles4.iconRing, children: /* @__PURE__ */ jsx9(Icon, { name: "alert-circle", size: "md", color: c.primaryAction }) }),
    /* @__PURE__ */ jsxs5(Text4, { style: styles4.title, children: [
      "couldn't ",
      /* @__PURE__ */ jsx9(Text4, { style: styles4.titleAccent, children: "load" }),
      " this."
    ] }),
    /* @__PURE__ */ jsx9(Text4, { style: styles4.note, children: note ?? "try again. your wardrobe is still saved." }),
    onRetry ? /* @__PURE__ */ jsxs5(
      PressSpringPressable,
      {
        style: styles4.retryButton,
        onPress: onRetry,
        accessibilityRole: "button",
        accessibilityLabel: "Retry",
        children: [
          /* @__PURE__ */ jsx9(Icon, { name: "rotate-ccw", size: 14, color: c.text }),
          /* @__PURE__ */ jsx9(Text4, { style: styles4.retryText, children: "retry" })
        ]
      }
    ) : null
  ] });
}
var makeStyles2 = (c) => StyleSheet5.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing3.xl
  },
  iconRing: {
    width: 52,
    height: 52,
    borderRadius: radii5.pill,
    backgroundColor: c.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing3.lg
  },
  title: {
    fontFamily: fonts4.fraunces,
    fontSize: typography2.heading,
    color: c.text,
    letterSpacing: letterSpacing.tight,
    textAlign: "center"
  },
  titleAccent: {
    fontFamily: fonts4.frauncesMediumItalic,
    color: c.primaryAction
  },
  note: {
    marginTop: spacing3.sm,
    fontFamily: fonts4.frauncesItalic,
    fontSize: typography2.subtext,
    color: withAlpha(c.text, "80"),
    textAlign: "center",
    lineHeight: typography2.subtext * lineHeights.relaxed
  },
  retryButton: {
    marginTop: spacing3.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing3.sm,
    borderWidth: StyleSheet5.hairlineWidth,
    borderColor: c.borderStrong,
    borderRadius: radii5.pill,
    paddingVertical: spacing3.sm,
    paddingHorizontal: spacing3.lg
  },
  retryText: {
    fontFamily: fonts4.interMedium,
    fontSize: typography2.subtext,
    color: c.text
  }
});
var STYLES2 = {
  light: makeStyles2(forMode4("light")),
  dark: makeStyles2(forMode4("dark"))
};

// src/motion/SkeletonBlock/SkeletonBlock.tsx
import { useEffect as useEffect4, useState as useState7 } from "react";
import { Animated as Animated4 } from "react-native";
import { colors as colors4, motion as motion5, radii as radii6, withAlpha as withAlpha2 } from "@oro/tokens";
import { jsx as jsx10 } from "react/jsx-runtime";
function SkeletonBlock({
  width = "100%",
  height = 14,
  borderRadius = radii6.sm,
  style
}) {
  const [progress] = useState7(() => new Animated4.Value(0));
  const reduced = useReducedMotion();
  useEffect4(() => {
    progress.setValue(0);
    if (reduced) return;
    const loop = Animated4.loop(
      Animated4.timing(progress, {
        toValue: 1,
        duration: motion5.duration.sheen,
        easing: motionEasing.sheen,
        useNativeDriver: true
      })
    );
    loop.start();
    return () => loop.stop();
  }, [progress, reduced]);
  const sheenOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0]
  });
  return /* @__PURE__ */ jsx10(
    Animated4.View,
    {
      style: [{ width, height, borderRadius, backgroundColor: colors4.surfaceMuted, overflow: "hidden" }, style],
      children: /* @__PURE__ */ jsx10(
        Animated4.View,
        {
          pointerEvents: "none",
          style: {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: withAlpha2(colors4.background, "60"),
            opacity: sheenOpacity
          }
        }
      )
    }
  );
}
export {
  BackButton,
  Button,
  Dropdown,
  FadeUpSection,
  Icon,
  LoadErrorState,
  Pill,
  PressSpringPressable,
  SkeletonBlock,
  SlideUpSheet,
  motionEasing,
  resolveElevation,
  useReducedMotion
};
//# sourceMappingURL=index.js.map