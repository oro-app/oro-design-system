"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  BackButton: () => BackButton,
  Badge: () => Badge,
  Button: () => Button,
  Callout: () => Callout,
  Dropdown: () => Dropdown,
  FadeUpSection: () => FadeUpSection,
  Icon: () => Icon,
  LoadErrorState: () => LoadErrorState,
  Pill: () => Pill,
  PressSpringPressable: () => PressSpringPressable,
  SkeletonBlock: () => SkeletonBlock,
  SlideUpSheet: () => SlideUpSheet,
  TabBar: () => TabBar,
  motionEasing: () => motionEasing,
  resolveElevation: () => resolveElevation,
  useReducedMotion: () => useReducedMotion
});
module.exports = __toCommonJS(index_exports);

// src/Button/Button.tsx
var import_react = require("react");
var import_react_native2 = require("react-native");
var import_tokens2 = require("@oro/tokens");

// src/style.ts
var import_react_native = require("react-native");
var import_tokens = require("@oro/tokens");
function resolveElevation(token, shadowColor = import_tokens.colors.shadow) {
  const preset = import_tokens.elevation[token];
  if (preset.androidElevation === 0 && preset.shadowOpacity === 0) return {};
  return import_react_native.Platform.select({
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
var import_jsx_runtime = require("react/jsx-runtime");
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
  paddingHorizontal: import_tokens2.spacing.xl,
  fontSize: import_tokens2.brandTypography.cta,
  gap: import_tokens2.spacing.sm
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
  const [hovered, setHovered] = (0, import_react.useState)(false);
  const mode = tone === "onDark" ? "dark" : "light";
  const c = (0, import_tokens2.forMode)(mode);
  const hero = prominence === "hero";
  const v = hero ? "primary" : variant;
  const spec = variantSpecs(c, (0, import_tokens2.componentsForMode)(mode))[v];
  const dims = hero ? HERO : import_tokens2.buttonSizes[size];
  const iconOnly = content === "iconOnly";
  const showIcon = content !== "text" && icon != null;
  const bg = disabled ? v === "primary" ? c.primaryActionDisabled : spec.bg : hovered ? spec.hoverBg : spec.bg;
  const container = {
    height: dims.height,
    // Icon-only buttons are square, so the hit target stays as large as the
    // equivalent labelled button rather than shrinking to fit the glyph.
    ...iconOnly ? { width: dims.height, paddingHorizontal: 0 } : { paddingHorizontal: dims.paddingHorizontal },
    borderRadius: hero ? import_tokens2.radii.none : import_tokens2.radii.lg,
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
    fontFamily: hero ? import_tokens2.fonts.fraunces : import_tokens2.fonts.interSemiBold,
    fontSize: dims.fontSize,
    letterSpacing: hero ? -0.01 * import_tokens2.brandTypography.cta : 0.2
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_react_native2.Pressable,
    {
      accessibilityRole: "button",
      accessibilityState: { disabled },
      accessibilityLabel: label,
      onPress,
      disabled,
      onHoverIn: () => setHovered(true),
      onHoverOut: () => setHovered(false),
      style: ({ pressed }) => [container, pressed && !disabled ? styles.pressed : null, style],
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react_native2.View, { style: [styles.content, { gap: dims.gap }], children: [
        showIcon && iconPosition === "leading" ? icon : null,
        iconOnly ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_native2.Text, { style: [labelStyle, textStyle], children: label }),
        showIcon && iconPosition === "trailing" ? icon : null
      ] })
    }
  );
}
var styles = import_react_native2.StyleSheet.create({
  content: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.85 }
});

