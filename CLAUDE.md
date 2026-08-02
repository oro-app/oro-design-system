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
  @oro/tokens. Complete: `Button`, `Pill`, `Icon`, `BackButton`, `Dropdown`,
  `LoadErrorState`, plus the motion primitives `FadeUpSection`,
  `PressSpringPressable`, `SkeletonBlock`, `SlideUpSheet` (and
  `useReducedMotion`). Two tsup builds from one source tree: `dist/` (native)
  and `dist/web/` (reached via the `browser` exports condition, so web
  consumers never pull in `@expo/vector-icons`).
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
pnpm build          # all three packages (tsup → esm+cjs+dts); @oro/web also
                    # regenerates dist/oro-web.css via scripts/build-css.mjs
pnpm storybook      # dev gallery at localhost:6006
pnpm build-storybook
pnpm -r typecheck   # run AFTER pnpm build — see Testing & CI
pnpm lint           # eslint . (flat config, repo root)

pnpm test:interactions   # Storybook play functions vs the built storybook-static
pnpm test:visual         # Playwright screenshots vs baselines — FAILS on macOS by
                         # design, see Testing & CI before you trust the result
pnpm test:visual:update  # regenerate baselines in the Playwright Docker image
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

## Testing & CI

`.github/workflows/ci.yml` runs on **every PR** (including stacked ones whose
base isn't `main`) and on pushes to `main`, in this order:

```
pnpm lint → pnpm build → pnpm -r typecheck → pnpm build-storybook
          → pnpm test:interactions → pnpm test:visual
```

- **Build precedes typecheck on purpose.** @oro/ui's `tsc --noEmit` resolves
  `@oro/tokens` from its *built* `dist` types — typechecking a clean tree
  without building first fails on unresolved imports.
- **Interaction tests** (`@storybook/test-runner`) execute story `play`
  functions against the built `storybook-static`, served on port 6006.
- **Visual regression** (Playwright, `tests/visual/stories.spec.ts`) takes one
  screenshot per story and diffs it against `tests/visual/__screenshots__/`.
  Tolerance is tight (`maxDiffPixels: 64`) and stories render with
  `reducedMotion: 'reduce'` so motion primitives sit at their resting state.

### The visual-baseline gotcha (read this before changing a component)

Baselines are **Linux renders** — CI runs Ubuntu, and font rasterization differs
per OS. A bare `pnpm test:visual` on macOS **fails on antialiasing, and that is
expected**; it is not a regression you introduced. Trust CI or the Docker run.

Any change that alters rendered output — a component, a token value, a story —
invalidates the baselines. Regenerate and commit them:

```bash
pnpm build && pnpm build-storybook
pnpm test:visual:update      # runs --update-snapshots in the Playwright image
git add tests/visual/__screenshots__
```

A **new story** fails CI with "snapshot doesn't exist" — same fix. Review
baseline diffs like code: the PR diff for `__screenshots__/` *is* the visual
review. Full detail in `tests/visual/README.md`.

## Releasing / how consumers install

There is no npm registry. `.github/workflows/release.yml` runs on every push to
`main`: it builds, `pnpm pack`s each package (the exact publish layout, `dist`
only), strips `scripts` + `devDependencies` from the manifest, and **force-pushes
the contents to an orphan `release/<pkg>` branch**. Consumers install those as
git dependencies — works for npm and pnpm alike, no auth beyond GitHub access:

```bash
npm install github:oro-app/oro-design-system#release/tokens
pnpm add github:oro-app/oro-design-system#release/ui     # @oro/tokens is a peer dep
pnpm add github:oro-app/oro-design-system#release/web    # + import '@oro/web/styles.css'
```

`release/tokens`, `release/ui`, and `release/web` are **build artifacts** —
never edit them, never branch from them, never open a PR against them. To ship a
change, merge to `main`; to pick it up, re-run the install in the consumer.

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

## Current state

The library itself is done and shipping:

- **Full token layer** (color, typography, spacing, radii, elevation, motion) +
  the Tailwind preset. Palette trimmed (lilac and warning/amber cut).
- **@oro/ui complete** — `Button` (emphasis×prominence + hover + icon slot),
  `Pill`, `Icon` (native/web split), `BackButton`, `Dropdown` (Option A spec),
  `LoadErrorState`, and all four motion primitives.
- **@oro/web** — the landing's editorial CTA family (`Cta` with the
  compact/standard/statement/hero/full/block/inline sizes), `Btn`, `Chip`.
