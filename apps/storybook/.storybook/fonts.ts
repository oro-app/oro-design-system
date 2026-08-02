// Map the RN token font-family names (fonts.* in @oro/tokens) onto real
// webfont files, so the gallery shows the actual type system instead of
// browser fallbacks. Native apps load these same families via expo-font;
// this file is the web/Storybook equivalent.
import interRegular from '@fontsource/inter/files/inter-latin-400-normal.woff2?url';
import interMedium from '@fontsource/inter/files/inter-latin-500-normal.woff2?url';
import interSemiBold from '@fontsource/inter/files/inter-latin-600-normal.woff2?url';
import frauncesLight from '@fontsource/fraunces/files/fraunces-latin-300-normal.woff2?url';
import frauncesRegular from '@fontsource/fraunces/files/fraunces-latin-400-normal.woff2?url';
import frauncesMedium from '@fontsource/fraunces/files/fraunces-latin-500-normal.woff2?url';
import frauncesSemiBold from '@fontsource/fraunces/files/fraunces-latin-600-normal.woff2?url';
import frauncesItalic from '@fontsource/fraunces/files/fraunces-latin-400-italic.woff2?url';
import frauncesMediumItalic from '@fontsource/fraunces/files/fraunces-latin-500-italic.woff2?url';

// Family names must match @oro/tokens `fonts` values exactly — RN treats each
// as an opaque family name, so each gets its own single-face @font-face.
const FACES: Array<[family: string, url: string, style: 'normal' | 'italic']> = [
  ['Inter-Regular', interRegular, 'normal'],
  ['Inter-Medium', interMedium, 'normal'],
  ['Inter-SemiBold', interSemiBold, 'normal'],
  ['Fraunces-Light', frauncesLight, 'normal'],
  ['Fraunces-Regular', frauncesRegular, 'normal'],
  ['Fraunces-Medium', frauncesMedium, 'normal'],
  ['Fraunces-SemiBold', frauncesSemiBold, 'normal'],
  ['Fraunces-Italic', frauncesItalic, 'italic'],
  ['Fraunces-MediumItalic', frauncesMediumItalic, 'italic'],
];

export function injectFonts(): void {
  const css = FACES.map(
    ([family, url, style]) =>
      `@font-face { font-family: '${family}'; src: url('${url}') format('woff2'); font-style: ${style}; font-display: block; }`,
  ).join('\n');
  const tag = document.createElement('style');
  tag.setAttribute('data-oro-fonts', '');
  tag.textContent = css;
  document.head.appendChild(tag);
}