// src/Pill/Pill.tsx
var import_react_native3 = require("react-native");
var import_tokens3 = require("@oro/tokens");
var import_jsx_runtime2 = require("react/jsx-runtime");
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
  const t = (0, import_tokens3.componentsForMode)(mode).pill;
  const dims = import_tokens3.pillSizes[size];
  const container = {
    paddingVertical: dims.paddingVertical,
    paddingHorizontal: dims.paddingHorizontal,
    borderRadius: import_tokens3.radii.pill,
    borderWidth: 1.5,
    borderColor: active ? t.borderSelected : t.border,
    backgroundColor: disabled ? t.backgroundDisabled : active ? t.backgroundSelected : t.background,
    alignItems: "center",
    justifyContent: "center",
    ...disabled ? { opacity: 0.5 } : null
  };
  const label_ = {
    color: disabled ? t.labelDisabled : active ? t.labelSelected : t.label,
    fontFamily: import_tokens3.fonts.interMedium,
    fontSize: dims.fontSize
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_react_native3.TouchableOpacity,
    {
      onPress,
      disabled,
      activeOpacity: 0.8,
      accessibilityRole: "button",
      accessibilityState: { selected: active, disabled },
      accessibilityLabel: label,
      style: [container, style],
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(import_react_native3.View, { style: [styles2.content, { gap: dims.gap }], children: [
        leadingIcon ?? children,
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react_native3.Text, { style: [label_, textStyle], children: label }),
        trailingIcon
      ] })
    }
  );
}
var styles2 = import_react_native3.StyleSheet.create({
  content: { flexDirection: "row", alignItems: "center" }
});

// src/Icon/Icon.web.tsx
var import_react_feather = require("react-feather");
var import_tokens4 = require("@oro/tokens");

// src/Icon/glyphs/hanger.web.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function Hanger({ size = 24, color }) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M12 9.5V7.7a2.6 2.6 0 1 1 2.6-2.6" }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M12 9.5L2.9 16.6a1.2 1.2 0 0 0 .8 2.1h16.6a1.2 1.2 0 0 0 .8-2.1L12 9.5z" })
      ]
    }
  );
}

// src/Icon/glyphs/index.ts
var GLYPHS = {
  hanger: Hanger
};
var ORO_GLYPHS = GLYPHS;

// src/Icon/Icon.web.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var SIZES = { sm: 16, md: 20, lg: 24 };
var GLYPHS2 = {
  ...ORO_GLYPHS,
  "alert-circle": import_react_feather.AlertCircle,
  "alert-triangle": import_react_feather.AlertTriangle,
  "arrow-left": import_react_feather.ArrowLeft,
  "book-open": import_react_feather.BookOpen,
  camera: import_react_feather.Camera,
  check: import_react_feather.Check,
  "chevron-down": import_react_feather.ChevronDown,
  "chevron-right": import_react_feather.ChevronRight,
  grid: import_react_feather.Grid,
  heart: import_react_feather.Heart,
  plus: import_react_feather.Plus,
  "rotate-ccw": import_react_feather.RotateCcw,
  search: import_react_feather.Search,
  sliders: import_react_feather.Sliders,
  user: import_react_feather.User,
  x: import_react_feather.X
};
function Icon({ name, size = "md", color = import_tokens4.colors.text }) {
  const px = typeof size === "number" ? size : SIZES[size];
  const Glyph = GLYPHS2[name] ?? import_react_feather.Square;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Glyph, { size: px, color });
}

// src/BackButton/BackButton.tsx
var import_react_native4 = require("react-native");
var import_tokens5 = require("@oro/tokens");
var import_jsx_runtime5 = require("react/jsx-runtime");
function BackButton({
  onPress,
  accessibilityLabel = "Go back",
  tone = "light",
  style
}) {
  const mode = tone === "onDark" ? "dark" : "light";
  const c = (0, import_tokens5.forMode)(mode);
  const onDark = mode === "dark";
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    import_react_native4.TouchableOpacity,
    {
      onPress,
      activeOpacity: 0.7,
      accessibilityRole: "button",
      accessibilityLabel,
      style: [
        {
          width: 44,
          height: 44,
          borderRadius: import_tokens5.radii.pill,
          backgroundColor: c.surface,
          alignItems: "center",
          justifyContent: "center",
          // A shadow can't separate two dark surfaces — on dark the affordance
          // is defined by a hairline border instead.
          ...onDark ? { borderWidth: 1, borderColor: c.border } : resolveElevation("low", c.shadow)
        },
        style
      ],
      children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Icon, { name: "arrow-left", size: "md", color: c.text })
    }
  );
}