- **CI green** on every PR: lint, build, typecheck, storybook, interaction
  tests, and visual regression with committed baselines.
- **Release branches live** — `release/{tokens,ui,web}` publish on every push
  to `main`.

**Neither consumer is wired up yet.** That's the whole of the remaining work.

## Roadmap / next tasks (rough priority)

1. **Wire the landing** (`oro-landing`) to `@oro/tokens/tailwind` + `@oro/web` —
   lowest-risk first consumer; kills the current color drift (landing is on a
   stale palette). @oro/web exists so this is a componentization, not a
   restyle — see the landing pixel rule below.
2. **Wire the app** (`oro-mobile-refresh`) to consume @oro/ui + @oro/tokens,
   replacing its local `src/lib/style` + `src/components/base` + `/motion`.
   Those local copies have already drifted from the system — at last check the
   app's theme still carried the cut lilac `tertiary` (`#CCB7E3`) and its local
   `Dropdown` still used `textTransform: 'uppercase'` + a `widest` tracking step
   that no longer exists in @oro/tokens. Expect to fix drift, not just swap
   imports. That repo is docs-first: read its `AGENTS.md` + `docs/README.md`
   and update the owning doc before the code.
   - **Dropdown spec, for reference (Option A):** quiet muted label (Inter
     Medium, `textSubtle`), value carries the focus, soft rectangle `radii.lg`,
     balanced padding — NOT full-pill, NOT a bold label.
3. **Figma Code Connect** to link Figma components ↔ code files. Blocked on
   Figma-side work first — see the gotcha below.
4. **Chromatic** (hosted visual review) if the committed-baseline workflow
   starts to chafe as the component count grows. Not needed yet.

## Landing pixel rule (hard-learned)

A full @oro/ui restyle of the landing shipped and was reverted (OroLanding
#29/#30): Sunny wants the landing's existing look preserved exactly —
componentize beneath the same appearance, never restyle. Before merging any
visually-altering PR on a prod surface, post before/after screenshots and get
explicit sign-off. @oro/web exists precisely for this: same pixels, reusable.

## Gotchas (hard-won)

- `@expo/vector-icons` on web → use the platform-split pattern (see Icon).
- Storybook stubs nothing now; it consumes `packages/*/src` directly via alias.
- **`pnpm test:visual` failing locally on macOS is expected**, not a regression —
  baselines are Linux renders. See Testing & CI.
- **The Figma mirror is drawn with plain frames, not Figma components**
  (`get_metadata` on the file shows frames named "Button block", "Dropdown
  block", …). Code Connect maps *components*, so the Code Connect roadmap item
  needs the mirror converted to real components/component-sets in Figma first —
  it isn't a five-minute wiring task.
- **@oro/web's CSS is generated.** Editing `packages/web/src/*.tsx` changes
  markup and class names only; every pixel lives in
  `packages/web/scripts/build-css.mjs` and lands in `dist/oro-web.css` at build
  time. Change the script, not the emitted CSS.
- `tertiary` appears as a Button *variant* name — that's emphasis, not the
  (removed) lilac color.
- Device bridge can't write to `.claude/` and can't delete files.
- Related repos live as siblings in `oro-workspace/`: `oro-mobile-refresh`
  (the app rebuild; has a detailed `docs/styleGuide.md`), `oro-landing`
  (React+Vite+Tailwind marketing site).
