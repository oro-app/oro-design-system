import { Easing, EasingFunction } from 'react-native';
import { motion } from '@oro/tokens';

const bezier = (token: readonly [number, number, number, number]) =>
  Easing.bezier(token[0], token[1], token[2], token[3]);

/** Token easing curves resolved into RN Easing functions (core Animated). */
export const motionEasing: Record<string, EasingFunction> & {
  standard: EasingFunction;
  enter: EasingFunction;
  exit: EasingFunction;
  spring: EasingFunction;
  reveal: EasingFunction;
  sheen: EasingFunction;
} = {
  standard: bezier(motion.easing.standard),
  enter: bezier(motion.easing.enter),
  exit: bezier(motion.easing.exit),
  spring: bezier(motion.easing.spring),
  reveal: Easing.out(Easing.cubic),
  sheen: Easing.inOut(Easing.cubic),
};
