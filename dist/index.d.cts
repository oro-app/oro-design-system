import * as react from 'react';
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

/** Size recipes map 1:1 to the landing originals — see dist/oro-web.css. */
type CtaSize = 'compact' | 'standard' | 'statement' | 'hero' | 'full' | 'block' | 'inline'
/** Full-radius label pill; inherits the surrounding font-family
 *  (the landing's end-of-article store link). */
 | 'pill';
type CtaOwnProps = {
    size?: CtaSize;
    /** Flip to fg-on-bg (the "ondark" cream-on-plum treatment in dark theme). */
    inverse?: boolean;
};
/** A CTA that navigates: pass `href` and it renders a real <a>. */
type CtaLinkProps = CtaOwnProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
};
/** A CTA that acts: no `href`, renders a <button>. */
type CtaButtonProps = CtaOwnProps & ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
};
type CtaProps = CtaLinkProps | CtaButtonProps;
/** The landing's editorial serif-italic CTA.
 *
 *  Renders an `<a>` when given an `href` and a `<button>` otherwise — a CTA that
 *  navigates must stay a real link, or it drops out of the crawlable link graph
 *  and loses middle-click, ⌘-click and the "link" role for assistive tech. The
 *  `.oro-cta` base already sets `text-decoration: none` and `inline-flex`, so
 *  both elements render identically.
 *
 *  Import '@oro/web/styles.css' once per app. */
declare function Cta(props: CtaProps): react.JSX.Element;

/** quiet = modal done · accent = gold fill (cookie accept) · ghost = outline on dark. */
type BtnVariant = 'quiet' | 'accent' | 'ghost';
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: BtnVariant;
};
/** Quiet in-flow utility button. The landing originals used tiny uppercase
 *  tracked labels; they are lowercase and untracked here per the brand rule
 *  (see build-css.mjs). Everything else is transcribed 1:1 — pixels canonical. */
declare function Btn({ variant, className, type, ...rest }: BtnProps): react.JSX.Element;

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    /** default: serif editorial chip (contact). pill: sans full-radius (get-started). */
    pill?: boolean;
    selected?: boolean;
};
/** Selection chip. Selection is conveyed via aria-pressed (which also drives
 *  the selected styling). */
declare function Chip({ pill, selected, className, type, ...rest }: ChipProps): react.JSX.Element;

export { Btn, type BtnProps, type BtnVariant, Chip, type ChipProps, Cta, type CtaProps, type CtaSize };
