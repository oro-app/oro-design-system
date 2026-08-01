# oro design system

the single source of truth for oro's visual language, in code. pnpm monorepo, two packages + a storybook.

figma (design mirror): https://www.figma.com/design/jzE8brxOY3ROealoAO3ERN

## packages

| package | what it is |
| --- | --- |
| `@oro/tokens` | platform-neutral design tokens — color, typography, spacing, radii, elevation, motion. mirrors `oro-mobile-refresh/src/lib/style`. also ships a Tailwind preset (`@oro/tokens/tailwind`) for the landing. |
| `@oro/ui` | react native component library. consumes `@oro/tokens`. currently: `Button`, `Pill`. roadmap: `BackButton`, `Dropdown`, `LoadErrorState`, motion primitives. |
| `apps/storybook` | react-native-web storybook — browsable, shareable component gallery. the source of truth is code; this renders it. |

## setup

```bash
pnpm install
pnpm build          # builds @oro/tokens then @oro/ui
pnpm storybook      # runs storybook at http://localhost:6006
```

## how the pieces fit

- **code is canonical.** tokens live here as TypeScript. change a value here → rebuild → both the app and the landing pick it up.
- **the app** (`oro-mobile-refresh`) consumes `@oro/ui` (and `@oro/tokens`) once this is published / linked.
- **the landing** (`oro-landing`) consumes `@oro/tokens/tailwind` so web + native stay on one palette.
- **figma** is the design mirror. keep it in sync via Figma Code Connect (https://www.figma.com/design/jzE8brxOY3ROealoAO3ERN/Oro-Design-System?node-id=10-2&t=viroIYw7ojGTgdWY-1).

## principles

- editorial, warm, restrained. lowercase copy. square-cornered plum hero CTAs. one italic-plum accent word per headline.
- no hardcoded hex / font names / sizes in consumers — always import from `@oro/tokens`.
- fraunces (serif) for statements + hero CTA; inter (sans) for body, labels, in-flow buttons.

## note on fraunces

figma's static fraunces has no `Medium` cut, so the design mirror shows `frauncesMedium`/`MediumItalic` as SemiBold. the app renders true Medium via the variable font — the token names (`fonts.frauncesMedium`) remain correct in code.
