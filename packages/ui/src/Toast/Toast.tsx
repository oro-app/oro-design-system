import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import {
  fonts,
  forMode,
  lineHeights,
  motion,
  toastGeometry,
  typography,
  type Mode,
} from '@oro/tokens';

import { Icon } from '../Icon';
import { motionEasing, useReducedMotion } from '../motion';
import { resolveElevation } from '../style';

/** Which surface the toast sits on. Selects the matching semantic mode. */
export type ToastTone = 'light' | 'onDark';

export type ToastProps = {
  /** What happened, in full. There is no severity colour to read instead, so the message carries the whole outcome. */
  message: string;
  visible: boolean;
  /** Called when the dwell elapses and when the close control is pressed. */
  onDismiss: () => void;
  /** How long the toast stays up. `0` holds it until the caller hides it. */
  duration?: number;
  tone?: ToastTone;
  style?: StyleProp<ViewStyle>;
};

/**
 * Transient message reporting an outcome without moving the user anywhere.
 *
 * Positioning is the consumer's job: this package has no safe-area dependency,
 * and the toast floats over content rather than sitting in the layout.
 */
export function Toast({
  message,
  visible,
  onDismiss,
  duration = toastGeometry.dwell,
  tone = 'light',
  style,
}: ToastProps) {
  const mode: Mode = tone === 'onDark' ? 'dark' : 'light';
  const c = forMode(mode);
  const onDark = mode === 'dark';
  const reduced = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(toastGeometry.enterDistance));
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }
    opacity.setValue(0);
    translateY.setValue(toastGeometry.enterDistance);
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: motion.duration.normal,
        easing: motionEasing.enter,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: motion.duration.normal,
        easing: motionEasing.enter,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, reduced, message, opacity, translateY]);

  // VoiceOver does not read a view that appears without focus moving to it.
  useEffect(() => {
    if (!visible) return;
    AccessibilityInfo.announceForAccessibility?.(message);
  }, [visible, message]);

  // The callback is read through a ref so a new inline prop cannot restart the dwell.
  useEffect(() => {
    if (!visible || duration <= 0) return;
    const timer = setTimeout(() => onDismissRef.current(), duration);
    return () => clearTimeout(timer);
  }, [visible, duration, message]);

  if (!visible) return null;

  return (
    <Animated.View
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      style={[
        styles.toast,
        {
          backgroundColor: c.surface,
          // A shadow cannot separate two dark surfaces, so on dark the capsule takes a hairline border instead.
          ...(onDark
            ? { borderWidth: 1, borderColor: c.border }
            : resolveElevation('floating', c.shadow)),
          opacity,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <Text style={[styles.message, { color: c.text }]}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="dismiss"
        onPress={onDismiss}
        hitSlop={toastGeometry.paddingVertical}
        style={styles.close}
      >
        <Icon name="x" size={toastGeometry.iconSize} color={c.textSubtle} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: toastGeometry.gap,
    paddingVertical: toastGeometry.paddingVertical,
    paddingHorizontal: toastGeometry.paddingHorizontal,
    borderRadius: toastGeometry.radius,
  },
  message: {
    flex: 1,
    fontFamily: fonts.inter,
    fontSize: typography.subtext,
    lineHeight: typography.subtext * lineHeights.relaxed,
  },
  close: {
    alignSelf: 'flex-start',
  },
});

export default Toast;
