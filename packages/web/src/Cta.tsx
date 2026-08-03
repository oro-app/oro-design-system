import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

/** Size recipes map 1:1 to the landing originals — see dist/oro-web.css. */
export type CtaSize =
  | 'compact'
  | 'standard'
  | 'statement'
  | 'hero'
  | 'full'
  | 'block'
  | 'inline'
  /** Full-radius label pill; inherits the surrounding font-family
   *  (the landing's end-of-article store link). */
  | 'pill';

type CtaOwnProps = {
  size?: CtaSize;
  /** Flip to fg-on-bg (the "ondark" cream-on-plum treatment in dark theme). */
  inverse?: boolean;
};

/** A CTA that navigates: pass `href` and it renders a real <a>. */
export type CtaLinkProps = CtaOwnProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** A CTA that acts: no `href`, renders a <button>. */
export type CtaButtonProps = CtaOwnProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

export type CtaProps = CtaLinkProps | CtaButtonProps;

/** The landing's editorial serif-italic CTA.
 *
 *  Renders an `<a>` when given an `href` and a `<button>` otherwise — a CTA that
 *  navigates must stay a real link, or it drops out of the crawlable link graph
 *  and loses middle-click, ⌘-click and the "link" role for assistive tech. The
 *  `.oro-cta` base already sets `text-decoration: none` and `inline-flex`, so
 *  both elements render identically.
 *
 *  Import '@oro/web/styles.css' once per app. */
export function Cta(props: CtaProps) {
  const { size = 'standard', inverse = false, className, ...rest } = props;
  const cls = ['oro-cta', `oro-cta--${size}`, inverse && 'oro-cta--inverse', className]
    .filter(Boolean)
    .join(' ');

  if (rest.href !== undefined) {
    // No `type` default here: on an anchor `type` is a MIME hint, not a button role.
    return <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }

  const { type = 'button', ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type={type} className={cls} {...buttonProps} />;
}
