import type { Preview } from '@storybook/react-vite';
import { colors } from '@oro/tokens';
import { injectFonts } from './fonts';

injectFonts();

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'paper',
      values: [
        { name: 'paper', value: colors.background },
        { name: 'surface', value: colors.surface },
        { name: 'plum', value: colors.primaryAction },
      ],
    },
    controls: { matchers: { color: /(background|color)$/i } },
  },
};

export default preview;
