import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import {
  fonts,
  forMode,
  letterSpacing,
  lineHeights,
  radii,
  spacing,
  typography,
  type Mode,
  type SemanticColors,
} from '@oro/tokens';

import { Button } from '../Button';
import { Icon } from '../Icon';

/** Which surface the callout sits on. Selects the matching semantic mode. */
export type CalloutTone = 'light' | 'onDark';

/** `card` is the prompt block above a list; `inline` is the compact alert beside a field. */
export type CalloutProminence = 'card' | 'inline';

export type CalloutProps = {
  /**
   * What is lost. Required, because a callout that could be built without it
   * would be a bare tint, and a tint explains nothing.
   */
  body: string;
  /** Card form only. The inline alert is one line and has nothing to title. */
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  prominence?: CalloutProminence;
  tone?: CalloutTone;
  style?: StyleProp<ViewStyle>;
};

/**
 * Says what an unfinished state costs, and offers the fix.
 *
 * This is the half of the needs-attention pattern that carries content. A badge
 * can travel to other screens but says only that something is waiting; the
 * callout names it, which is why it is the piece to build first if only one
 * gets built.
 */
export function Callout({
  body,
  title,
  actionLabel,
  onAction,
  prominence = 'card',
  tone = 'light',
  style,
}: CalloutProps) {
  const mode: Mode = tone === 'onDark' ? 'dark' : 'light';
  const c = forMode(mode);
  const styles = STYLES[mode];
  const inline = prominence === 'inline';

  return (
    <View style={[inline ? styles.inline : styles.card, style]}>
      {inline ? (
        <Icon name="alert-triangle" size={14} color={c.warning} />
      ) : null}
      <View style={styles.copy}>
        {title !== undefined ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={inline ? styles.inlineBody : styles.body}>{body}</Text>
        {actionLabel !== undefined ? (
          <Button
            label={actionLabel}
            size="sm"
            tone={tone}
            onPress={onAction}
            style={styles.action}
          />
        ) : null}
      </View>
    </View>
  );
}

/** Built once per mode at module load — `tone` is a lookup, not a re-compute. */
const makeStyles = (c: SemanticColors) =>
  StyleSheet.create({
    card: {
      padding: spacing.lg,
      borderRadius: radii.lg,
      backgroundColor: c.surfaceWarning,
      borderWidth: 1,
      borderColor: c.warning,
    },
    // The rule on the leading edge is what ties the alert to the field it is
    // about, which is the whole reason this form exists rather than a card.
    inline: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderTopRightRadius: radii.md,
      borderBottomRightRadius: radii.md,
      backgroundColor: c.surfaceWarning,
      borderLeftWidth: 2,
      borderLeftColor: c.warning,
    },
    copy: {
      flex: 1,
      gap: spacing.xs,
    },
    title: {
      fontFamily: fonts.fraunces,
      fontSize: typography.large,
      color: c.warningText,
      letterSpacing: letterSpacing.tight,
    },
    body: {
      fontFamily: fonts.inter,
      fontSize: typography.subtext,
      color: c.warningText,
      lineHeight: typography.subtext * lineHeights.relaxed,
    },
    inlineBody: {
      fontFamily: fonts.inter,
      fontSize: typography.tabs,
      color: c.warningText,
      lineHeight: typography.tabs * lineHeights.relaxed,
    },
    action: {
      marginTop: spacing.sm,
      alignSelf: 'flex-start',
    },
  });

const STYLES = {
  light: makeStyles(forMode('light')),
  dark: makeStyles(forMode('dark')),
} as const;

export default Callout;
