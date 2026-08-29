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
  // Mode-split: dark resolves its OWN accent (a chroma-amplified gold), not the
  // light one. Both grounds are shown because `surface` is the binding, lighter one.
  { label: 'dark surface · plum', bg: semantic.dark.surface, ratio: '7.41:1', dark: true },
  {
    label: 'dark background · plum[900]',
    bg: semantic.dark.background,
    ratio: '10.18:1',
    dark: true,
  },
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

/**
 * `warning` — the needs-attention role, at the two sizes that consume it.
 *
 * It is a derived deep gold rather than a pinned amber, which puts it in the
 * same hue family as `accent`. The last row is the reason this story exists:
 * the two sit together on paper so the closeness is reviewable, and a palette
 * move that collapses them shows up in the screenshot diff.
 *
 * The 9px dot is the size the badge actually ships at, and whether a dark ochre
 * mark reads as an alert at a glance is a judgement no contrast ratio settles.
 */
export const Warning: Story = {
  render: () => (
    <View style={{ gap: 16, padding: 24 }}>
      {(['light', 'dark'] as const).map((mode) => {
        const c = semantic[mode];
        return (
          <View
            key={mode}
            style={{
              gap: 12,
              padding: 18,
              borderRadius: 12,
              backgroundColor: c.background,
              borderWidth: 1,
              borderColor: c.borderHairline,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{ width: 9, height: 9, borderRadius: 9, backgroundColor: c.warning }}
              />
              <View
                style={{
                  paddingVertical: 3,
                  paddingHorizontal: 7,
                  borderRadius: 100,
                  backgroundColor: c.warning,
                }}
              >
                <Text style={{ fontSize: 11, color: mode === 'light' ? palette.white : c.surface }}>
                  2
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: c.text }}>phone</Text>
              <Text style={{ fontSize: 13, color: c.textSubtle }}>not set</Text>
            </View>
            <View
              style={{
                gap: 4,
                padding: 12,
                borderRadius: 8,
                backgroundColor: c.surfaceWarning,
                borderLeftWidth: 2,
                borderLeftColor: c.warning,
              }}
            >
              <Text style={{ fontSize: 12, color: c.warningText }}>
                oro texts you your fits, so it can&rsquo;t reach you without a number.
              </Text>
            </View>
            <Text style={{ fontSize: 10, color: c.textSubtle }}>
              {mode} · warning {c.warning} · warningText {c.warningText}
            </Text>
          </View>
        );
      })}
      {/* The two golds together, because they are the pair most at risk of collapsing. */}
      <View style={{ gap: 8, padding: 18, borderRadius: 12, backgroundColor: palette.paper }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 9,
              height: 9,
              borderRadius: 9,
              backgroundColor: semantic.light.warning,
            }}
          />
          <Text style={{ fontSize: 12, color: semantic.light.warning }}>
            warning {semantic.light.warning} — 5.70:1
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 9,
              height: 9,
              borderRadius: 9,
              backgroundColor: semantic.light.accentText,
            }}
          />
          <Text style={{ fontSize: 12, color: semantic.light.accentText }}>
            accentText {semantic.light.accentText} — 4.80:1
          </Text>
        </View>
      </View>
    </View>
  ),
};

const ROLES = [
  'surface',
  'background',
  'text',
  'textSubtle',
  'textEditorial',
  'textEditorialMuted',
  'border',
  'primaryAction',
  'primaryActionText',
  'secondaryActionBorder',
  'selection',
  'dangerText',
  'warning',
  'warningText',
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

/**
 * The warm-neutral ramp, rendered as the editorial type it exists for.
 *
 * The ramp is anchored at ink→**cream**, not ink→paper: paper is itself only
 * C* 5.4, so halving it against ink left the base at C* 3.2 and the scale was
 * grey before a single step was derived. Re-anchoring warms every step (600
 * goes C* 2.7 → 5.9) at essentially unchanged lightness — no step moves more
 * than L* 1.1, and contrast on paper improves slightly at every one.
 *
 * The last row is the gap this ramp CANNOT close. Shades run toward ink at 15%
 * hue retention of an already-low-chroma base, so neutral[900] lands at C* 1.5
 * however the base is anchored — an editorial near-black has to be its own
 * derived role, not a ramp step.
 */
const EDITORIAL_STEPS = [400, 500, 600, 700, 800, 900] as const;

export const EditorialNeutrals: Story = {
  render: () => (
    <View style={{ gap: 12, padding: 24, backgroundColor: palette.paper }}>
      {EDITORIAL_STEPS.map((step) => (
        <View key={step} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 44,
              height: 28,
              borderRadius: 6,
              backgroundColor: ramps.neutral[step],
            }}
          />
          <Text style={{ fontSize: 15, color: ramps.neutral[step] }}>
            neutral {step} — an editorial dek, set on paper
          </Text>
          <Text style={{ fontSize: 10, color: semantic.light.textSubtle }}>
            {ramps.neutral[step]}
          </Text>
        </View>
      ))}
      <Text style={{ fontSize: 11, color: semantic.light.textSubtle }}>
        the ramp bottoms out at C* 1.5 by 900 — nowhere near the warmth of the landing&rsquo;s
        editorial near-black. that gap is a separate role, not a step.
      </Text>
    </View>
  ),
};
