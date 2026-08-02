import { defineConfig, devices } from '@playwright/test';

// Visual regression against the built Storybook. Baselines are Linux-only
// (generated in the Playwright Docker image; CI runs Ubuntu) — see
// tests/visual/README.md for how to update them.
export default defineConfig({
  testDir: 'tests/visual',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  // Rendering is deterministic (same Docker image as CI's Ubuntu), so keep the
  // tolerance tight — a ratio-based threshold on a 900×700 page can swallow an
  // entire font swap (~a few thousand pixels of label text).
  expect: { toHaveScreenshot: { maxDiffPixels: 64 } },
  use: {
    baseURL: 'http://127.0.0.1:6006',
    // Reduced motion: RNW's AccessibilityInfo picks this up, so @oro/ui motion
    // primitives render their resting state — keeps screenshots deterministic.
    contextOptions: { reducedMotion: 'reduce' },
    viewport: { width: 900, height: 700 },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx http-server apps/storybook/storybook-static -p 6006 -s',
    url: 'http://127.0.0.1:6006/index.json',
    reuseExistingServer: !process.env.CI,
  },
});
