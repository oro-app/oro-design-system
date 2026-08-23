# CLAUDE.md — oro-design-system

Context for Claude Code sessions in this repo. Read before editing.

## What this is

The single source of truth for Oro's visual language, **in code**. A pnpm
monorepo with two publishable packages + a Storybook. Oro is an AI personal-
styling mobile app (React Native / Expo); this design system feeds the mobile
app (`oro-mobile-refresh`) and the marketing landing (`oro-landing`).

- `packages/tokens` → **@oro/tokens** — platform-neutral design tokens (color,
  typography, spacing, radii, elevation, motion). Zero runtime deps. Also ships a
  Tailwind preset at `@oro/tokens/tailwind` for the web landing. **Three tiers,
  one-way flow** — see "Token tiers" below.
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

## Code comments

Invoke the `writing-code-comments` skill before adding or editing any comment.

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
  It runs as a **separate `visual` job pinned to the Playwright container** —
  the same image `pnpm test:visual:update` uses. Generating baselines in one
  font environment and verifying them in another silently drifts text by a
  pixel per row; don't un-pin it.

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

## Token tiers (the load-bearing structure)

`@oro/tokens` flows **one way: primitive → semantic → component.** Consume the
highest tier that answers your question and never reach past it.

| tier | file | holds | who imports it |
|---|---|---|---|
| 1 primitive | `primitives.ts` | brand hexes + 50–900 ramps | **nobody outside the package** |
| 2 semantic | `semantic.ts` | roles (`surface*`, `text*`, `action*`…) per mode | components |
| 3 component | `components.ts` | per-component values + size tables | components |

`colors.ts` is the pre-tier flat API, kept as a **deprecated shim** over
`semantic.light` so older imports still resolve. Don't add to it.

An eslint `no-restricted-imports` rule enforces the flow — `@oro/ui` and
`@oro/web` cannot import `palette` / `ramps` / `primitives`. A component that
reads `ramps.plum[600]` has hardcoded a value that can no longer be themed. The
helpers (`mix`, `withAlpha`, `shiftLightness`) stay available; it's the *values*
that are off-limits.

### Ramps: derive, never hand-write

Ramps are generated by `ramp(base, baseStep)`, which interpolates in **OKLab**
toward `paper` (tints) and a 15%-hue-retaining ink (shades). Two rules:

- **Never paste a hex into a ramp.** "One plum, one gold, one rose" is true only
  because every step is computed from the base.
- **`shiftLightness()` cannot build ramps** — it scales HSL lightness, which
  clips gold (L=58%) and rose (L=48%) to pure white before the light end. It is
  retained *only* for the baked brand-gradient stops.

Base hexes are pinned exactly at their natural step (plum 800, gold 400, rose
500), so ramps are generated *around* the brand color, never over it.

**Ramp anchors carry the warmth.** The neutral ramp is anchored at
ink→**cream**, not ink→paper: `paper` is only C* 5.4 itself, so halving it
against ink left a base at C* 3.2 and the scale was grey before a step was
derived — which is why the landing hand-picked `#5A554D` for editorial type.
Re-anchoring is a one-line base change, not a change to `ramp()`. Do NOT try to
warm a ramp by raising `HUE_RETENTION`: it is shared with plum/gold/rose (so it
would move `ramps.plum`, which the landing renders), and it measurably does not
work — at 0.45 the neutral 600 goes C* 2.74 → 2.69. You cannot retain warmth
downstream that the base never had.

