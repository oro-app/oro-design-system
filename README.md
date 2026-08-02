# oro design system

the single source of truth for oro's visual language, in code. pnpm monorepo, two packages + a storybook.

figma (design mirror): https://www.figma.com/design/jzE8brxOY3ROealoAO3ERN

## packages

| package | what it is |
| --- | --- |
| `@oro/tokens` | platform-neutral design tokens — color, typography, spacing, radii, elevation, motion. mirrors `oro-mobile-refresh/src/lib/style`. also ships a Tailwind preset (`@oro/tokens/tailwind`) for the landing. |
| `@oro/ui` | react native component library. consumes `@oro/tokens`. currently: `Button`, `Pill`, `Icon`. roadmap: `BackButton`, `Dropdown`, `LoadErrorState`, motion primitives. |
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

## editing the design system (figma → code)

The flow for changing anything visual: **edit in Figma, then have Claude mirror it into this repo.**

1. Make your change in the [Figma file](https://www.figma.com/design/jzE8brxOY3ROealoAO3ERN) — a color, spacing, a component's padding, whatever. One change or several.
2. In a Cowork session (with the Figma connector + this folder connected), say **"sync the design system"** (or name what you changed).
3. Claude runs the **`oro-ds-sync`** skill: it reads the exact new value(s) from Figma, applies *only* those changes to the matching files here (`packages/tokens/src/*` for values, `packages/ui/src/*` for components), runs the build to verify, shows the diff, and **opens a PR** (branch → commit → push → PR) so `main` stays reviewed. Running from a cloud session, it writes the changes to disk and hands you the push/PR commands to run in your terminal — pushing needs your local git auth, which the cloud bridge doesn't have.

The skill ships with this repo at `skills/oro-ds-sync/SKILL.md` (version-controlled, so it travels to anyone who clones). To make Claude auto-discover it in this repo, activate it once locally:

```bash
mkdir -p .claude/skills/oro-ds-sync && cp skills/oro-ds-sync/SKILL.md .claude/skills/oro-ds-sync/
```

(Or save the `.skill` file to your Claude account to use it in any session.) It works for one change or a batch, and it carries the Figma file key + the Figma→code map so it doesn't have to rediscover anything. Figma is where decisions are made; **code stays the source of truth.**

### does this update the app / landing too?

No — not by itself. This skill stops at the design-system repo. A change reaches `oro-mobile-refresh` / `oro-landing` only once they **consume these packages** and you **bump the version + `pnpm update`** in each (a command, not hand-edits) — non-breaking value/component changes then flow with no code changes in the consumers. Breaking changes (renamed prop, removed variant) still need edits at each call site. Until the apps are wired to the packages, changes stay here.

## principles

- editorial, warm, restrained. lowercase copy. square-cornered plum hero CTAs. one italic-plum accent word per headline.
- no hardcoded hex / font names / sizes in consumers — always import from `@oro/tokens`.
- fraunces (serif) for statements + hero CTA; inter (sans) for body, labels, in-flow buttons.

## note on fraunces

figma's static fraunces has no `Medium` cut, so the design mirror shows `frauncesMedium`/`MediumItalic` as SemiBold. the app renders true Medium via the variable font — the token names (`fonts.frauncesMedium`) remain correct in code.
