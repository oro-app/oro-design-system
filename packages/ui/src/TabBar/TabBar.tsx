import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { forMode, radii, tabBarGeometry, type Mode } from '@oro/tokens';

import { Icon, type IconName } from '../Icon';
import { PressSpringPressable, useReducedMotion } from '../motion';
import { resolveElevation } from '../style';

/** Which surface the bar sits on. Selects the matching semantic mode. */
export type TabBarTone = 'light' | 'onDark';

export type TabBarItem = {
  key: string;
  icon: IconName;
  /** Names the destination for screen readers. Tabs carry no visible label, so this is the only name the tab has. */
  label: string;
};

export type TabBarProps = {
  items: TabBarItem[];
  activeKey: string;
  onSelect: (key: string) => void;
  tone?: TabBarTone;
  style?: StyleProp<ViewStyle>;
};

/**
 * Floating capsule of icon-only destinations.
 *
 * Positioning is the consumer's job: this package has no safe-area dependency,
 * and the bar floats over content rather than sitting in the layout, so the app
 * owns the absolute placement and the inset that clears the home indicator.
 */
export function TabBar({ items, activeKey, onSelect, tone = 'light', style }: TabBarProps) {
  const mode: Mode = tone === 'onDark' ? 'dark' : 'light';
  const c = forMode(mode);
  const onDark = mode === 'dark';
  const reducedMotion = useReducedMotion();

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.bar,
        {
          backgroundColor: c.surface,
          borderRadius: tabBarGeometry.radius,
          paddingVertical: tabBarGeometry.paddingVertical,
          paddingHorizontal: tabBarGeometry.paddingHorizontal,
          // A shadow cannot separate two dark surfaces, so on dark the capsule is defined by a hairline border instead.
          ...(onDark
            ? { borderWidth: 1, borderColor: c.border }
            : resolveElevation('floating', c.shadow)),
        },
        style,
      ]}
    >
      {items.map((item) => {
        const selected = item.key === activeKey;

        return (
          <PressSpringPressable
            key={item.key}
            outerStyle={styles.tabOuter}
            style={styles.tab}
            pressedScale={reducedMotion ? 1 : 0.94}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            // react-native-web does not map accessibilityState.selected onto aria-selected here, and these tabs have no visible label, so without this the selected state reaches assistive technology through color alone.
            aria-selected={selected}
            accessibilityLabel={item.label}
            onPress={() => onSelect(item.key)}
          >
            <Icon
              name={item.icon}
              size={tabBarGeometry.iconSize}
              color={selected ? c.textMuted : c.secondaryMuted}
            />
            {/* Rendered in both states so selection changes color without moving the icon. */}
            <View
              style={[
                styles.mark,
                { backgroundColor: selected ? c.accent : 'transparent' },
              ]}
            />
          </PressSpringPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Flex belongs on the outer view because PressSpringPressable animates that one; on the inner Pressable the tabs collapse to their content width.
  tabOuter: {
    flex: 1,
  },
  tab: {
    minHeight: tabBarGeometry.tabMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    gap: tabBarGeometry.markGap,
  },
  mark: {
    width: tabBarGeometry.markSize,
    height: tabBarGeometry.markSize,
    borderRadius: radii.pill,
  },
});

export default TabBar;