// src/Dropdown/Dropdown.tsx
var import_react4 = require("react");
var import_react_native7 = require("react-native");
var import_tokens7 = require("@oro/tokens");

// src/motion/SlideUpSheet/SlideUpSheet.tsx
var import_react3 = require("react");
var import_react_native6 = require("react-native");
var import_tokens6 = require("@oro/tokens");

// src/motion/useReducedMotion.ts
var import_react2 = require("react");
var import_react_native5 = require("react-native");
function useReducedMotion() {
  const [reduced, setReduced] = (0, import_react2.useState)(false);
  (0, import_react2.useEffect)(() => {
    let mounted = true;
    import_react_native5.AccessibilityInfo.isReduceMotionEnabled?.().then((value) => {
      if (mounted) setReduced(Boolean(value));
    });
    const sub = import_react_native5.AccessibilityInfo.addEventListener?.(
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
var import_jsx_runtime6 = require("react/jsx-runtime");
function screenHeight() {
  try {
    return import_react_native6.Dimensions.get("window").height || 800;
  } catch {
    return 800;
  }
}
function SlideUpSheet({ visible, onClose, children, withModal = true }) {
  const reduced = useReducedMotion();
  const [translateY] = (0, import_react3.useState)(() => new import_react_native6.Animated.Value(screenHeight()));
  const [backdropOpacity] = (0, import_react3.useState)(() => new import_react_native6.Animated.Value(0));
  (0, import_react3.useEffect)(() => {
    if (!visible) return;
    if (reduced) {
      translateY.setValue(0);
      backdropOpacity.setValue(1);
      return;
    }
    translateY.setValue(screenHeight());
    backdropOpacity.setValue(0);
    import_react_native6.Animated.parallel([
      import_react_native6.Animated.timing(translateY, {
        toValue: 0,
        duration: import_tokens6.motion.duration.slow,
        useNativeDriver: true
      }),
      import_react_native6.Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: import_tokens6.motion.duration.slow,
        useNativeDriver: true
      })
    ]).start();
  }, [visible, reduced, translateY, backdropOpacity]);
  const content = /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_react_native6.View, { style: styles3.root, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react_native6.Animated.View, { style: [styles3.backdrop, { opacity: backdropOpacity }], children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      import_react_native6.Pressable,
      {
        style: import_react_native6.StyleSheet.absoluteFill,
        onPress: onClose,
        accessibilityRole: "button",
        accessibilityLabel: "Close"
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react_native6.KeyboardAvoidingView, { behavior: import_react_native6.Platform.OS === "ios" ? "padding" : void 0, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react_native6.Animated.View, { style: { transform: [{ translateY }] }, children }) })
  ] });
  if (!withModal) {
    return visible ? content : null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    import_react_native6.Modal,
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
var styles3 = import_react_native6.StyleSheet.create({
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
    backgroundColor: import_tokens6.colors.overlayStrong
  }
});

// src/Dropdown/Dropdown.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
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
  const c = (0, import_tokens7.forMode)(mode);
  const styles6 = STYLES[mode];
  const [isOpen, setIsOpen] = (0, import_react4.useState)(false);
  const windowHeight = (0, import_react_native7.useWindowDimensions)().height;
  const sheetMaxHeight = windowHeight ? Math.round(windowHeight * 0.7) : 560;
  const activeOption = (0, import_react4.useMemo)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      import_react_native7.TouchableOpacity,
      {
        onPress: () => !disabled && setIsOpen(true),
        style: [styles6.trigger, disabled && styles6.triggerDisabled, triggerStyle],
        activeOpacity: 0.85,
        accessibilityRole: "button",
        accessibilityLabel: accessibilityLabel ?? `${label ?? "Filter"}: ${triggerLabel}`,
        accessibilityState: { expanded: isOpen, disabled },
        children: [
          label ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_native7.Text, { style: styles6.triggerLabelText, children: label }) : null,
          /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_react_native7.View, { style: styles6.triggerRow, children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_native7.Text, { numberOfLines: 1, style: [styles6.triggerValue, triggerTextStyle], children: triggerLabel }),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Icon, { name: "chevron-down", size: 16, color: c.secondaryActionIcon })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(SlideUpSheet, { visible: isOpen, onClose: () => setIsOpen(false), children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_native7.Pressable, { onPress: () => {
    }, style: styles6.sheetWrap, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_react_native7.View, { style: [styles6.sheet, { maxHeight: sheetMaxHeight }], children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_native7.View, { style: styles6.handle }),
      sheetTitle ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_native7.Text, { style: styles6.sheetTitle, children: sheetTitle }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        import_react_native7.ScrollView,
        {
          bounces: false,
          showsVerticalScrollIndicator: false,
          contentContainerStyle: styles6.optionsList,
          children: options.map((option) => {
            const isActive = option.value === value;
            return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
              import_react_native7.TouchableOpacity,
              {
                onPress: () => handleSelect(option.value),
                style: [styles6.option, isActive && styles6.optionActive],
                activeOpacity: 0.7,
                accessibilityRole: "button",
                accessibilityState: { selected: isActive },
                accessibilityLabel: option.label,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_react_native7.View, { style: styles6.optionCopy, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_native7.Text, { style: [styles6.optionLabel, isActive && styles6.optionLabelActive], children: option.label }),
                    option.hint ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react_native7.Text, { style: styles6.optionHint, children: option.hint }) : null
                  ] }),
                  isActive ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Icon, { name: "check", size: 18, color: c.primaryAction }) : null
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
var makeStyles = (c, t) => import_react_native7.StyleSheet.create({
  trigger: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingVertical: import_tokens7.spacing.sm + 2,
    paddingHorizontal: import_tokens7.spacing.md,
    borderRadius: import_tokens7.radii.lg,
    borderWidth: 1,
    borderColor: t.triggerBorder,
    backgroundColor: t.trigger
  },
  triggerDisabled: {
    opacity: 0.5
  },
  triggerLabelText: {
    color: t.label,
    fontFamily: import_tokens7.fonts.interMedium,
    fontSize: import_tokens7.typography.subtext,
    marginBottom: 2
  },
  triggerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: import_tokens7.spacing.sm
  },
  triggerValue: {
    color: t.value,
    fontFamily: import_tokens7.fonts.inter,
    fontSize: import_tokens7.typography.default,
    flexShrink: 1
  },
  sheetWrap: {
    width: "100%"
  },
  sheet: {
    backgroundColor: c.background,
    borderTopLeftRadius: import_tokens7.radii.xxl,
    borderTopRightRadius: import_tokens7.radii.xxl,
    paddingTop: import_tokens7.spacing.sm,
    paddingHorizontal: import_tokens7.spacing.lg,
    // No safe-area dependency in the package; xl clears the home indicator.
    paddingBottom: import_tokens7.spacing.xl
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: import_tokens7.radii.pill,
    backgroundColor: c.borderStrong,
    marginBottom: import_tokens7.spacing.md
  },
  sheetTitle: {
    color: t.label,
    fontFamily: import_tokens7.fonts.interMedium,
    fontSize: import_tokens7.typography.subtext,
    marginBottom: import_tokens7.spacing.sm,
    paddingHorizontal: import_tokens7.spacing.xs
  },
  optionsList: {
    paddingBottom: import_tokens7.spacing.sm,
    gap: import_tokens7.spacing.xs
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: import_tokens7.spacing.md,
    paddingHorizontal: import_tokens7.spacing.md,
    borderRadius: import_tokens7.radii.lg,
    borderWidth: import_react_native7.StyleSheet.hairlineWidth,
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
    fontFamily: import_tokens7.fonts.inter,
    fontSize: import_tokens7.typography.default
  },
  optionLabelActive: {
    fontFamily: import_tokens7.fonts.interSemiBold,
    color: c.text
  },
  optionHint: {
    color: c.textMuted,
    fontFamily: import_tokens7.fonts.inter,
    fontSize: import_tokens7.typography.subtext
  }
});
var STYLES = {
  light: makeStyles((0, import_tokens7.forMode)("light"), (0, import_tokens7.componentsForMode)("light").dropdown),
  dark: makeStyles((0, import_tokens7.forMode)("dark"), (0, import_tokens7.componentsForMode)("dark").dropdown)
};

// src/TabBar/TabBar.tsx
var import_react_native13 = require("react-native");
var import_tokens13 = require("@oro/tokens");

// src/Badge/Badge.tsx
var import_react_native8 = require("react-native");
var import_tokens8 = require("@oro/tokens");
var import_jsx_runtime8 = require("react/jsx-runtime");
function Badge({ label, count, tone = "light", style }) {
  const mode = tone === "onDark" ? "dark" : "light";
  const t = (0, import_tokens8.componentsForMode)(mode).badge;
  const hasCount = count !== void 0 && count > 0;
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    import_react_native8.View,
    {
      accessibilityRole: "text",
      accessibilityLabel: label,
      style: [
        hasCount ? styles4.count : styles4.dot,
        { backgroundColor: t.background },
        style
      ],
      children: hasCount ? /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_react_native8.Text, { style: [styles4.countText, { color: t.countText }], children: count > import_tokens8.badgeGeometry.maxCount ? `${import_tokens8.badgeGeometry.maxCount}+` : count }) : null
    }
  );
}
var styles4 = import_react_native8.StyleSheet.create({
  dot: {
    width: import_tokens8.badgeGeometry.dotSize,
    height: import_tokens8.badgeGeometry.dotSize,
    borderRadius: import_tokens8.radii.pill
  },
  count: {
    minWidth: import_tokens8.badgeGeometry.countMinWidth,
    paddingVertical: import_tokens8.badgeGeometry.countPaddingVertical,
    paddingHorizontal: import_tokens8.badgeGeometry.countPaddingHorizontal,
    borderRadius: import_tokens8.radii.pill,
    alignItems: "center",
    justifyContent: "center"
  },
  countText: {
    fontFamily: import_tokens8.fonts.interMedium,
    fontSize: import_tokens8.badgeGeometry.fontSize
  }
});

