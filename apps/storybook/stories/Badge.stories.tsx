import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from '@storybook/test';
import { Text, View } from 'react-native';
import { Badge, TabBar, type TabBarItem } from '@oro/ui';
import { semantic } from '@oro/tokens';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  args: { label: 'phone not linked', count: 2 },
  argTypes: {
    tone: { control: 'radio', options: ['light', 'onDark'] },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
  decorators: [
    (StoryFn) => (
      <View style={{ padding: 24, backgroundColor: semantic.light.background }}>
        <StoryFn />
      </View>
    ),
  ],
};

/**
 * The two sizes, which are one signal.
 *
 * They share a fill on purpose: two colors here would read as two severities,
 * and the count is an aggregate of the same condition the dot marks.
 */
export const Sizes: Story = {
  render: () => (
    <View style={{ padding: 24, gap: 16, backgroundColor: semantic.light.background }}>
      {(
        [
          ['dot, no count', undefined],
          ['one', 1],
          ['aggregated', 12],
          ['over the cap', 128],
        ] as const
      ).map(([caption, count]) => (
        <View key={caption} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Badge label={caption} count={count} />
          <Text style={{ fontSize: 12, color: semantic.light.textSubtle }}>{caption}</Text>
        </View>
      ))}
    </View>
  ),
};

/** Both grounds, since the fill holds but the count text flips with the mode. */
export const Tone: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, padding: 24 }}>
      {(['light', 'onDark'] as const).map((tone) => (
        <View
          key={tone}
          style={{
            gap: 12,
            padding: 20,
            borderRadius: 12,
            backgroundColor:
              tone === 'onDark' ? semantic.dark.background : semantic.light.background,
          }}
        >
          <Badge label="needs attention" tone={tone} />
          <Badge label="2 need attention" count={2} tone={tone} />
        </View>
      ))}
    </View>
  ),
};

const items: TabBarItem[] = [
  { key: 'wardrobe', icon: 'hanger', label: 'wardrobe' },
  { key: 'outfits', icon: 'book-open', label: 'outfits' },
  { key: 'you', icon: 'user', label: 'you', badgeCount: 2 },
];

/**
 * The badge doing the job it exists for: visible from outside the screen that
 * owns the problem.
 *
 * The selected tab carries two marks, the selection dot under the icon and the
 * badge over it. This story is where that reads as deliberate or as noise.
 */
export const OnTabBar: Story = {
  render: () => (
    <View style={{ padding: 24, width: 340, gap: 16, backgroundColor: semantic.light.background }}>
      <TabBar items={items} activeKey="wardrobe" onSelect={() => {}} />
      <TabBar items={items} activeKey="you" onSelect={() => {}} />
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The count has to reach assistive tech through the tab's own name: the
    // badge is hidden from it, so a bare "you" here would mean a screen-reader
    // user never learns anything is waiting.
    await expect((await canvas.findAllByRole('tab', { name: /you, 2 need attention/ }))[0]).toBeTruthy();
  },
};
