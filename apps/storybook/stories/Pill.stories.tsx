import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Text, View } from 'react-native';
import { Icon, Pill } from '@oro/ui';
import { semantic } from '@oro/tokens';

const meta: Meta<typeof Pill> = {
  title: 'Components/Pill',
  component: Pill,
  args: { label: 'casual', active: false },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
    tone: { control: 'radio', options: ['light', 'onDark'] },
  },
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

// Size axis — md is the default and matches the pre-size geometry.
export const Size: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, padding: 24, alignItems: 'center' }}>
      <Pill label="small" size="sm" />
      <Pill label="small selected" size="sm" active />
      <Pill label="medium" size="md" />
      <Pill label="medium selected" size="md" active />
    </View>
  ),
};

// Icon slots + disabled.
export const IconsAndDisabled: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, padding: 24, alignItems: 'center' }}>
      <Pill
        label="filter"
        leadingIcon={<Icon name="sliders" size={14} color={semantic.light.textMuted} />}
      />
      <Pill
        label="selected"
        active
        trailingIcon={<Icon name="x" size={14} color={semantic.light.primaryActionText} />}
      />
      <Pill label="disabled" disabled />
    </View>
  ),
};

/**
 * Tone axis. Note the resting pill is FILLED on light and an OUTLINE on dark —
 * a white chip on plum reads as a card, not a filter. Selection stays filled in
 * both tones.
 */
export const Tone: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, padding: 24 }}>
      {(['light', 'onDark'] as const).map((tone) => {
        const c = semantic[tone === 'light' ? 'light' : 'dark'];
        return (
          <View
            key={tone}
            style={{ gap: 12, padding: 20, borderRadius: 12, backgroundColor: c.surface }}
          >
            <Text style={{ fontSize: 12, color: c.textSubtle }}>{tone}</Text>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Pill label="all" tone={tone} />
              <Pill label="selected" tone={tone} active />
              <Pill label="small" tone={tone} size="sm" />
              <Pill label="disabled" tone={tone} disabled />
            </View>
          </View>
        );
      })}
    </View>
  ),
};

/** Disabled must actually block the press, not just look inert. */
export const DisabledNoPress: Story = {
  args: { label: 'casual', disabled: true, onPress: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByText('casual'));
    await expect(args.onPress).not.toHaveBeenCalled();
  },
};

/**
 * CHARACTERIZATION TEST — records a CONFIRMED accessibility defect.
 *
 * Pill sets `accessibilityRole="button"` + `accessibilityState={{ selected }}`.
 * react-native-web only maps `selected` to `aria-selected` for roles that
 * support it (option/tab/row/…), NOT for `button`. Verified: the attribute is
 * `null`. So on web the selected state is conveyed by COLOUR ALONE, with
 * nothing exposed to assistive technology.
 *
 * This test asserts the broken behaviour on purpose, so it fails loudly the
 * moment someone fixes it — at which point delete this and assert the real
 * contract. The fix is a role change (`checkbox`/`radio`, or a toggle-button
 * with `aria-pressed` as @oro/web's Chip already uses), which alters native
 * VoiceOver semantics too and therefore needs a deliberate decision.
 */
export const SelectionNotExposedOnWeb: Story = {
  args: { label: 'casual', active: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const el = await canvas.findByLabelText('casual');
    // The accessible NAME works…
    await expect(el).toBeTruthy();
    // …but the selected STATE is not exposed. This is the defect.
    await expect(el).not.toHaveAttribute('aria-selected');
    await expect(el).not.toHaveAttribute('aria-checked');
    await expect(el).not.toHaveAttribute('aria-pressed');
  },
};
