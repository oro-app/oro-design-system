import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { badgeGeometry, componentsForMode, fonts, radii, type Mode } from '@oro/tokens';

/** Which surface the badge sits on. Selects the matching semantic mode. */
export type BadgeTone = 'light' | 'onDark';

export type BadgeProps = {
  /**
   * Names what needs attention, for assistive technology. Required because the
   * badge carries no text a screen reader can fall back on, and the dot carries
   * none at all.
   */
  label: string;
  /** Omit for the bare dot. Present renders the count capsule. */
  count?: number;
  tone?: BadgeTone;
  style?: StyleProp<ViewStyle>;
};

/**
 * The needs-attention mark, at the two sizes that are one signal: a bare dot,
 * and a capsule carrying a count.
 *
 * Size follows from `count` rather than being its own axis, so a caller cannot
 * show a dot for a two-item state. Both sizes take the same `warning` fill,
 * because two colors here would read as two severities.
 *
 * Whether the badge renders at all is the consumer's condition to evaluate. A
 * count of zero still draws the dot rather than disappearing, so a caller that
 * mounted this deliberately never ends up signalling nothing.
 */
export function Badge({ label, count, tone = 'light', style }: BadgeProps) {
  const mode: Mode = tone === 'onDark' ? 'dark' : 'light';
  const t = componentsForMode(mode).badge;
  const hasCount = count !== undefined && count > 0;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      style={[
        hasCount ? styles.count : styles.dot,
        { backgroundColor: t.background },
        style,
      ]}
    >
      {hasCount ? (
        <Text style={[styles.countText, { color: t.countText }]}>
          {count > badgeGeometry.maxCount ? `${badgeGeometry.maxCount}+` : count}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    width: badgeGeometry.dotSize,
    height: badgeGeometry.dotSize,
    borderRadius: radii.pill,
  },
  count: {
    minWidth: badgeGeometry.countMinWidth,
    paddingVertical: badgeGeometry.countPaddingVertical,
    paddingHorizontal: badgeGeometry.countPaddingHorizontal,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontFamily: fonts.interMedium,
    fontSize: badgeGeometry.fontSize,
  },
});

export default Badge;
