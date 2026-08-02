---
name: oro-ds-sync
description: >-
  Mirror design changes from the Oro Figma file into the oro-design-system code
  repo (@oro/tokens / @oro/ui) — exactly the Figma diff and nothing else.
  Trigger whenever someone wants Figma changes reflected in code: "sync the
  design system", "reflect the figma change(s)", "update tokens from figma",
  "figma to code", or when they name a token or component they just edited in
  Figma. Handles one change or many in a run.
---

# oro-ds-sync

Port the change(s) from the Figma design system into the code repo, verify, and
commit. Figma is where the visual call is made; this repo is the source of truth
the apps consume. The whole job: make the code match what changed in Figma, and
change nothing else — an unrelated edit makes the diff unreviewable and can hide
a regression.

## Locate first

- **Figma file key:** `jzE8brxOY3ROealoAO3ERN`. This is a cloud id, so it works
  from any machine — as long as the person has access to that Figma file and the
  Figma connector. If `get_variable_defs`/read calls fail, that access is
  missing; say so instead of guessing values.
- **Repo:** find the `oro-design-system` folder in the workspace (the one with
  `pnpm-workspace.yaml`). Don't assume an absolute path — it's wherever this
  person cloned it.

## Steps

1. **Get the delta.** If the person named the change, use it. Otherwise call
   `get_variable_defs` on the file and diff each value against the matching
   `packages/tokens/src/*` file — every variable whose value differs is a change.
   For a component, read the node (`get_design_context` / `get_screenshot`) and
   compare to its file. List every change before editing.
2. **Edit only the mapped file(s)** (map below). No reformatting, reordering, or
   drive-by fixes.
3. **Verify:** `pnpm -r --filter "./packages/**" build`. If a component changed,
   also `pnpm --filter @oro/storybook build-storybook`.
4. **`git diff`** and confirm it matches the Figma change(s) and nothing more.
5. **Open a PR — don't commit to `main`.** The change should be reviewable.
   - **Where git has network + auth** (the user's own terminal, or Cowork running
     *on their computer* with `gh` signed in): branch, commit, push, PR:
     ```bash
     git checkout -b sync/<short-desc>
     git add -A && git commit -m "<scoped message>"   # e.g. tokens: sync 4 color edits from figma
     git push -u origin sync/<short-desc>
     gh pr create --fill --body "Mirrors Figma change: <what changed>. Figma file jzE8brxOY3ROealoAO3ERN."
     ```
   - **Where git can't reach the network or `.git` is sandbox-restricted** (a cloud
     session over the device bridge — the common case): do NOT run git. You've
     already written the files to disk; output the exact branch→commit→push→
     `gh pr create` block above for the user to run in their own terminal, and
     tell them plainly that you can't push/PR from here.

## Figma → code map

| Figma | Code |
| --- | --- |
| `palette/*` variable | `packages/tokens/src/colors.ts` (`palette` object) |
| `color/*` semantic | `colors.ts` (`colors` object; alphas via `withAlpha`) |
| text style / type scale | `typography.ts` |
| `spacing/*` · `radius/*` · elevation · motion | `spacing.ts` · `radii.ts` · `elevation.ts` · `motion.ts` |
| component variant / size / state / padding | `packages/ui/src/<Component>/<Component>.tsx` |
| anything the web landing consumes | also `tailwind.ts` |

## Guardrails

- **Scope = the Figma diff** — same procedure whether it's 1 change or 5.
- **Alpha colors:** if a Figma color is an alpha of a primitive, write
  `withAlpha(base, 'XX')`, not a raw hex — keeps one source per hue.
- **Editing over the device bridge:** write changed files back with
  `device_commit_files` (force) — an unwritten file never reaches the user.
  `.claude/` is write-blocked over the bridge; don't target it. And the bridge
  has no git network/auth, so never try to push or `gh pr create` from it — the
  sandbox also mangles `.git` locks. Hand the commands to the user instead.
- **Stop at this repo.** Do not edit `oro-mobile-refresh` or `oro-landing` —
  propagating to the apps is a separate consumer-side step (see the repo README).