// src/motion/FadeUpSection/FadeUpSection.tsx
var import_react5 = require("react");
var import_react_native10 = require("react-native");
var import_tokens10 = require("@oro/tokens");

// src/motion/easing.ts
var import_react_native9 = require("react-native");
var import_tokens9 = require("@oro/tokens");
var bezier = (token) => import_react_native9.Easing.bezier(token[0], token[1], token[2], token[3]);
var motionEasing = {
  standard: bezier(import_tokens9.motion.easing.standard),
  enter: bezier(import_tokens9.motion.easing.enter),
  exit: bezier(import_tokens9.motion.easing.exit),
  spring: bezier(import_tokens9.motion.easing.spring),
  reveal: import_react_native9.Easing.out(import_react_native9.Easing.cubic),
  sheen: import_react_native9.Easing.inOut(import_react_native9.Easing.cubic)
};

// src/motion/FadeUpSection/FadeUpSection.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function FadeUpSection({
  delay = 0,
  distance = 14,
  duration = import_tokens10.motion.duration.reveal,
  disabled = false,
  active,
  style,
  children,
  ...rest
}) {
  const reduced = useReducedMotion();
  const skip = reduced || disabled;
  const [opacity] = (0, import_react5.useState)(() => new import_react_native10.Animated.Value(0));
  const [ty] = (0, import_react5.useState)(() => new import_react_native10.Animated.Value(distance));
  const hasAnimated = (0, import_react5.useRef)(false);
  (0, import_react5.useEffect)(() => {
    const reveal = () => {
      const timing = { duration, delay, easing: motionEasing.reveal, useNativeDriver: true };
      import_react_native10.Animated.parallel([
        import_react_native10.Animated.timing(opacity, { toValue: 1, ...timing }),
        import_react_native10.Animated.timing(ty, { toValue: 0, ...timing })
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
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_react_native10.Animated.View, { style: [{ opacity, transform: [{ translateY: ty }] }, style], ...rest, children });
}

// src/motion/PressSpringPressable/PressSpringPressable.tsx
var import_react6 = require("react");
var import_react_native11 = require("react-native");
var import_tokens11 = require("@oro/tokens");
var import_jsx_runtime10 = require("react/jsx-runtime");
function PressSpringPressable({
  pressedScale = 0.97,
  springDamping = import_tokens11.motion.spring.press.damping,
  springStiffness = import_tokens11.motion.spring.press.stiffness,
  onHaptic,
  onPressIn,
  onPressOut,
  outerStyle,
  style,
  children,
  disabled,
  ...rest
}) {
  const [scale] = (0, import_react6.useState)(() => new import_react_native11.Animated.Value(1));
  const springTo = (toValue) => import_react_native11.Animated.spring(scale, {
    toValue,
    damping: springDamping,
    stiffness: springStiffness,
    useNativeDriver: true
  }).start();
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_react_native11.Animated.View, { style: [{ transform: [{ scale }] }, outerStyle], children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    import_react_native11.Pressable,
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

// src/motion/SkeletonBlock/SkeletonBlock.tsx
var import_react7 = require("react");
var import_react_native12 = require("react-native");
var import_tokens12 = require("@oro/tokens");
var import_jsx_runtime11 = require("react/jsx-runtime");
function SkeletonBlock({
  width = "100%",
  height = 14,
  borderRadius = import_tokens12.radii.sm,
  style
}) {
  const [progress] = (0, import_react7.useState)(() => new import_react_native12.Animated.Value(0));
  const reduced = useReducedMotion();
  (0, import_react7.useEffect)(() => {
    progress.setValue(0);
    if (reduced) return;
    const loop = import_react_native12.Animated.loop(
      import_react_native12.Animated.timing(progress, {
        toValue: 1,
        duration: import_tokens12.motion.duration.sheen,
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
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    import_react_native12.Animated.View,
    {
      style: [{ width, height, borderRadius, backgroundColor: import_tokens12.colors.surfaceMuted, overflow: "hidden" }, style],
      children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        import_react_native12.Animated.View,
        {
          pointerEvents: "none",
          style: {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: (0, import_tokens12.withAlpha)(import_tokens12.colors.background, "60"),
            opacity: sheenOpacity
          }
        }
      )
    }
  );
}

// src/TabBar/TabBar.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
function TabBar({ items, activeKey, onSelect, tone = "light", style }) {
  const mode = tone === "onDark" ? "dark" : "light";
  const c = (0, import_tokens13.forMode)(mode);
  const onDark = mode === "dark";
  const reducedMotion = useReducedMotion();
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
    import_react_native13.View,
    {
      accessibilityRole: "tablist",
      style: [
        styles5.bar,
        {
          backgroundColor: c.surface,
          borderRadius: import_tokens13.tabBarGeometry.radius,
          paddingVertical: import_tokens13.tabBarGeometry.paddingVertical,
          paddingHorizontal: import_tokens13.tabBarGeometry.paddingHorizontal,
          // A shadow cannot separate two dark surfaces, so on dark the capsule is defined by a hairline border instead.
          ...onDark ? { borderWidth: 1, borderColor: c.border } : resolveElevation("floating", c.shadow)
        },
        style
      ],
      children: items.map((item) => {
        const selected = item.key === activeKey;
        const badged = item.badgeCount !== void 0 && item.badgeCount > 0;
        const name = badged ? `${item.label}, ${item.badgeCount} need attention` : item.label;
        return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
          PressSpringPressable,
          {
            outerStyle: styles5.tabOuter,
            style: styles5.tab,
            pressedScale: reducedMotion ? 1 : 0.94,
            accessibilityRole: "tab",
            accessibilityState: { selected },
            "aria-selected": selected,
            accessibilityLabel: name,
            onPress: () => onSelect(item.key),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_react_native13.View, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                  Icon,
                  {
                    name: item.icon,
                    size: import_tokens13.tabBarGeometry.iconSize,
                    color: selected ? c.textMuted : c.secondaryMuted
                  }
                ),
                badged ? (
                  // Absolute so the badge cannot shift the icon or the mark below
                  // it, which would make the bar twitch as counts arrive. Hidden
                  // from assistive tech because the tab's own name already carries
                  // the count.
                  /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                    import_react_native13.View,
                    {
                      style: styles5.badge,
                      accessibilityElementsHidden: true,
                      importantForAccessibility: "no-hide-descendants",
                      children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Badge, { label: item.label, count: item.badgeCount, tone })
                    }
                  )
                ) : null
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                import_react_native13.View,
                {
                  style: [
                    styles5.mark,
                    { backgroundColor: selected ? c.accent : "transparent" }
                  ]
                }
              )
            ]
          },
          item.key
        );
      })
    }
  );
}
var styles5 = import_react_native13.StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center"
  },
  // Flex belongs on the outer view because PressSpringPressable animates that one; on the inner Pressable the tabs collapse to their content width.
  tabOuter: {
    flex: 1
  },
  tab: {
    minHeight: import_tokens13.tabBarGeometry.tabMinHeight,
    alignItems: "center",
    justifyContent: "center",
    gap: import_tokens13.tabBarGeometry.markGap
  },
  // Pulled up and right so the capsule overlaps the icon's corner rather than
  // sitting beside it, which is what keeps the tab's width unchanged.
  badge: {
    position: "absolute",
    top: -4,
    left: "55%"
  },
  mark: {
    width: import_tokens13.tabBarGeometry.markSize,
    height: import_tokens13.tabBarGeometry.markSize,
    borderRadius: import_tokens13.radii.pill
  }
});

