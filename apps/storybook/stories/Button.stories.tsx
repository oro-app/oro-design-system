import type { Meta, StoryObj } from '@storybook/react-vite';
import { View } from 'react-native';
import { Button, type ButtonVariant, type ButtonSize } from '@oro/ui';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { label: 'continue', variant: 'primary', size: 'hero', disabled: false },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'danger'] },
    size: { control: 'radio', options: ['hero', 'compact'] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'danger'];
const sizes: ButtonSize[] = ['hero', 'compact'];

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 24, padding: 24 }}>
      {sizes.map((size) => (
        <View key={size} style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {variants.map((variant) => (
            <Button key={variant} label={variant} variant={variant} size={size} onPress={() => {}} />
          ))}
          {variants.map((variant) => (
            <Button key={variant + '-d'} label="disabled" variant={variant} size={size} disabled />
          ))}
        </View>
      ))}
    </View>
  ),
};
