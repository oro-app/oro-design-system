import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/storybook-static/**',
      '**/node_modules/**',
      '**/test-results/**',
      'tests/visual/__screenshots__/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Node build scripts (codegen etc.)
  {
    files: ['**/scripts/**/*.mjs'],
    languageOptions: { globals: { console: 'readonly', process: 'readonly' } },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { react, 'react-hooks': reactHooks },
    // Explicit version: eslint-plugin-react's 'detect' path uses an API removed in ESLint 10.
    settings: { react: { version: '18.3' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // New JSX transform — no React import needed.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    // Token tiers flow ONE WAY: primitive → semantic → component.
    // Consumers read semantic/component tokens, never raw primitives — a
    // component that reaches for `ramps.plum[600]` or a `palette` hex directly
    // has hardcoded a value that can no longer be themed or re-pointed.
    // The tier-1 escape hatches (`mix`, `withAlpha`, `shiftLightness`) stay
    // available; it's the *values* that are off-limits.
    files: ['packages/ui/src/**/*.{ts,tsx}', 'packages/web/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@oro/tokens',
              importNames: ['palette', 'ramps', 'primitives'],
              message:
                'Tier 1 is internal to @oro/tokens. Import a semantic role (e.g. `semantic`, `forMode`) or a component token instead — those theme with `tone`, raw primitives do not.',
            },
          ],
          patterns: [
            {
              group: ['**/primitives', '**/tokens/src/primitives'],
              message: 'Do not reach into tier 1 directly. Use semantic.ts or components.ts.',
            },
          ],
        },
      ],
    },
  },
);
