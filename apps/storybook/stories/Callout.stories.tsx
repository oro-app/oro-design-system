import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Text, View } from 'react-native';
import { Callout } from '@oro/ui';
import { semantic } from '@oro/tokens';

const meta: Meta<typeof Callout> = {
  title: 'Components/Callout',
  component: Callout,
  args: {
    title: 'finish setting up',
    body: "oro texts you your fits, so it can't reach you without a number.",
    actionLabel: 'link your number',
    onAction: fn(),
  },
  argTypes: {
    prominence: { control: 'radio', options: ['card', 'inline'] },
    tone: { control: 'radio', options: ['light', 'onDark'] },
  },
};
export default meta;

type Story = StoryObj<typeof Callout>;

export const Playground: Story = {
  decorators: [
    (StoryFn) => (
      <View style={{ padding: 24, width: 360, backgroundColor: semantic.light.background }}>
        <StoryFn />
      </View>
    ),
  ],
};

/**
 * The two forms.
 *
 * The card is a titled block that carries the fix; the inline alert is one line
 * on a leading rule, which is what ties it to the field it is about. Both name
 * the loss, because a tint on its own explains nothing.
 */
export const Prominence: Story = {
  render: () => (
    <View style={{ padding: 24, width: 360, gap: 20, backgroundColor: semantic.light.background }}>
      <Callout
        title="finish setting up"
        body="oro texts you your fits, so it can't reach you without a number."
        actionLabel="link your number"
        onAction={() => {}}
      />
      <Callout
        prominence="inline"
        body="oro can't text you your fits without a number."
      />
    </View>
  ),
};

/** Without an action, for the cases where the fix lives on the row itself. */
export const NoAction: Story = {
  args: { actionLabel: undefined },
  decorators: [
    (StoryFn) => (
      <View style={{ padding: 24, width: 360, backgroundColor: semantic.light.background }}>
        <StoryFn />
      </View>
    ),
  ],
};

/** Both grounds, since every colour here flips wholesale with the mode. */
export const Tone: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, padding: 24 }}>
      {(['light', 'onDark'] as const).map((tone) => (
        <View
          key={tone}
          style={{
            width: 300,
            gap: 16,
            padding: 20,
            borderRadius: 16,
            backgroundColor:
              tone === 'onDark' ? semantic.dark.background : semantic.light.background,
          }}
        >
          <Callout
            tone={tone}
            title="finish setting up"
            body="oro texts you your fits, so it can't reach you without a number."
            actionLabel="link your number"
            onAction={() => {}}
          />
          <Callout tone={tone} prominence="inline" body="oro can't reach you without a number." />
        </View>
      ))}
    </View>
  ),
};

/**
 * The case the ticket was written from: the prompt card above the list, with the
 * rows left ordinary.
 *
 * The value slot still reads `not set` in muted grey. That is the point of the
 * pattern, since a call to action in the value slot is what read as a link in
 * every colour tried.
 */
export const AboveAList: Story = {
  render: () => {
    const c = semantic.light;
    return (
      <View style={{ padding: 20, width: 360, backgroundColor: c.background }}>
        <Callout
          title="finish setting up"
          body="oro texts you your fits, so it can't reach you without a number."
          actionLabel="link your number"
          onAction={() => {}}
        />
        <View style={{ marginTop: 18 }}>
          {(
            [
              ['name', 'oro user'],
              ['email', 'sunny@gmail.com'],
              ['phone', 'not set'],
            ] as const
          ).map(([label, value]) => (
            <View
              key={label}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: c.borderHairline,
              }}
            >
              <Text style={{ fontSize: 13.5, color: c.text }}>{label}</Text>
              <Text style={{ fontSize: 13.5, color: c.textSubtle }}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  },
};

/** The action has to actually fire: a callout that explains but cannot fix is half the pattern. */
export const ActionFires: Story = {
  decorators: [
    (StoryFn) => (
      <View style={{ padding: 24, width: 360, backgroundColor: semantic.light.background }}>
        <StoryFn />
      </View>
    ),
  ],
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(await canvas.findByRole('button', { name: 'link your number' }));
    await expect(args.onAction).toHaveBeenCalled();
  },
};
