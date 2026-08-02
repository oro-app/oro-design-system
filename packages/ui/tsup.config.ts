import { defineConfig } from 'tsup';

// Two builds from one source tree:
// - dist/      — native (default): Icon.tsx resolves, @expo/vector-icons external
// - dist/web/  — web: .web.tsx wins (Icon.web.tsx → react-feather), so web
//   consumers (Vite + react-native-web) never touch @expo/vector-icons.
// The `browser` exports condition in package.json points at dist/web.
export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ['react', 'react-native', 'react/jsx-runtime', '@expo/vector-icons'],
  },
  {
    entry: ['src/index.ts'],
    outDir: 'dist/web',
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    external: ['react', 'react-native', 'react/jsx-runtime'],
    esbuildOptions(options) {
      options.resolveExtensions = ['.web.tsx', '.web.ts', '.tsx', '.ts', '.js'];
    },
  },
]);
