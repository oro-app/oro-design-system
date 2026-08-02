# visual regression

One Playwright screenshot per story, diffed against the baselines in
`__screenshots__/`. Baselines are **Linux renders** (CI runs Ubuntu; font
rasterization differs per OS), so update them inside the Playwright Docker
image, not with a bare local run:

```bash
pnpm build && pnpm build-storybook
pnpm test:visual:update   # runs --update-snapshots in the Docker image
git add tests/visual/__screenshots__ && git commit
```

A plain `pnpm test:visual` on macOS will fail on font antialiasing — that's
expected; trust CI (or the Docker run) for the real verdict.

New story → CI fails with "snapshot doesn't exist" → run the update command
and commit the new baseline. Review baseline diffs like code: the PR diff for
`__screenshots__/` *is* the visual review.
