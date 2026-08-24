import type { Meta, StoryObj } from '@storybook/react-vite';
import { View, Text } from 'react-native';
import { Icon, type IconName } from '@oro/ui';
import { colors } from '@oro/tokens';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  args: { name: 'heart', size: 'md', color: colors.text },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Playground: Story = {};

const names: IconName[] = [
  'arrow-left', 'chevron-down', 'chevron-right', 'check', 'x', 'plus',
  'search', 'alert-circle', 'rotate-ccw', 'heart', 'camera', 'sliders',
  'grid', 'book-open', 'user', 'hanger',
];

const oroGlyphNames: IconName[] = ['hanger', 'book-open', 'user'];

// The hanger is drawn by hand, so it is shown beside the Feather glyphs it ships next to in the companion app's tab bar: stroke weight or optical size drifting from theirs is the failure this story exists to catch.
export const OroGlyphs: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 24, padding: 24, alignItems: 'center' }}>
      {oroGlyphNames.map((n) => (
        <View key={n} style={{ alignItems: 'center', gap: 6, width: 72 }}>
          <Icon name={n} size="lg" color={colors.primaryAction} />
          <Text style={{ fontSize: 10, color: colors.textMuted }}>{n}</Text>
        </View>
      ))}
    </View>
  ),
};

export const Set: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 24, padding: 24, maxWidth: 420 }}>
      {names.map((n) => (
        <View key={n} style={{ alignItems: 'center', gap: 6, width: 72 }}>
          <Icon name={n} size="lg" color={colors.primaryAction} />
          <Text style={{ fontSize: 10, color: colors.textMuted }}>{n}</Text>
        </View>
      ))}
    </View>
  ),
};
