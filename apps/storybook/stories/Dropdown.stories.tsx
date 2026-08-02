import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { useState } from 'react';
import { View } from 'react-native';
import { Dropdown } from '@oro/ui';

const OPTIONS = [
  { value: 'all', label: 'everything', hint: 'the whole wardrobe' },
  { value: 'tops', label: 'tops' },
  { value: 'bottoms', label: 'bottoms' },
  { value: 'shoes', label: 'shoes' },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

function Demo({ disabled = false }: { disabled?: boolean }) {
  const [value, setValue] = useState('all');
  return (
    <View style={{ padding: 24, maxWidth: 280 }}>
      <Dropdown
        label="show"
        value={value}
        options={OPTIONS}
        onChange={setValue}
        sheetTitle="show"
        disabled={disabled}
      />
    </View>
  );
}

// Option A: quiet muted label, value in focus, soft rectangle, balanced padding.
export const Playground: Story = {
  render: () => <Demo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByLabelText('show: everything'));
    // The sheet renders in a Modal portal outside canvasElement — query the body.
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(await body.findByLabelText('tops'));
    await waitFor(async () => {
      await expect(await canvas.findByLabelText('show: tops')).toBeTruthy();
    });
  },
};

export const Disabled: Story = { render: () => <Demo disabled /> };
