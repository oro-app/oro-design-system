import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type ReactNode } from 'react';
import { Text, View } from 'react-native';
import {
  BackButton,
  Button,
  type ButtonVariant,
  Dropdown,
  Icon,
  type IconName,
  LoadErrorState,
  Pill,
  SkeletonBlock,
} from '@oro/ui';
import { colors, fonts, radii, spacing, typography } from '@oro/tokens';

// The whole system on one page — every component, every variant and state —
// so the gallery can be reviewed without flipping stories or controls.
const meta: Meta = { title: 'Gallery' };
export default meta;

const variants: ButtonVariant[] = ['primary', 'secondary', 'tertiary', 'danger'];
const iconNames: IconName[] = [
  'arrow-left', 'chevron-down', 'chevron-right', 'check', 'x', 'plus',
  'search', 'alert-circle', 'rotate-ccw', 'heart', 'camera', 'sliders',
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: spacing.md }}>
      <Text
        style={{
          fontFamily: fonts.frauncesMedium,
          fontSize: typography.heading,
          color: colors.text,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Label({ children }: { children: string }) {
  return (
    <Text style={{ fontFamily: fonts.inter, fontSize: typography.subtext, color: colors.textSubtle }}>
      {children}
    </Text>
  );
}

function DropdownDemo({ disabled = false }: { disabled?: boolean }) {
  const [value, setValue] = useState('all');
  return (
    <View style={{ maxWidth: 280 }}>
      <Dropdown
        label="show"
        value={value}
        options={[
          { value: 'all', label: 'everything' },
          { value: 'tops', label: 'tops' },
        ]}
        onChange={setValue}
        sheetTitle="show"
        disabled={disabled}
      />
    </View>
  );
}

export const Everything: StoryObj = {
  render: () => (
    <View style={{ padding: spacing.xl, gap: spacing.xxl, maxWidth: 720 }}>
      <Section title="button — hero">
        <Button label="get my look" prominence="hero" onPress={() => {}} />
      </Section>

      <Section title="button — standard">
        <Label>emphasis: primary / secondary / tertiary / danger</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {variants.map((v) => (
            <Button key={v} label={v} variant={v} onPress={() => {}} />
          ))}
        </View>
        <Label>disabled</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {variants.map((v) => (
            <Button key={v} label={v} variant={v} disabled />
          ))}
        </View>
        <Label>with leading icon</Label>
        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <Button
            label="add piece"
            leadingIcon={<Icon name="plus" size="sm" color={colors.primaryActionText} />}
            onPress={() => {}}
          />
        </View>
      </Section>

      <Section title="pill">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          <Pill label="active" active />
          <Pill label="default" />
          <Pill label="date night" />
        </View>
      </Section>

      <Section title="back button">
        <BackButton onPress={() => {}} />
      </Section>

      <Section title="dropdown">
        <Label>default</Label>
        <DropdownDemo />
        <Label>disabled</Label>
        <DropdownDemo disabled />
      </Section>

      <Section title="icon set">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, maxWidth: 460 }}>
          {iconNames.map((n) => (
            <View key={n} style={{ alignItems: 'center', gap: 6, width: 72 }}>
              <Icon name={n} size="lg" color={colors.primaryAction} />
              <Text style={{ fontSize: 10, color: colors.textMuted }}>{n}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="skeleton">
        <View style={{ gap: spacing.sm }}>
          <SkeletonBlock width={220} height={20} />
          <SkeletonBlock width={160} height={14} />
          <SkeletonBlock width="100%" height={100} borderRadius={radii.lg} />
        </View>
      </Section>

      <Section title="load / error state">
        <View style={{ height: 380, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg }}>
          <LoadErrorState onRetry={() => {}} />
        </View>
      </Section>
    </View>
  ),
};