// src/Callout/Callout.tsx
var import_react_native14 = require("react-native");
var import_tokens14 = require("@oro/tokens");
var import_jsx_runtime13 = require("react/jsx-runtime");
function Callout({
  body,
  title,
  actionLabel,
  onAction,
  prominence = "card",
  tone = "light",
  style
}) {
  const mode = tone === "onDark" ? "dark" : "light";
  const c = (0, import_tokens14.forMode)(mode);
  const styles6 = STYLES2[mode];
  const inline = prominence === "inline";
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_react_native14.View, { style: [inline ? styles6.inline : styles6.card, style], children: [
    inline ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Icon, { name: "alert-triangle", size: 14, color: c.warning }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_react_native14.View, { style: styles6.copy, children: [
      title !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_react_native14.Text, { style: styles6.title, children: title }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_react_native14.Text, { style: inline ? styles6.inlineBody : styles6.body, children: body }),
      actionLabel !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        Button,
        {
          label: actionLabel,
          size: "sm",
          tone,
          onPress: onAction,
          style: styles6.action
        }
      ) : null
    ] })
  ] });
}
var makeStyles2 = (c) => import_react_native14.StyleSheet.create({
  card: {
    padding: import_tokens14.spacing.lg,
    borderRadius: import_tokens14.radii.lg,
    backgroundColor: c.surfaceWarning,
    borderWidth: 1,
    borderColor: c.warning
  },
  // The rule on the leading edge is what ties the alert to the field it is
  // about, which is the whole reason this form exists rather than a card.
  inline: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: import_tokens14.spacing.sm,
    paddingVertical: import_tokens14.spacing.sm,
    paddingHorizontal: import_tokens14.spacing.md,
    borderTopRightRadius: import_tokens14.radii.md,
    borderBottomRightRadius: import_tokens14.radii.md,
    backgroundColor: c.surfaceWarning,
    borderLeftWidth: 2,
    borderLeftColor: c.warning
  },
  copy: {
    flex: 1,
    gap: import_tokens14.spacing.xs
  },
  title: {
    fontFamily: import_tokens14.fonts.fraunces,
    fontSize: import_tokens14.typography.large,
    color: c.warningText,
    letterSpacing: import_tokens14.letterSpacing.tight
  },
  body: {
    fontFamily: import_tokens14.fonts.inter,
    fontSize: import_tokens14.typography.subtext,
    color: c.warningText,
    lineHeight: import_tokens14.typography.subtext * import_tokens14.lineHeights.relaxed
  },
  inlineBody: {
    fontFamily: import_tokens14.fonts.inter,
    fontSize: import_tokens14.typography.tabs,
    color: c.warningText,
    lineHeight: import_tokens14.typography.tabs * import_tokens14.lineHeights.relaxed
  },
  action: {
    marginTop: import_tokens14.spacing.sm,
    alignSelf: "flex-start"
  }
});
var STYLES2 = {
  light: makeStyles2((0, import_tokens14.forMode)("light")),
  dark: makeStyles2((0, import_tokens14.forMode)("dark"))
};

