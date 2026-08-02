import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect } from '@playwright/test';

// One screenshot per story, discovered from the built Storybook's index.
// Run `pnpm build-storybook` first — the spec fails loudly if the build is missing.
const indexPath = join(__dirname, '../../apps/storybook/storybook-static/index.json');
if (!existsSync(indexPath)) {
  throw new Error('storybook-static/index.json not found — run `pnpm build-storybook` first.');
}

type IndexEntry = { id: string; type: string };
const entries = Object.values(
  (JSON.parse(readFileSync(indexPath, 'utf8')) as { entries: Record<string, IndexEntry> }).entries,
).filter((e) => e.type === 'story');

for (const story of entries) {
  test(`story ${story.id}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    // Let fonts/layout and any motion (already reduced) settle.
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot(`${story.id}.png`, { fullPage: true });
  });
}
