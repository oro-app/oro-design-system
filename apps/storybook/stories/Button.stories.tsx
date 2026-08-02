import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from '@storybook/test';
import { View, Text } from 'react-native';
import { Button, Icon, type ButtonSize, type ButtonVariant } from '@oro/ui';
import { semantic } from '@oro/tokens';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  args: { label: 'continue', variant: 'primary', prominence: 'standard', disabled: false, onPress: fn() },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'tertiary', 'danger'] },
    prominence: { control: 'radio', options: ['standard', 'hero'] },
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'radio', options: ['light', 'onDark'] },
    content: { control: 'radio', options: ['text', 'iconText', 'iconOnly'] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText('continue'));
    await expect(args.onPress).toHaveBeenCalledTimes(1);
  },
};

export const DisabledNoPress: Story = {
  args: { disabled: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText('continue'));
    await expect(args.onPress).not.toHaveBeenCalled();
  },
};

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
      <Text style={{ fontSize: 12, opacity: 0.6 }}>hero — welcome / onboarding / paywall</Text>
      <Button label="get my look" prominence="hero" onPress={() => {}} />
      <Text style={{ fontSize: 12, opacity: 0.6 }}>standard — in-flow</Text>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Button label="continue" variant="primary" onPress={() => {}} />
        <Button label="maybe later" variant="secondary" onPress={() => {}} />
      </View>
    </View>
  ),
};

const sizes: ButtonSize[] = ['sm', 'md', 'lg'];

// Size axis — scale only. `md` (52pt) is the default and matches the pre-size geometry.
export const Size: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 24, flexDirection: 'row', alignItems: 'center' }}>
      {sizes.map((s) => (
        <Button key={s} label={s} size={s} onPress={() => {}} />
      ))}
    </View>
  ),
};

// Content axis — iconOnly keeps `label` as the accessibility label and renders a square target.
export const Content: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 24, flexDirection: 'row', alignItems: 'center' }}>
      <Button label="continue" onPress={() => {}} />
      <Button
        label="add piece"
        content="iconText"
        icon={<Icon name="plus" size="sm" color={semantic.light.primaryActionText} />}
        onPress={() => {}}
      />
      <Button
        label="add piece"
        content="iconText"
        iconPosition="trailing"
        icon={<Icon name="chevron-right" size="sm" color={semantic.light.primaryActionText} />}
        onPress={() => {}}
      />
      <Button
        label="add piece"
        content="iconOnly"
        icon={<Icon name="plus" size="sm" color={semantic.light.primaryActionText} />}
        onPress={() => {}}
      />
    </View>
  ),
};

// Tone axis — the same buttons on a light surface and on a plum brand surface.
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
            backgroundColor: semantic[tone === 'light' ? 'light' : 'dark'].surface,
          }}
        >
          <Text style={{ fontSize: 12, color: semantic[tone === 'light' ? 'light' : 'dark'].textSubtle }}>
            {tone}
          </Text>
          {variants.map((v) => (
            <Button key={v} label={v} variant={v} tone={tone} onPress={() => {}} />
          ))}
          <Button label="disabled" tone={tone} disabled />
        </View>
      ))}
    </View>
  ),
};

/**
 * iconOnly must never ship an unlabelled control: the label is visually
 * suppressed but survives as the accessible name. Asserted, because the type
 * system can't express it.
 */
export const IconOnlyIsLabelled: Story = {
  args: { label: 'add piece', content: 'iconOnly' },
  render: (args) => (
    <Button {...args} icon={<Icon name="plus" size="sm" color={semantic.light.primaryActionText} />} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // No visible text node…
    await expect(canvas.queryByText('add piece')).toBeNull();
    // …but the control is still reachable by its accessible name.
    await expect(await canvas.findByLabelText('add piece')).toBeTruthy();
  },
};

/** `hero` deliberately ignores `size`, so both render at the same height. */
export const HeroIgnoresSize: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, padding: 24, alignItems: 'center' }}>
      <Button label="hero sm" prominence="hero" size="sm" onPress={() => {}} />
      <Button label="hero lg" prominence="hero" size="lg" onPress={() => {}} />
    </View>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const a = (await canvas.findByLabelText('hero sm')).getBoundingClientRect();
    const b = (await canvas.findByLabelText('hero lg')).getBoundingClientRect();
    await expect(a.height).toBe(b.height);
  },
};
