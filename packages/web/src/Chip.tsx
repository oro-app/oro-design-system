import type { ButtonHTMLAttributes } from 'react';

export type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** default: serif editorial chip (contact). pill: sans full-radius (get-started). */
  pill?: boolean;
  selected?: boolean;
};

/** Selection chip. Selection is conveyed via aria-pressed (which also drives
 *  the selected styling). */
export function Chip({ pill = false, selected = false, className, type = 'button', ...rest }: ChipProps) {
  const cls = ['oro-chip', pill && 'oro-chip--pill', className].filter(Boolean).join(' ');
  return <button type={type} className={cls} aria-pressed={selected} {...rest} />;
}
