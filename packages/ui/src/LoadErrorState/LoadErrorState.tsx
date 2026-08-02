import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native';
import {
  colors,
  fonts,
  letterSpacing,
  lineHeights,
  radii,
  spacing,
  typography,
  withAlpha,
} from '@oro/tokens';
import { Icon } from '../Icon';
import { FadeUpSection } from '../motion/FadeUpSection';
import { PressSpringPressable } from '../motion/PressSpringPressable';

export type LoadErrorStateProps = {
  onRetry?: () => void;
  note?: string;
};

/** Full-area load-failure state: icon ring, lowercase Fraunces title with the
 *  single italic-plum accent word, optional retry pill. */
export function LoadErrorState({ onRetry, note }: LoadErrorStateProps) {
  return (
    <FadeUpSection style={styles.wrap}>
      <View style={styles.iconRing}>
        <Icon name="alert-circle" size="md" color={colors.primaryAction} />
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
          <Icon name="rotate-ccw" size={14} color={colors.text} />
          <Text style={styles.retryText}>retry</Text>
        </PressSpringPressable>
      ) : null}
    </FadeUpSection>
  );
}

const styles = StyleSheet.create({
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
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.fraunces,
    fontSize: typography.heading,
    color: colors.text,
    letterSpacing: letterSpacing.tight,
    textAlign: 'center',
  },
  titleAccent: {
    fontFamily: fonts.frauncesMediumItalic,
    color: colors.primaryAction,
  },
  note: {
    marginTop: spacing.sm,
    fontFamily: fonts.frauncesItalic,
    fontSize: typography.subtext,
    color: withAlpha(colors.text, '80'),
    textAlign: 'center',
    lineHeight: typography.subtext * lineHeights.relaxed,
  },
  retryButton: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  retryText: {
    fontFamily: fonts.interMedium,
    fontSize: typography.subtext,
    color: colors.text,
  },
});

export default LoadErrorState;