**Need a brand color legible on a given ground? Use `contrastShift()`, not a
ramp step.** Ramps mix toward near-achromatic anchors, so they shed chroma on
the way down — gold[600] clears 4.27:1 on paper and reads brown (C* 33.9 vs the
base gold's 49.7). `contrastShift(base, { on, minContrast, chromaFactor })`
holds the hue, clamps chroma to the sRGB cusp, and solves lightness for a WCAG
ratio; `semantic.light.accentText` is derived that way. `chromaFactor > 1`
amplifies toward the cusp, which is what an on-dark accent needs. It is a
helper for *roles* — never write its output into a ramp.

### `tone`: how components theme

Components take `tone="light" | "onDark"` and resolve their colors through
`forMode()` / `componentsForMode()`. There is no theme context and no
`*OnDark` one-off tokens — `semantic.dark` implements the same type as
`semantic.light`, so a component flips wholesale.

Both modes solve their accent independently: `light.accent`/`accentText` is a
darkened gold for paper, `dark.accent`/`accentText` a chroma-*amplified* gold
for plum (`contrastShift(..., { chromaFactor: 1.3 })`). On a dark ground the eye
wants more chroma, not the same value dimmed — and no ramp step gets there,
because lightness interpolation sheds chroma. That is the one derivation gap
behind four separate hand-picked hexes on the landing.

**Editorial type has its own roles: `textEditorial` / `textEditorialMuted`.**
`text` is `ink` — achromatic, and it reads cold against cream-and-plum surfaces,
which is why the landing kept inventing warm greys at the call site.

**They are solved, not ramp steps — and the reason is worth reading before you
"simplify" them back.** The obvious implementation is `neutral[900]` /
`neutral[600]`, on the argument that no contrast requirement is at risk here so
nothing needs solving. But the requirement these roles carry is not contrast,
it is **warmth**, and the ramp cannot deliver it at the dark end:
`neutral[900]` measures **C\* 1.5** — effectively achromatic — however the ramp
is anchored. Taking it gives the role its name without the property it exists
for.

| role | ramp step | solved | landing ships |
|---|---|---|---|
| `textEditorial` | `#21201E` C\* 1.5 | **`#25211C`** C\* 4.2 | `#25211c` C\* 4.2 |
| `textEditorialMuted` | `#625D54` C\* 5.9 | **`#59554D`** C\* 5.2 | `#5a554d` C\* 5.4 |

ΔE76 from the shipped values: **2.77 → 0.00** and **3.35 → 0.46**. So adopting
these downstream is a token swap; the ramp steps would have been a visible
restyle of the most-read type on the site.

**The two anchor differently, deliberately.** The near-black mixes toward cream
carried 56% toward gold (cream alone lands C\* 2.2, too cool; gold alone C\* 6.4,
visibly brown); the muted register mixes toward plain cream, or it goes olive. A
single shared anchor was searched for — the best compromise leaves the body at
C\* 2.4, giving up the warmth again. `semantic.test.ts` pins both hexes and
asserts their chroma stays clear of `neutral[900]`, so a future refactor can't
quietly swap them back to steps.

On dark they mirror `text`/`textMuted` rather than reaching for a light ramp
step — against plum the warmth comes from `paper`, and `neutral[100]` measures
flatter and greyer there. The roles exist in both modes so a component can flip
wholesale.

`tone` can change **treatment, not just color**, where the material demands it:
a Pill's resting state is filled on light but an outline on dark (a white chip
on plum reads as a card); `BackButton` swaps its shadow for a hairline border
(a shadow can't separate two dark surfaces). Pass `semantic.dark.shadow` to
`resolveElevation()` on dark — the light plum shadow reads as a glow.

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

Orthogonal axes — each answers a different question:
- **variant = emphasis:** `primary` (one per screen) · `secondary` (the
  alternative beside it) · `tertiary` (ghost, escape hatches) · `danger`.
- **prominence = shape/scale:** `standard` (rounded `radii.lg`, Inter label —
  everyday in-flow) · `hero` (square `radii.none`, Fraunces label, 58pt, heavy
  shadow — pivotal full-screen moments only: welcome/onboarding/paywall;
  primary-only).
- **size:** `sm` 44 · `md` 52 (default) · `lg` 60.
- **content:** `text` · `iconText` · `iconOnly`, with `icon` + `iconPosition`.
- **tone:** `light` · `onDark`.
- **states:** default / hover (web-only, react-native-web) / pressed (opacity
  0.85) / disabled.

**`hero` ignores `size`** — and this is the point of keeping them separate. Hero
is a brand *moment*, not the top of a scale; folding it into `size="xl"` would
make it something you reach for by accident.

**`iconOnly` still requires `label`.** It becomes the accessibility label and
the button renders a square hit target, so an icon button can neither ship
unlabelled nor shrink to the glyph.

Pill label 13px (md) / 12px (sm), standard Button label 13/14/16px by size,
hero 19px (Fraunces).

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

- **Three-tier token layer** (primitive → semantic → component) with derived
  50–900 ramps for plum, gold, rose and a warm neutral, plus light/dark
  semantic modes and the Tailwind preset. Palette still deliberately tight —
  ramps only, no new hues (lilac and warning/amber stay cut).
- **@oro/ui complete and fully parameterized** — `Button`
  (variant × prominence × size × content, + `tone`), `Pill` (tone, size,
  disabled, icon slots), `Icon` (native/web split), `BackButton`, `Dropdown`
  (Option A spec), `LoadErrorState` — all tone-aware — and all four motion
  primitives.
- **@oro/web** — the landing's editorial CTA family (`Cta` with the
  compact/standard/statement/hero/full/block/inline sizes), `Btn`, `Chip`.
