import type { ButtonHTMLAttributes } from 'react';

/** Size recipes map 1:1 to the landing originals — see dist/oro-web.css. */
export type CtaSize = 'compact' | 'standard' | 'statement' | 'hero' | 'full' | 'block' | 'inline';

export type CtaProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: CtaSize;
  /** Flip to fg-on-bg (the "ondark" cream-on-plum treatment in dark theme). */
  inverse?: boolean;
};

/** The landing's editorial serif-italic CTA. Renders a real <button>;
 *  import '@oro/web/styles.css' once per app. */
export function Cta({ size = 'standard', inverse = false, className, type = 'button', ...rest }: CtaProps) {
  const cls = ['oro-cta', `oro-cta--${size}`, inverse && 'oro-cta--inverse', className]
    .filter(Boolean)
    .join(' ');
  return <button type={type} className={cls} {...rest} />;
}