// src/LoadErrorState/LoadErrorState.tsx
var import_react_native15 = require("react-native");
var import_react_native16 = require("react-native");
var import_tokens15 = require("@oro/tokens");
var import_jsx_runtime14 = require("react/jsx-runtime");
function LoadErrorState({ onRetry, note, tone = "light" }) {
  const mode = tone === "onDark" ? "dark" : "light";
  const c = (0, import_tokens15.forMode)(mode);
  const styles6 = STYLES3[mode];
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(FadeUpSection, { style: styles6.wrap, children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_react_native16.View, { style: styles6.iconRing, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Icon, { name: "alert-circle", size: "md", color: c.primaryAction }) }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_react_native15.Text, { style: styles6.title, children: [
      "couldn't ",
      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_react_native15.Text, { style: styles6.titleAccent, children: "load" }),
      " this."
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_react_native15.Text, { style: styles6.note, children: note ?? "try again. your wardrobe is still saved." }),
    onRetry ? /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
      PressSpringPressable,
      {
        style: styles6.retryButton,
        onPress: onRetry,
        accessibilityRole: "button",
        accessibilityLabel: "Retry",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(Icon, { name: "rotate-ccw", size: 14, color: c.text }),
          /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_react_native15.Text, { style: styles6.retryText, children: "retry" })
        ]
      }
    ) : null
  ] });
}
var makeStyles3 = (c) => import_react_native15.StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: import_tokens15.spacing.xl
  },
  iconRing: {
    width: 52,
    height: 52,
    borderRadius: import_tokens15.radii.pill,
    backgroundColor: c.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: import_tokens15.spacing.lg
  },
  title: {
    fontFamily: import_tokens15.fonts.fraunces,
    fontSize: import_tokens15.typography.heading,
    color: c.text,
    letterSpacing: import_tokens15.letterSpacing.tight,
    textAlign: "center"
  },
  titleAccent: {
    fontFamily: import_tokens15.fonts.frauncesMediumItalic,
    color: c.primaryAction
  },
  note: {
    marginTop: import_tokens15.spacing.sm,
    fontFamily: import_tokens15.fonts.frauncesItalic,
    fontSize: import_tokens15.typography.subtext,
    color: (0, import_tokens15.withAlpha)(c.text, "80"),
    textAlign: "center",
    lineHeight: import_tokens15.typography.subtext * import_tokens15.lineHeights.relaxed
  },
  retryButton: {
    marginTop: import_tokens15.spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: import_tokens15.spacing.sm,
    borderWidth: import_react_native15.StyleSheet.hairlineWidth,
    borderColor: c.borderStrong,
    borderRadius: import_tokens15.radii.pill,
    paddingVertical: import_tokens15.spacing.sm,
    paddingHorizontal: import_tokens15.spacing.lg
  },
  retryText: {
    fontFamily: import_tokens15.fonts.interMedium,
    fontSize: import_tokens15.typography.subtext,
    color: c.text
  }
});
var STYLES3 = {
  light: makeStyles3((0, import_tokens15.forMode)("light")),
  dark: makeStyles3((0, import_tokens15.forMode)("dark"))
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BackButton,
  Badge,
  Button,
  Callout,
  Dropdown,
  FadeUpSection,
  Icon,
  LoadErrorState,
  Pill,
  PressSpringPressable,
  SkeletonBlock,
  SlideUpSheet,
  TabBar,
  motionEasing,
  resolveElevation,
  useReducedMotion
});
//# sourceMappingURL=index.cjs.map