- **CI green** on every PR: lint, build, typecheck, storybook, interaction
  tests, and visual regression with committed baselines.
- **Release branches live** — `release/{tokens,ui,web}` publish on every push
  to `main`.

**Consumer status (verified, not assumed):**

- **`oro-landing` is already wired** — it installs all three packages from the
  `release/*` branches, uses `oroPreset` in `tailwind.config.js`, imports
  `@oro/web/styles.css`, renders `Cta` from `@oro/web` in 8 files, and generates
  `src/generated/tokens.css` from `@oro/tokens` via `scripts/generate-tokens.mjs`.
  It is **not finished**: ~44 hardcoded hexes remain in component CSS, and
  several files still define their own cta/button recipes.
  **It is also pinned to a pre-tier build** — the installed `@oro/tokens`
  exports no `ramps` and no `semantic`. Git dependencies do not auto-update, so
  the landing sees none of the ramp/mode work until someone re-runs the install
  and re-runs `gen:tokens`.
- **`oro-mobile-refresh` is not wired at all** and still carries its own
  divergent copies.

## Roadmap / next tasks (rough priority)

1. **Finish the landing migration** — it is wired but not complete. Two
   distinct jobs, and the first is cheap:
   - **Bump it onto the current packages.** `release/*` updates on every push to
     `main`, but git deps don't auto-update, so the landing is still on a
     pre-tier build with no ramps and no semantic modes. Re-install, re-run
     `npm run gen:tokens`, and diff the generated CSS before shipping.
   - **Retire the ~44 remaining hardcoded hexes** and the leftover local
     cta/button recipes, moving them onto tokens / `@oro/web`. @oro/web exists
     so this is a componentization, not a restyle — see the landing pixel rule.
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
3. **Chromatic** (hosted visual review) if the committed-baseline workflow
   starts to chafe as the component count grows. Not needed yet.

**Figma Code Connect is NOT on the roadmap — do not propose it.** It requires a
Dev or Full seat on a Figma **Organization or Enterprise** plan, and we are not
upgrading. This is a licensing wall, not an effort problem: the API refuses
outright, so no amount of scaffolding gets round it. Nothing is missing on our
side — the `components` section already has real published component sets
(`Style=Primary, State=Default` and friends), so it *would* be wiring rather
than a rebuild if the plan allowed it.

**The alternative we use instead is the `oro-ds-sync` skill** (`skills/
oro-ds-sync/`) — edit in Figma, say "sync the design system", and Claude reads
the exact Figma values and applies them to the matching file. That covers the
same need (Figma ↔ code staying in step) with no plan upgrade and no generated
mapping files to maintain. See "The edit workflow" above.

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
- **The Figma mirror mixes real components with documentation frames.** The
  `components` section holds genuine `COMPONENT_SET`s with variant properties
  (`Button` alone has 20 variants: Style × State). The token sections — color,
  typography, spacing, radius, elevation, motion — are plain documentation
  frames, and so are the newer axis/mode demo blocks. Only the component sets
  are Code-Connect-mappable; don't assume a named block is a component without
  checking its `type`.
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
