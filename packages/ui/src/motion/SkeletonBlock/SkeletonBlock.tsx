import { useEffect, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { colors, motion, radii, withAlpha } from '@oro/tokens';
import { motionEasing } from '../easing';
import { useReducedMotion } from '../useReducedMotion';

export type SkeletonBlockProps = {
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Loading placeholder: muted plum block with a slow sheen pulse. (The app's
 * original used an expo-linear-gradient sweep; here the sheen is an opacity
 * pulse so the package stays dependency-free.)
 */
export function SkeletonBlock({
  width = '100%',
  height = 14,
  borderRadius = radii.sm,
  style,
}: SkeletonBlockProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();

  useEffect(() => {
    progress.setValue(0);
    if (reduced) return;
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: motion.duration.sheen,
        easing: motionEasing.sheen,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [progress, reduced]);

  const sheenOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: colors.surfaceMuted, overflow: 'hidden' }, style]}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: withAlpha(colors.background, '60'),
          opacity: sheenOpacity,
        }}
      />
    </Animated.View>
  );
}

export default SkeletonBlock;
