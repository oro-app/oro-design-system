import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors, radii } from '@oro/tokens';
import { Icon } from '../Icon';
import { resolveElevation } from '../style';

export type BackButtonProps = {
  onPress: () => void;
  accessibilityLabel?: string;
};

/** Circular 44pt back affordance: white surface, plum-tinted low shadow. */
export function BackButton({ onPress, accessibilityLabel = 'Go back' }: BackButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.btn}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Icon name="arrow-left" size="md" color={colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...resolveElevation('low'),
  },
});

export default BackButton;
