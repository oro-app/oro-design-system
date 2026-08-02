import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from '@storybook/test';
import { useState } from 'react';
import { Text, View } from 'react-native';
import {
  Button,
  FadeUpSection,
  PressSpringPressable,
  SkeletonBlock,
  SlideUpSheet,
} from '@oro/ui';
import { colors, radii, spacing } from '@oro/tokens';

const meta: Meta = { title: 'Motion' };
export default meta;

function FadeUpDemo() {
  const [key, setKey] = useState(0);
  return (
    <View style={{ padding: 24, gap: 16 }}>
      <Button label="replay" variant="secondary" onPress={() => setKey((k) => k + 1)} />
      <View key={key} style={{ gap: 12 }}>
        {[0, 1, 2].map((i) => (
          <FadeUpSection key={i} delay={i * 90}>
            <View
              style={{
                padding: spacing.md,
                borderRadius: radii.lg,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text>staggered reveal {i + 1}</Text>
            </View>
          </FadeUpSection>
        ))}
      </View>
    </View>
  );
}

export const FadeUp: StoryObj = { render: () => <FadeUpDemo /> };

export const PressSpring: StoryObj = {
  render: () => (
    <View style={{ padding: 24 }}>
      <PressSpringPressable
        style={{
          padding: spacing.md,
          borderRadius: radii.lg,
          backgroundColor: colors.primaryAction,
          alignItems: 'center',
        }}
        onPress={() => {}}
      >
        <Text style={{ color: colors.primaryActionText }}>press me</Text>
      </PressSpringPressable>
    </View>
  ),
};

export const Skeleton: StoryObj = {
  render: () => (
    <View style={{ padding: 24, gap: 12 }}>
      <SkeletonBlock width={220} height={20} />
      <SkeletonBlock width={160} height={14} />
      <SkeletonBlock width="100%" height={120} borderRadius={radii.lg} />
    </View>
  ),
};

function SheetDemo() {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ padding: 24 }}>
      <Button label="open sheet" onPress={() => setOpen(true)} />
      <SlideUpSheet visible={open} onClose={() => setOpen(false)}>
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: radii.xxl,
            borderTopRightRadius: radii.xxl,
            padding: spacing.lg,
            gap: spacing.md,
          }}
        >
          <Text>sheet content</Text>
          <Button label="close" variant="secondary" onPress={() => setOpen(false)} />
        </View>
      </SlideUpSheet>
    </View>
  );
}

export const Sheet: StoryObj = {
  render: () => <SheetDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The sheet renders in a Modal portal outside canvasElement — query the body.
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(await canvas.findByText('open sheet'));
    await expect(await body.findByText('sheet content')).toBeTruthy();
    // Backdrop press closes (its Pressable is labeled "Close").
    await userEvent.click(await body.findByLabelText('Close'));
    await waitFor(() => expect(body.queryByText('sheet content')).toBeNull());
  },
};
