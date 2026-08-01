import type { Meta, StoryObj } from '@storybook/react-vite';
import { View } from 'react-native';
import { Pill } from '@oro/ui';

const meta: Meta<typeof Pill> = {
  title: 'Components/Pill',
  component: Pill,
  args: { label: 'casual', active: false },
};
export default meta;

type Story = StoryObj<typeof Pill>;

export const Playground: Story = {};

export const Row: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, padding: 24 }}>
      <Pill label="casual" active />
      <Pill label="work" />
      <Pill label="date night" />
      <Pill label="formal" />
    </View>
  ),
};
