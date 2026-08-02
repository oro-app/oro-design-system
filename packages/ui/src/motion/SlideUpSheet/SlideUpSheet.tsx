import { ReactNode, useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { colors, motion } from '@oro/tokens';
import { useReducedMotion } from '../useReducedMotion';

// Read lazily (not at module scope): under SSR/react-native-web there is no
// window when the module is imported, and Dimensions.get would throw or lie.
function screenHeight(): number {
  try {
    return Dimensions.get('window').height || 800;
  } catch {
    return 800;
  }
}

export type SlideUpSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Render without the RN Modal wrapper (e.g. when a parent already hosts one). */
  withModal?: boolean;
};

/** Bottom sheet: dimmed backdrop + content sliding up from the bottom edge. */
export function SlideUpSheet({ visible, onClose, children, withModal = true }: SlideUpSheetProps) {
  const reduced = useReducedMotion();
  const [translateY] = useState(() => new Animated.Value(screenHeight()));
  const [backdropOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      translateY.setValue(0);
      backdropOpacity.setValue(1);
      return;
    }
    translateY.setValue(screenHeight());
    backdropOpacity.setValue(0);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: motion.duration.slow,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: motion.duration.slow,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, reduced, translateY, backdropOpacity]);

  const content = (
    <View style={styles.root}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
      </Animated.View>
      {/* The sheet renders in its own Modal (outside any screen-level
          KeyboardAvoidingView), so it must handle the keyboard itself or
          bottom-anchored content with inputs gets covered. */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View style={{ transform: [{ translateY }] }}>{children}</Animated.View>
      </KeyboardAvoidingView>
    </View>
  );

  if (!withModal) {
    return visible ? content : null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {content}
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.overlayStrong,
  },
});

export default SlideUpSheet;
