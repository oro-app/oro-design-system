import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text, View } from 'react-native';
import { RAMP_STEPS, palette, ramps, semantic, type RampFamily } from '@oro/tokens';

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

/**
 * `accentText` — the one chromatic text role.
 *
 * It exists because the obvious candidates all fail: the brand gold is 2.10:1
 * on paper, and the nearest ramp step that passes (gold[600], 4.27:1) still
 * misses AA and reads brown, because ramps shed chroma as they mix toward
 * near-achromatic anchors. This value is solved instead — gold's hue held, 87%
 * of its chroma held, lightness moved until it clears 4.8:1 — so it stays
 * recognisably gold at C* 46.0.
 *
 * The row of grounds is the visual review surface: if a palette change ever
 * drags this toward brown, or toward illegibility on cream, the screenshot diff
 * says so.
 */
const ACCENT_GROUNDS = [
  { label: 'background · paper', bg: semantic.light.background, ratio: '4.80:1' },
  { label: 'surface · white', bg: semantic.light.surface, ratio: '4.95:1' },
  { label: 'cream', bg: palette.cream, ratio: '4.54:1' },
  { label: 'dark surface · plum', bg: semantic.dark.surface, ratio: '6.16:1', dark: true },
];

export const AccentText: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 24 }}>
      {ACCENT_GROUNDS.map(({ label, bg, ratio, dark }) => {
        const c = dark ? semantic.dark : semantic.light;
        return (
          <View
            key={label}
            style={{
              gap: 6,
              padding: 18,
              borderRadius: 12,
              backgroundColor: bg,
              borderWidth: 1,
              borderColor: c.borderHairline,
            }}
          >
            <Text style={{ fontSize: 18, color: c.accentText }}>
              an accent word, set in gold
            </Text>
            <Text style={{ fontSize: 12, color: c.accentText }}>
              small accent text at 12px, the size that made this a bug
            </Text>
            <Text style={{ fontSize: 10, color: c.textSubtle }}>
              {label} · {c.accentText} · {ratio}
            </Text>
          </View>
        );
      })}
      {/* The failing alternatives, side by side, so the choice is auditable. */}
      <View style={{ gap: 6, padding: 18, borderRadius: 12, backgroundColor: palette.paper }}>
        <Text style={{ fontSize: 12, color: palette.gold }}>gold — 2.10:1, fails</Text>
        <Text style={{ fontSize: 12, color: ramps.gold[600] }}>gold[600] — 4.27:1, fails</Text>
        <Text style={{ fontSize: 12, color: semantic.light.accentText }}>accentText — 4.80:1</Text>
      </View>
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
