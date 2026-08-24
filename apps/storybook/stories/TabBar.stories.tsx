import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Text, View } from 'react-native';
import { TabBar, type TabBarItem } from '@oro/ui';
import { semantic } from '@oro/tokens';

const items: TabBarItem[] = [
  { key: 'wardrobe', icon: 'hanger', label: 'wardrobe' },
  { key: 'outfits', icon: 'book-open', label: 'outfits' },
  { key: 'you', icon: 'user', label: 'you' },
];

const meta: Meta<typeof TabBar> = {
  title: 'Components/TabBar',
  component: TabBar,
  args: { items, activeKey: 'wardrobe', onSelect: fn() },
  argTypes: {
    tone: { control: 'radio', options: ['light', 'onDark'] },
  },
};
export default meta;

type Story = StoryObj<typeof TabBar>;

export const Playground: Story = {
  decorators: [
    (StoryFn) => (
      <View style={{ padding: 24, width: 340, backgroundColor: semantic.light.background }}>
        <StoryFn />
      </View>
    ),
  ],
};

/** Each destination, so a glyph that fails to read at tab size is visible next to the others. */
export const Destinations: Story = {
  render: () => (
    <View style={{ padding: 24, width: 340, gap: 16, backgroundColor: semantic.light.background }}>
      {items.map((item) => (
        <TabBar key={item.key} items={items} activeKey={item.key} onSelect={() => {}} />
      ))}
    </View>
  ),
};

/** Tone axis. The capsule is lifted by a shadow on light and by a hairline border on dark, where a shadow cannot separate two dark surfaces. */
export const Tone: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, padding: 24 }}>
      {(['light', 'onDark'] as const).map((tone) => {
        const c = semantic[tone === 'light' ? 'light' : 'dark'];
        return (
          <View
            key={tone}
            style={{
              gap: 12,
              padding: 20,
              borderRadius: 12,
              width: 300,
              backgroundColor: tone === 'light' ? c.background : c.surface,
            }}
          >
            <Text style={{ fontSize: 12, color: c.textSubtle }}>{tone}</Text>
            <TabBar items={items} activeKey="outfits" onSelect={() => {}} tone={tone} />
          </View>
        );
      })}
    </View>
  ),
};

export const SelectsTab: Story = {
  args: { onSelect: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('tab', { name: 'outfits' }));
    await expect(args.onSelect).toHaveBeenCalledWith('outfits');
  },
};

/**
 * These tabs carry no visible label, so the selected state must reach assistive
 * technology or it is conveyed by color alone. It survives here because
 * react-native-web maps `selected` to `aria-selected` for roles that support it,
 * and `tab` is one; the same state is dropped on Pill's `button` role.
 */
export const SelectionExposed: Story = {
  args: { activeKey: 'wardrobe' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole('tab', { name: 'wardrobe' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(await canvas.findByRole('tab', { name: 'you' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  },
};
