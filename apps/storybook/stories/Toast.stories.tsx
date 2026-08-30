import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from '@storybook/test';
import { Text, View } from 'react-native';
import { Toast } from '@oro/ui';
import { semantic } from '@oro/tokens';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  args: {
    message: "couldn't delete that fit. it's still in your closet.",
    visible: true,
    // Every static story holds the toast open, since a dwell that fires mid-run
    // screenshots an empty frame.
    duration: 0,
    onDismiss: fn(),
  },
  argTypes: {
    tone: { control: 'radio', options: ['light', 'onDark'] },
  },
};
export default meta;

type Story = StoryObj<typeof Toast>;

export const Playground: Story = {
  decorators: [
    (StoryFn) => (
      <View style={{ padding: 24, width: 360, backgroundColor: semantic.light.background }}>
        <StoryFn />
      </View>
    ),
  ],
};

/** Both grounds, since every colour and the whole separation treatment flip with the mode. */
export const Tone: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, padding: 24 }}>
      {(['light', 'onDark'] as const).map((tone) => (
        <View
          key={tone}
          style={{
            width: 320,
            padding: 20,
            borderRadius: 16,
            backgroundColor:
              tone === 'onDark' ? semantic.dark.background : semantic.light.background,
          }}
        >
          <Toast
            tone={tone}
            visible
            duration={0}
            message="couldn't delete that fit. it's still in your closet."
            onDismiss={() => {}}
          />
        </View>
      ))}
    </View>
  ),
};

/**
 * The consumer owns placement.
 *
 * The package has no safe-area dependency, so the app absolutely positions the
 * toast and supplies the inset that clears the tab bar.
 */
export const OverContent: Story = {
  render: () => {
    const c = semantic.light;
    return (
      <View
        style={{
          width: 360,
          height: 300,
          padding: 20,
          backgroundColor: c.background,
          overflow: 'hidden',
        }}
      >
        {['plum wool coat', 'cream linen shirt', 'black straight jeans'].map((item) => (
          <View
            key={item}
            style={{
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: c.borderHairline,
            }}
          >
            <Text style={{ fontSize: 13.5, color: c.text }}>{item}</Text>
          </View>
        ))}
        <View style={{ position: 'absolute', left: 20, right: 20, bottom: 24 }}>
          <Toast
            visible
            duration={0}
            message="couldn't delete that fit. it's still in your closet."
            onDismiss={() => {}}
          />
        </View>
      </View>
    );
  },
};

/** Hidden renders nothing, so a caller can leave it mounted for the whole screen. */
export const Hidden: Story = {
  args: { visible: false },
  decorators: [
    (StoryFn) => (
      <View style={{ padding: 24, width: 360, height: 80, backgroundColor: semantic.light.background }}>
        <StoryFn />
      </View>
    ),
  ],
};

/** The close control has to actually fire: a toast that cannot be dismissed sits on the content. */
export const DismissFires: Story = {
  decorators: [
    (StoryFn) => (
      <View style={{ padding: 24, width: 360, backgroundColor: semantic.light.background }}>
        <StoryFn />
      </View>
    ),
  ],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'dismiss' }));
    await expect(args.onDismiss).toHaveBeenCalled();
  },
};

/**
 * The dwell elapses on its own, so a caller that shows the toast need not also
 * hide it.
 *
 * `visible` stays an arg here, so what the dwell reports is the callback firing
 * rather than the toast vanishing mid-screenshot.
 */
export const DwellDismisses: Story = {
  args: { duration: 400 },
  decorators: [
    (StoryFn) => (
      <View style={{ padding: 24, width: 360, backgroundColor: semantic.light.background }}>
        <StoryFn />
      </View>
    ),
  ],
  play: async ({ args }) => {
    await waitFor(() => expect(args.onDismiss).toHaveBeenCalled(), { timeout: 4000 });
  },
};
