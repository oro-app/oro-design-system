import type { Meta, StoryObj } from '@storybook/react-vite';
import { View, Text } from 'react-native';
import { Button, type ButtonVariant } from '@oro/ui';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { label: 'continue', variant: 'primary', prominence: 'standard', disabled: false },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'danger'] },
    prominence: { control: 'radio', options: ['standard', 'hero'] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {};

const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'danger'];

// Emphasis axis — one primary per screen; secondary beside it; tertiary for the way out; danger destructive.
export const Emphasis: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 24, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
      {variants.map((v) => (
        <Button key={v} label={v} variant={v} onPress={() => {}} />
      ))}
      {variants.map((v) => (
        <Button key={v + '-d'} label="disabled" variant={v} disabled />
      ))}
    </View>
  ),
};

// Prominence axis — Hero (square, Fraunces) for pivotal moments; standard for everything in-flow.
export const Prominence: Story = {
  render: () => (
    <View style={{ gap: 20, padding: 24 }}>
      <Text style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6 }}>HERO — welcome / onboarding / paywall</Text>
      <Button label="get my look" prominence="hero" onPress={() => {}} />
      <Text style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6 }}>STANDARD — in-flow</Text>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Button label="continue" variant="primary" onPress={() => {}} />
        <Button label="maybe later" variant="secondary" onPress={() => {}} />
      </View>
    </View>
  ),
};
