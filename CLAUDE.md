# CLAUDE.md — oro-design-system

Context for Claude Code sessions in this repo. Read before editing.

## What this is

The single source of truth for Oro's visual language, **in code**. A pnpm
monorepo with two publishable packages + a Storybook. Oro is an AI personal-
styling mobile app (React Native / Expo); this design system feeds the mobile
app (`oro-mobile-refresh`) and the marketing landing (`oro-landing`).

- `packages/tokens` → **@oro/tokens** — platform-neutral design tokens (color,
  typography, spacing, radii, elevation, motion). Zero runtime deps. Also ships a
  Tailwind preset at `@oro/tokens/tailwind` for the web landing.
- `packages/ui` → **@oro/ui** — React Native component library, consumes
  @oro/tokens. Built: `Button`, `Pill`, `Icon`. Not yet built: `BackButton`,
  `Dropdown`, `LoadErrorState`, motion primitives.
- `packages/web` → **@oro/web** — web-native React components + generated CSS
  for the landing's editorial patterns (`Cta`, `Btn`, `Chip`). **The landing's
  shipped pixels are canonical** — recipes are transcribed 1:1 from oro-landing
  CSS (values flow from @oro/tokens via `scripts/build-css.mjs`); do NOT
  restyle them to match the RN components. Plain `<button>`s, no
  react-native-web. Consumers import `@oro/web/styles.css` once.
- `apps/storybook` → **@oro/storybook** — react-native-web Storybook. The
  browsable gallery; renders @oro/ui (and @oro/web) in a browser.

**Code is canonical. Figma is the design mirror**, not the source of truth.
Figma file: `https://www.figma.com/design/jzE8brxOY3ROealoAO3ERN` (key
`jzE8brxOY3ROealoAO3ERN`).

## Commands

```bash
pnpm install
pnpm build          # builds @oro/tokens then @oro/ui (tsup → esm+cjs+dts)
pnpm storybook      # dev gallery at localhost:6006
pnpm build-storybook
pnpm -r typecheck
```

Node ≥20, pnpm 10. Always `pnpm`, never `npm`.

## Architecture / how the pieces fit

- **Tokens are shared; components are not.** Native and web can't share component
  code (RN `View/Text` vs web HTML), so the model is: one shared token layer,
  components reimplemented per platform. Tokens = the "what" (values), components
  = the "how it renders."
- **@oro/tokens** is pure TS. `colors.ts` uses `withAlpha(hex, 'XX')` for alpha
  variants and `shiftLightness()` to derive the dark brand-moment ramp from plum.
  `elevation.ts` exports platform-neutral shadow presets; **@oro/ui**'s
  `resolveElevation()` turns them into RN shadow styles.
- **Icon is platform-split**: `Icon.tsx` (native, `@expo/vector-icons` Feather)
  + `Icon.web.tsx` (web, `react-feather` — same glyphs as SVG). This exists
  because `@expo/vector-icons` drags Flow-typed RN packages that break a plain
  Vite/web build. Storybook resolves `.web` automatically. **Follow this pattern
  for any component that needs a native-only dependency.**
- **Storybook consumes the packages from SOURCE** (aliased in
  `.storybook/main.ts` to `packages/*/src`), and aliases `react-native` →
  `react-native-web`. So edits show without a package rebuild, and `.web` files
  resolve.

## Brand / design conventions (non-negotiable)

- **Voice/visual:** editorial, warm, restrained, magazine-like. **All lowercase**
  everywhere (headings, buttons, labels). One **italic-plum accent word** per
  hero headline (Fraunces MediumItalic → SemiBold Italic in Figma).
- **NO all-caps + wide letter-spacing. Anywhere, in any package.** No uppercase
  labels, no `text-transform: uppercase`, no tracked-out eyebrows — not in
  @oro/ui, not in @oro/web, not in Storybook stories, not in the Figma mirror.
  The wide `letterSpacing` steps were deleted from @oro/tokens so they can't be
  reintroduced (only `tight`/`normal`/`wide` remain, `wide` being a 0.4 optical
  nudge). If a transcribed-from-a-consumer recipe contains uppercase + tracking,
  fix it rather than mirroring it — this rule outranks pixel fidelity.
- **Type:** Fraunces (serif) for headlines, statements, hero CTA; Inter (sans)
  for body, labels, in-flow buttons. Fraunces has no static `Medium` cut in
  Figma, so `frauncesMedium`/`MediumItalic` render as SemiBold in the mirror; the
  app uses the true variable-font Medium — token names stay correct.
