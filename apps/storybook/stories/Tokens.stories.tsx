import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text, View } from 'react-native';
import { RAMP_STEPS, ramps, semantic, type RampFamily } from '@oro/tokens';

/**
 * Token-layer documentation. Stories here are the visual review surface for
 * tier 1 (ramps) and tier 2 (semantic modes) — a swatch shifting in the
 * screenshot diff is how a token change gets caught.
 */
const meta: Meta = {
  title: 'Tokens/Color',
};
export default meta;

type Story = StoryObj;

const FAMILIES: RampFamily[] = ['plum', 'gold', 'rose', 'neutral'];
/** The step each brand hex is pinned to, exactly. */
const BASE_STEP: Record<RampFamily, number> = { plum: 800, gold: 400, rose: 500, neutral: 500 };

function Swatch({ hex, step, isBase }: { hex: string; step: number; isBase: boolean }) {
  return (
    <View style={{ gap: 6 }}>
      <View style={{ width: 84, height: 52, borderRadius: 8, backgroundColor: hex }} />
      <Text style={{ fontSize: 10, opacity: isBase ? 1 : 0.55, fontWeight: isBase ? '600' : '400' }}>
        {step}
        {isBase ? ' ◆' : ''}
      </Text>
      <Text style={{ fontSize: 9, opacity: 0.4 }}>{hex}</Text>
    </View>
  );
}

/**
 * Tonal ramps — every step derived from the brand hex via OKLab interpolation
 * toward paper (tints) and a hue-retaining ink (shades). The ◆ step is the
 * exact brand color; ramps are generated around it, never over it.
 */
export const Ramps: Story = {
  render: () => (
    <View style={{ gap: 24, padding: 24 }}>
      {FAMILIES.map((family) => (
        <View key={family} style={{ gap: 8 }}>
          <Text style={{ fontSize: 12, fontWeight: '600' }}>
            {family} · base {BASE_STEP[family]}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {RAMP_STEPS.map((step) => (
              <Swatch
                key={step}
                hex={ramps[family][step]}
                step={step}
                isBase={step === BASE_STEP[family]}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  ),
};

const ROLES = [
  'surface',
  'background',
  'text',
  'textSubtle',
  'border',
  'primaryAction',
  'primaryActionText',
  'secondaryActionBorder',
  'selection',
  'dangerText',
  'accent',
] as const;

/**
 * The same semantic roles resolved in both modes. Components flip between these
 * wholesale via `tone` — there are no `*OnDark` one-off tokens.
 */
export const Modes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16, padding: 24 }}>
      {(['light', 'dark'] as const).map((mode) => {
        const c = semantic[mode];
        return (
          <View
            key={mode}
            style={{
              gap: 10,
              padding: 20,
              borderRadius: 12,
              backgroundColor: c.surface,
              borderWidth: 1,
              borderColor: c.border,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: c.text }}>{mode}</Text>
            {ROLES.map((role) => (
              <View key={role} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: c[role],
                    borderWidth: 1,
                    borderColor: c.borderHairline,
                  }}
                />
                <Text style={{ fontSize: 10, color: c.textSubtle }}>{role}</Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  ),
};
