import type { Meta, StoryObj } from '@storybook/react-vite';
import { View } from 'react-native';
import { LoadErrorState } from '@oro/ui';

const meta: Meta<typeof LoadErrorState> = {
  title: 'Components/LoadErrorState',
  component: LoadErrorState,
};
export default meta;

type Story = StoryObj<typeof LoadErrorState>;

export const WithRetry: Story = {
  render: () => (
    <View style={{ height: 420 }}>
      <LoadErrorState onRetry={() => {}} />
    </View>
  ),
};

export const NoRetry: Story = {
  render: () => (
    <View style={{ height: 420 }}>
      <LoadErrorState note="we'll try again on our own." />
    </View>
  ),
};
