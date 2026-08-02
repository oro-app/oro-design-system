import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from '@storybook/test';
import { View } from 'react-native';
import { BackButton } from '@oro/ui';

const meta: Meta<typeof BackButton> = {
  title: 'Components/BackButton',
  component: BackButton,
  args: { onPress: fn() },
};
export default meta;

type Story = StoryObj<typeof BackButton>;

export const Playground: Story = {
  render: (args) => (
    <View style={{ padding: 24 }}>
      <BackButton {...args} />
    </View>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByLabelText('Go back'));
    await expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};
