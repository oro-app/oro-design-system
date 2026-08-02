import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native';
import {
  fonts,
  forMode,
  letterSpacing,
  lineHeights,
  radii,
  spacing,
  typography,
  withAlpha,
  type Mode,
  type SemanticColors,
} from '@oro/tokens';
import { Icon } from '../Icon';
import { FadeUpSection } from '../motion/FadeUpSection';
import { PressSpringPressable } from '../motion/PressSpringPressable';

/** Which surface the state sits on. Selects the matching semantic mode. */
export type LoadErrorStateTone = 'light' | 'onDark';

export type LoadErrorStateProps = {
  onRetry?: () => void;
  note?: string;
  tone?: LoadErrorStateTone;
};

/** Full-area load-failure state: icon ring, lowercase Fraunces title with the
 *  single italic-plum accent word, optional retry pill. */
export function LoadErrorState({ onRetry, note, tone = 'light' }: LoadErrorStateProps) {
  const mode: Mode = tone === 'onDark' ? 'dark' : 'light';
  const c = forMode(mode);
  const styles = STYLES[mode];

  return (
    <FadeUpSection style={styles.wrap}>
      <View style={styles.iconRing}>
        <Icon name="alert-circle" size="md" color={c.primaryAction} />
      </View>
      <Text style={styles.title}>
        couldn&apos;t <Text style={styles.titleAccent}>load</Text> this.
      </Text>
      <Text style={styles.note}>{note ?? 'try again. your wardrobe is still saved.'}</Text>
      {onRetry ? (
        <PressSpringPressable
          style={styles.retryButton}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry"
        >
          <Icon name="rotate-ccw" size={14} color={c.text} />
          <Text style={styles.retryText}>retry</Text>
        </PressSpringPressable>
      ) : null}
    </FadeUpSection>
  );
}

/** Built once per mode at module load — `tone` is a lookup, not a re-compute. */
const makeStyles = (c: SemanticColors) =>
  StyleSheet.create({
    wrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xl,
    },
    iconRing: {
      width: 52,
      height: 52,
      borderRadius: radii.pill,
      backgroundColor: c.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.lg,
    },
    title: {
      fontFamily: fonts.fraunces,
      fontSize: typography.heading,
      color: c.text,
      letterSpacing: letterSpacing.tight,
      textAlign: 'center',
    },
    titleAccent: {
      fontFamily: fonts.frauncesMediumItalic,
      color: c.primaryAction,
    },
    note: {
      marginTop: spacing.sm,
      fontFamily: fonts.frauncesItalic,
      fontSize: typography.subtext,
      color: withAlpha(c.text, '80'),
      textAlign: 'center',
      lineHeight: typography.subtext * lineHeights.relaxed,
    },
    retryButton: {
      marginTop: spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: c.borderStrong,
      borderRadius: radii.pill,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    retryText: {
      fontFamily: fonts.interMedium,
      fontSize: typography.subtext,
      color: c.text,
    },
  });

const STYLES = {
  light: makeStyles(forMode('light')),
  dark: makeStyles(forMode('dark')),
} as const;

export default LoadErrorState;
