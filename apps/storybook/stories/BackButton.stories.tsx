import type { Meta, StoryObj } from '@storybook/react-vite';
import { View } from 'react-native';
import { BackButton } from '@oro/ui';

const meta: Meta<typeof BackButton> = {
  title: 'Components/BackButton',
  component: BackButton,
  args: { onPress: () => {} },
};
export default meta;

type Story = StoryObj<typeof BackButton>;

export const Playground: Story = {
  render: (args) => (
    <View style={{ padding: 24 }}>
      <BackButton {...args} />
    </View>
  ),
};
