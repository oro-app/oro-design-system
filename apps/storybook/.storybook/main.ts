import type { StorybookConfig } from '@storybook/react-vite';
import react from '@vitejs/plugin-react';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const reactNativeWeb = dirname(require.resolve('react-native-web/package.json'));

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: { name: '@storybook/react-vite', options: {} },
  async viteFinal(cfg) {
    cfg.plugins = cfg.plugins ?? [];
    cfg.plugins.push(react());
    cfg.resolve = cfg.resolve ?? {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias as Record<string, string>),
      'react-native': reactNativeWeb,
      // Consume the packages from SOURCE so platform files (Icon.web.tsx) resolve
      // and edits show without a rebuild.
      '@oro/ui': resolve(here, '../../../packages/ui/src/index.ts'),
      '@oro/tokens': resolve(here, '../../../packages/tokens/src/index.ts'),
    };
    cfg.resolve.dedupe = ['react', 'react-dom', 'react-native-web'];
    // .web.* wins over plain — this is what routes Icon → Icon.web.tsx on the web.
    cfg.resolve.extensions = ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js', ...(cfg.resolve.extensions ?? [])];
    cfg.define = { ...(cfg.define ?? {}), __DEV__: 'true', 'process.env.NODE_ENV': JSON.stringify('development') };
    cfg.optimizeDeps = cfg.optimizeDeps ?? {};
    cfg.optimizeDeps.include = [...(cfg.optimizeDeps.include ?? []), 'react-native-web', 'react-feather'];
    cfg.optimizeDeps.esbuildOptions = {
      ...(cfg.optimizeDeps.esbuildOptions ?? {}),
      resolveExtensions: ['.web.js', '.js', '.ts', '.tsx'],
      loader: { '.js': 'jsx' },
    };
    return cfg;
  },
};

export default config;
