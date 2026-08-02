import type { ButtonHTMLAttributes } from 'react';

/** quiet = modal done · accent = gold fill (cookie accept) · ghost = outline on dark. */
export type BtnVariant = 'quiet' | 'accent' | 'ghost';

export type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
};

/** Quiet in-flow utility button (uppercase tracked — a deliberate landing
 *  exception to the lowercase brand voice; pixels are canonical). */
export function Btn({ variant = 'quiet', className, type = 'button', ...rest }: BtnProps) {
  const cls = ['oro-btn', `oro-btn--${variant}`, className].filter(Boolean).join(' ');
  return <button type={type} className={cls} {...rest} />;
}
