# visual regression

One Playwright screenshot per story, diffed against the baselines in
`__screenshots__/`.

**Baselines are generated AND verified inside `mcr.microsoft.com/playwright:v1.62.1-noble`.**
That pairing is load-bearing, not incidental. The `visual` CI job sets
`container:` to that exact image for this reason — it previously ran on the bare
`ubuntu-latest` runner, which has a different font set. Glyph metrics differed
just enough to shift each row of text by a pixel, and on a tall story the drift
accumulated past the 64px threshold and failed a correct PR. If you bump the
image, bump it in `package.json`'s `test:visual:update` *and* in
`.github/workflows/ci.yml`, then regenerate every baseline.

Update them inside that image, never with a bare local run:

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
