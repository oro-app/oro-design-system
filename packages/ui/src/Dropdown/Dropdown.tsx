import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {
  componentsForMode,
  fonts,
  forMode,
  radii,
  spacing,
  typography,
  type Mode,
  type SemanticColors,
} from '@oro/tokens';
import { Icon } from '../Icon';
import { SlideUpSheet } from '../motion/SlideUpSheet';

/** Which surface the dropdown sits on. Selects the matching semantic mode. */
export type DropdownTone = 'light' | 'onDark';

export type DropdownOption<T extends string = string> = {
  value: T;
  label: string;
  hint?: string;
};

export type DropdownProps<T extends string = string> = {
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
export function Dropdown<T extends string = string>({
  label,
  value,
  options,
  onChange,
  placeholder = 'select…',
  disabled = false,
  tone = 'light',
  accessibilityLabel,
  triggerStyle,
  triggerTextStyle,
  sheetTitle,
}: DropdownProps<T>) {
  const mode: Mode = tone === 'onDark' ? 'dark' : 'light';
  const c = forMode(mode);
  const styles = STYLES[mode];

  const [isOpen, setIsOpen] = useState(false);
  // Percentage maxHeight is unreliable on web (parent height is auto) — cap
  // the sheet at 70% of the window in pixels; fallback covers SSR (height 0).
  const windowHeight = useWindowDimensions().height;
  const sheetMaxHeight = windowHeight ? Math.round(windowHeight * 0.7) : 560;

  const activeOption = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  const triggerLabel = activeOption?.label ?? placeholder;

  const handleSelect = (next: T) => {
    setIsOpen(false);
    if (next !== value) {
      onChange(next);
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        style={[styles.trigger, disabled && styles.triggerDisabled, triggerStyle]}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? `${label ?? 'Filter'}: ${triggerLabel}`}
        accessibilityState={{ expanded: isOpen, disabled }}
      >
        {label ? <Text style={styles.triggerLabelText}>{label}</Text> : null}
        <View style={styles.triggerRow}>
          <Text numberOfLines={1} style={[styles.triggerValue, triggerTextStyle]}>
            {triggerLabel}
          </Text>
          <Icon name="chevron-down" size={16} color={c.secondaryActionIcon} />
        </View>
      </TouchableOpacity>

      <SlideUpSheet visible={isOpen} onClose={() => setIsOpen(false)}>
        <Pressable onPress={() => {}} style={styles.sheetWrap}>
          <View style={[styles.sheet, { maxHeight: sheetMaxHeight }]}>
            <View style={styles.handle} />
            {sheetTitle ? <Text style={styles.sheetTitle}>{sheetTitle}</Text> : null}
            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.optionsList}
            >
              {options.map((option) => {
                const isActive = option.value === value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    style={[styles.option, isActive && styles.optionActive]}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={option.label}
                  >
                    <View style={styles.optionCopy}>
                      <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
                        {option.label}
                      </Text>
                      {option.hint ? <Text style={styles.optionHint}>{option.hint}</Text> : null}
                    </View>
                    {isActive ? <Icon name="check" size={18} color={c.primaryAction} /> : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </SlideUpSheet>
    </>
  );
}

/** Built once per mode at module load — `tone` is a lookup, not a re-compute. */
const makeStyles = (c: SemanticColors, t: ReturnType<typeof componentsForMode>['dropdown']) =>
  StyleSheet.create({
    trigger: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.md,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: t.triggerBorder,
      backgroundColor: t.trigger,
    },
    triggerDisabled: {
      opacity: 0.5,
    },
    triggerLabelText: {
      color: t.label,
      fontFamily: fonts.interMedium,
      fontSize: typography.subtext,
      marginBottom: 2,
    },
    triggerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    triggerValue: {
      color: t.value,
      fontFamily: fonts.inter,
      fontSize: typography.default,
      flexShrink: 1,
    },
    sheetWrap: {
      width: '100%',
    },
    sheet: {
      backgroundColor: c.background,
      borderTopLeftRadius: radii.xxl,
      borderTopRightRadius: radii.xxl,
      paddingTop: spacing.sm,
      paddingHorizontal: spacing.lg,
      // No safe-area dependency in the package; xl clears the home indicator.
      paddingBottom: spacing.xl,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 4,
      borderRadius: radii.pill,
      backgroundColor: c.borderStrong,
      marginBottom: spacing.md,
    },
    sheetTitle: {
      color: t.label,
      fontFamily: fonts.interMedium,
      fontSize: typography.subtext,
      marginBottom: spacing.sm,
      paddingHorizontal: spacing.xs,
    },
    optionsList: {
      paddingBottom: spacing.sm,
      gap: spacing.xs,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      borderRadius: radii.lg,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
    },
    optionActive: {
      backgroundColor: c.selection,
      borderColor: c.selectionBorder,
    },
    optionCopy: {
      flex: 1,
      gap: 2,
    },
    optionLabel: {
      color: c.text,
      fontFamily: fonts.inter,
      fontSize: typography.default,
    },
    optionLabelActive: {
      fontFamily: fonts.interSemiBold,
      color: c.text,
    },
    optionHint: {
      color: c.textMuted,
      fontFamily: fonts.inter,
      fontSize: typography.subtext,
    },
  });

const STYLES = {
  light: makeStyles(forMode('light'), componentsForMode('light').dropdown),
  dark: makeStyles(forMode('dark'), componentsForMode('dark').dropdown),
} as const;

export default Dropdown;
