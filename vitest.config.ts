import { defineConfig } from 'vitest/config';

// Unit tests cover the pure logic the visual/interaction suites cannot reach:
// the OKLab ramp maths, mode parity, contrast contracts, and the Tailwind
// preset's namespacing. Node environment — nothing here renders.
export default defineConfig({
  test: {
    include: ['packages/*/src/**/*.test.ts'],
    environment: 'node',
  },
});
