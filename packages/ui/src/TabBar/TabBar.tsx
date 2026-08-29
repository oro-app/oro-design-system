import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { forMode, radii, tabBarGeometry, type Mode } from '@oro/tokens';

import { Badge } from '../Badge';
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
  /** How many things behind this destination need attention. Omit or 0 for none. */
  badgeCount?: number;
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
        const badged = item.badgeCount !== undefined && item.badgeCount > 0;
        // Folded into the tab's own name rather than left on the Badge, so the
        // count is announced once as part of the destination instead of as a
        // second element the reader has to associate with it.
        const name = badged ? `${item.label}, ${item.badgeCount} need attention` : item.label;

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
            accessibilityLabel={name}
            onPress={() => onSelect(item.key)}
          >
            <View>
              <Icon
                name={item.icon}
                size={tabBarGeometry.iconSize}
                color={selected ? c.textMuted : c.secondaryMuted}
              />
              {badged ? (
                // Absolute so the badge cannot shift the icon or the mark below
                // it, which would make the bar twitch as counts arrive. Hidden
                // from assistive tech because the tab's own name already carries
                // the count.
                <View
                  style={styles.badge}
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                >
                  <Badge label={item.label} count={item.badgeCount} tone={tone} />
                </View>
              ) : null}
            </View>
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
  // Pulled up and right so the capsule overlaps the icon's corner rather than
  // sitting beside it, which is what keeps the tab's width unchanged.
  badge: {
    position: 'absolute',
    top: -4,
    left: '55%',
  },
  mark: {
    width: tabBarGeometry.markSize,
    height: tabBarGeometry.markSize,
    borderRadius: radii.pill,
  },
});

export default TabBar;
