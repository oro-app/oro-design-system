/**
 * Guards the one promise the tier split has to keep: introducing ramps and the
 * light/dark semantic layer must not move a single shipped pixel.
 *
 * `colors.ts` is a compatibility shim over `semantic.light`. Every key it
 * exported before the split must still resolve to a byte-identical value —
 * @oro/web's generated CSS, the Tailwind preset, and the visual baselines all
 * read it. This snapshot is the pre-split output, captured from git history.
 *
 * Run: pnpm --filter @oro/tokens assert-inert
 *
 * If this fails, you changed a shipped color. That may be intentional — but it
 * is a design change requiring sign-off and regenerated baselines, not a
 * refactor. Update BASELINE only alongside that sign-off.
 */
import { colors } from '../src/colors';

/** Pre-split values of every key `colors` exported. Do not edit casually. */
const BASELINE: Record<string, string> = {
  cream: '#FFF2D7',
  plum: '#3A2646',
  gold: '#D4A853',
  ink: '#0B0B0B',
  paper: '#FFF9ED',
  white: '#FFFDF8',
  rose: '#A84E5C',
  primary: '#FFF2D7',
  secondary: '#3A2646',
  accent: '#D4A853',
  text: '#0B0B0B',
  background: '#FFF9ED',
  red: '#A84E5C',
  surface: '#FFFDF8',
  surfaceMuted: '#3A264612',
  surfaceSoft: '#3A264608',
  surfaceAccent: '#D4A85326',
  surfaceDanger: '#A84E5C14',
  surfaceInverse: '#3A2646',
  surfaceInverseText: '#FFFDF8',
  border: '#3A26461F',
  borderStrong: '#3A26464A',
  borderHairline: '#3A264614',
  primaryAction: '#3A2646',
  primaryActionText: '#FFFDF8',
  primaryActionDisabled: '#3A264629',
  primaryActionDisabledText: '#3A2646',
  primaryActionHover: '#33213e',
  primaryActionHoverOnDark: '#573969',
  hoverTint: '#3A264612',
  dangerSurfaceHover: '#A84E5C20',
  // CHANGED DELIBERATELY (accessibility, not refactor). Was '#D4A853B3' —
  // brand gold at 70% alpha, which composited to 1.70:1 on cream and failed
  // WCAG 2.4.11's 3:1 minimum for a focus indicator. Now gold[600] at 4.41:1.
  // This is the one entry in this file that is NOT a pre-split value, and it
  // moved with sign-off. Everything else must stay byte-identical.
  focusRing: '#8F733D',
  secondaryAction: '#FFFDF8',
  secondaryActionText: '#0B0B0B',
  secondaryActionIcon: '#3A2646',
  secondaryActionBorder: '#3A264633',
  selection: '#3A26461E',
  selectionBorder: '#3A2646',
  // CHANGED DELIBERATELY (accessibility, not refactor) — the SECOND such entry
  // in this file, following `focusRing` above, and held to the same bar. Was
  // '#0B0B0B', i.e. plain ink: `accentText` was not an accent at all, and no
  // consumer read it. The system had no way to render small gold text on a
  // light surface at AA — the nearest ramp step, gold[600], is 4.27:1 and reads
  // brown. Now a derived, chroma-preserving darkened gold: 4.80:1 on paper,
  // 4.95:1 on white, 4.54:1 on cream.
  //
  // This moves NO shipped pixel. oro-landing's scripts/generate-tokens.mjs does
  // not read `colors.accentText` (verified key by key), so no CSS variable it
  // emits changes; @oro/web's build-css.mjs and the Tailwind preset don't read
  // it either. It is listed here because the shim exports it, not because
  // anything renders it.
  accentText: '#8D691D',
  textMuted: '#3A2646',
  textSubtle: '#3A2646A6',
  secondaryMuted: '#3A264675',
  dangerText: '#A84E5C',
  dangerBorder: '#A84E5C52',
  progressTrack: '#3A26461A',
  shadow: '#3A2646',
  overlay: '#0B0B0B66',
  overlayStrong: '#0B0B0BC7',
  brandRampTop: '#4a315a',
  brandRamp: '#32213c',
  brandRampDeep: '#211628',
  brandRampBlack: '#1b1221',
  brandInk: '#3A2646',
  brandGold: '#D4A853',
  brandCream: '#FFF9ED',
};

const actual = colors as unknown as Record<string, string>;
const failures: string[] = [];

for (const [key, expected] of Object.entries(BASELINE)) {
  if (!(key in actual)) {
    failures.push(`  ${key}: REMOVED (was ${expected})`);
  } else if (actual[key] !== expected) {
    failures.push(`  ${key}: ${expected} → ${actual[key]}`);
  }
}

const added = Object.keys(actual).filter((k) => !(k in BASELINE));

if (failures.length) {
  console.error(`\n✗ ${failures.length} shipped color(s) moved:\n${failures.join('\n')}\n`);
  console.error('The tier split must be visually inert. See the header of this file.\n');
  process.exit(1);
}

console.log(`✓ all ${Object.keys(BASELINE).length} pre-split colors unchanged`);
if (added.length) console.log(`  (${added.length} new key(s): ${added.join(', ')})`);