- **Palette (deliberately tight — do not add hues without discussion):**
  plum `#3A2646` (brand, does ~90% of the work), gold `#D4A853` (single accent),
  rose `#A84E5C` (danger), warm neutrals cream `#FFF2D7` / paper `#FFF9ED` /
  white `#FFFDF8` / ink `#0B0B0B`. **Lilac and warning/amber were cut** (unused /
  too close to gold) — don't re-add a warning color speculatively; pick one in
  context if a real caution state appears.
- **Radii by context:** hero CTA `none` (square is on-brand), standard buttons
  `lg`, inputs `md`, cards/sheets `lg`–`xl`, pills/chips full.
- **Elevation:** plum-tinted shadows only (never black), `low`→`floating`.
- **Hover/focus (web surfaces only):** hover must be *perceptible* — one clear
  lightness step (`primaryActionHover` on light surfaces,
  `primaryActionHoverOnDark` on plum/dark; `hoverTint` for ghost/secondary) plus
  an optional subtle lift. Keyboard focus uses a 2px `focusRing` (gold alpha)
  ring via `:focus-visible` — never suppress outlines without replacing them.
- **Never hardcode** hex / font names / sizes / spacing in consumers — import
  from @oro/tokens.

## Button model (the important one)

Two orthogonal axes:
- **variant = emphasis:** `primary` (one per screen) · `secondary` (the
  alternative beside it) · `tertiary` (ghost, escape hatches) · `danger`.
- **prominence = shape/scale:** `standard` (rounded `radii.lg`, Inter label,
  52pt — everyday in-flow) · `hero` (square `radii.none`, Fraunces label, 58pt,
  heavy shadow — pivotal full-screen moments only: welcome/onboarding/paywall;
  primary-only).
- **states:** default / hover (web-only, react-native-web) / pressed (opacity
  0.85) / disabled. `leadingIcon` slot takes an `@oro/ui` Icon.

Pill label 13px, standard Button label 14px, hero 19px (Fraunces).

## The edit workflow

Edit in Figma → in a Cowork/Claude session say **"sync the design system"** →
the **`oro-ds-sync`** skill (in `skills/oro-ds-sync/`) reads the exact Figma
value(s), applies only that change to the matching file, builds, and opens a PR.
Design decisions are made in Figma; code stays canonical.

**Git rule:** only run git from a real terminal (or Cowork "on your computer") —
**never through the device bridge** (no network/auth, and it corrupts `.git`
locks). Changes to `main` go via PR, not direct commits.

## Current state (as of handoff)

Built and verified (tokens + ui + storybook all build clean): full token layer,
`Button` (emphasis×prominence + hover + icon slot), `Pill`, `Icon`
(native/web). Palette trimmed. Pushed to `main`.

## Roadmap / next tasks (rough priority)

1. **Port remaining components into @oro/ui** from `oro-mobile-refresh/src/
   components/base` + `/motion`: `BackButton`, `Dropdown`, `LoadErrorState`,
   `FadeUpSection`, `PressSpringPressable`, `SkeletonBlock`, `SlideUpSheet`.
   - **Dropdown spec is decided (Option A):** quiet muted label (Inter Medium,
     `textSubtle`), value focus, soft rectangle `radii.lg`, balanced padding —
     NOT full-pill, NOT a bold label. Match the updated Figma `Dropdown`.
2. **Wire the landing** (`oro-landing`) to `@oro/tokens/tailwind` — lowest-risk
   first consumer; kills the current color drift (landing is on a stale palette).
3. **Wire the app** (`oro-mobile-refresh`) to consume @oro/ui + @oro/tokens
   (replace its local `src/lib/style` + `src/components/base`).
4. **Publish** the packages (private npm or git dep) so consumers can install.
5. **CI** (GitHub Actions): typecheck + lint + build + build-storybook on PRs.
   Add Chromatic (visual regression) when component count grows.
6. **Figma Code Connect** to link Figma components ↔ code files.

## Landing pixel rule (hard-learned)

A full @oro/ui restyle of the landing shipped and was reverted (OroLanding
#29/#30): Sunny wants the landing's existing look preserved exactly —
componentize beneath the same appearance, never restyle. Before merging any
visually-altering PR on a prod surface, post before/after screenshots and get
explicit sign-off. @oro/web exists precisely for this: same pixels, reusable.

## Gotchas (hard-won)

- `@expo/vector-icons` on web → use the platform-split pattern (see Icon).
- Storybook stubs nothing now; it consumes `packages/*/src` directly via alias.
- `tertiary` appears as a Button *variant* name — that's emphasis, not the
  (removed) lilac color.
- Device bridge can't write to `.claude/` and can't delete files.
- Related repos live as siblings in `oro-workspace/`: `oro-mobile-refresh`
  (the app rebuild; has a detailed `docs/styleGuide.md`), `oro-landing`
  (React+Vite+Tailwind marketing site).
