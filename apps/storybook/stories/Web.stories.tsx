import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { Btn, Chip, Cta } from '@oro/web';
import { colors } from '@oro/tokens';
import '@oro/web/styles.css';

// The landing's editorial web patterns (@oro/web) — plain <button> + CSS,
// no react-native-web. Pixels are canonical: transcribed 1:1 from oro-landing.
const meta: Meta = { title: 'Web/Landing patterns' };
export default meta;

// The landing's theme vars, dark-theme values — the CTAs were designed on plum.
const darkSurface: React.CSSProperties = {
  background: colors.plum,
  padding: 32,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 16,
  alignItems: 'center',
  ['--color-fg' as never]: colors.paper,
  ['--color-bg' as never]: colors.plum,
  ['--color-fg-line' as never]: '#FFF9ED2E',
  ['--color-fg-faint' as never]: '#FFF9EDB3',
  ['--color-accent' as never]: colors.gold,
};

export const Ctas: StoryObj = {
  args: { onClick: fn() },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* compact lives on the landing's inverted (cream) hero section */}
      <div style={{ ...darkSurface, background: colors.paper }}>
        <Cta size="compact" {...args}>start the conversation</Cta>
      </div>
      {/* block + inline live on the cream letter card, not on plum */}
      <div style={{ ...darkSurface, background: colors.white, flexDirection: 'column', alignItems: 'flex-start', width: 420 }}>
        <Cta size="block" {...args}>seal &amp; send</Cta>
        <Cta size="inline" {...args}>sign me up</Cta>
        {/* pill closes a newsletter article — sans, full radius, plum fill */}
        <Cta size="pill" {...args}>get oro on ios</Cta>
      </div>
      <div style={darkSurface}>
        <Cta size="standard" inverse {...args}>join the mailing list</Cta>
        <Cta size="statement" inverse {...args}>try oro</Cta>
        <Cta size="hero" inverse {...args}>start the conversation</Cta>
        <div style={{ width: 300 }}>
          <Cta size="full" inverse {...args}>get started.</Cta>
        </div>
        <div style={{ width: 300 }}>
          <Cta size="full" inverse disabled>disabled.</Cta>
        </div>
      </div>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getAllByRole('button', { name: 'start the conversation' })[0]);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.click(canvas.getByRole('button', { name: 'disabled.' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Btns: StoryObj = {
  render: () => (
    <div style={{ padding: 32, display: 'flex', gap: 16, alignItems: 'center', background: colors.paper }}>
      <div style={{ width: 220 }}>
        <Btn variant="quiet">done</Btn>
      </div>
      <Btn variant="accent">accept</Btn>
      <span style={{ background: colors.plum, padding: 12, display: 'inline-flex' }}>
        <Btn variant="ghost">no thanks</Btn>
      </span>
    </div>
  ),
};

function ChipsDemo() {
  const [topic, setTopic] = useState('hello');
  const [tags, setTags] = useState<string[]>([]);
  const toggle = (t: string) =>
    setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: colors.white, padding: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['hello', 'support', 'press'].map((t) => (
          <Chip key={t} selected={topic === t} onClick={() => setTopic(t)}>{t}.</Chip>
        ))}
      </div>
      <div style={{ ...darkSurface, gap: 12 }}>
        {['tiktok', 'instagram', 'a friend'].map((t) => (
          <Chip key={t} pill selected={tags.includes(t)} onClick={() => toggle(t)}>{t}</Chip>
        ))}
      </div>
    </div>
  );
}

export const Chips: StoryObj = {
  render: () => <ChipsDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tiktok = canvas.getByRole('button', { name: 'tiktok' });
    await expect(tiktok).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(tiktok);
    await expect(tiktok).toHaveAttribute('aria-pressed', 'true');
  },
};
