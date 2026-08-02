import { ReactNode, useState } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { motion } from '@oro/tokens';

export type PressSpringPressableProps = PressableProps & {
  pressedScale?: number;
  springDamping?: number;
  springStiffness?: number;
  outerStyle?: StyleProp<ViewStyle>;
  /** Called on press-in; wire device haptics here (e.g. expo-haptics) — the
   *  package itself has no haptics dependency. */
  onHaptic?: () => void;
};

/** Pressable that springs down to `pressedScale` while pressed. */
export function PressSpringPressable({
  pressedScale = 0.97,
  springDamping = motion.spring.press.damping,
  springStiffness = motion.spring.press.stiffness,
  onHaptic,
  onPressIn,
  onPressOut,
  outerStyle,
  style,
  children,
  disabled,
  ...rest
}: PressSpringPressableProps) {
  const [scale] = useState(() => new Animated.Value(1));

  const springTo = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      damping: springDamping,
      stiffness: springStiffness,
      useNativeDriver: true,
    }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, outerStyle]}>
      <Pressable
        onPressIn={(event) => {
          if (!disabled) {
            springTo(pressedScale);
            onHaptic?.();
          }
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          springTo(1);
          onPressOut?.(event);
        }}
        style={style}
        disabled={disabled}
        {...rest}
      >
        {children as ReactNode}
      </Pressable>
    </Animated.View>
  );
}

export default PressSpringPressable;
