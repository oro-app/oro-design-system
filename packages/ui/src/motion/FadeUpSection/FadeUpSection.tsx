import { useEffect, useRef, useState } from 'react';
import { Animated, ViewProps } from 'react-native';
import { motion } from '@oro/tokens';
import { motionEasing } from '../easing';
import { useReducedMotion } from '../useReducedMotion';

export type FadeUpSectionProps = ViewProps & {
  delay?: number;
  distance?: number;
  duration?: number;
  disabled?: boolean;
  /**
   * Drives replay: while false the section is held hidden; each false→true flip
   * replays the reveal. Wire this to navigation focus in the app (the port of
   * `replayOnFocus`, without a router dependency). Omit for reveal-on-mount.
   */
  active?: boolean;
};

/** Editorial reveal: fades in while translating up. Reveal-on-mount by default. */
export function FadeUpSection({
  delay = 0,
  distance = 14,
  duration = motion.duration.reveal,
  disabled = false,
  active,
  style,
  children,
  ...rest
}: FadeUpSectionProps) {
  const reduced = useReducedMotion();
  const skip = reduced || disabled;
  const [opacity] = useState(() => new Animated.Value(0));
  const [ty] = useState(() => new Animated.Value(distance));
  const hasAnimated = useRef(false);

  useEffect(() => {
    const reveal = () => {
      const timing = { duration, delay, easing: motionEasing.reveal, useNativeDriver: true };
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, ...timing }),
        Animated.timing(ty, { toValue: 0, ...timing }),
      ]).start();
    };

    if (skip) {
      opacity.setValue(1);
      ty.setValue(0);
      return;
    }
    if (active === undefined) {
      if (hasAnimated.current) return;
      hasAnimated.current = true;
      reveal();
      return;
    }
    if (active) {
      opacity.setValue(0);
      ty.setValue(distance);
      reveal();
    }
  }, [active, delay, duration, distance, skip, opacity, ty]);

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY: ty }] }, style]} {...rest}>
      {children}
    </Animated.View>
  );
}

export default FadeUpSection;
