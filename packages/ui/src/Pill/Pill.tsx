import { ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { colors, fonts, typography, radii } from '@oro/tokens';

export type PillProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

/** Filter / selection chip. Full radius. */
export function Pill({ label, active = false, onPress, children, style, textStyle }: PillProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.base, active && styles.active, style]}>
      <View style={styles.content}>
        {children}
        <Text style={[styles.label, active && styles.labelActive, textStyle]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.secondaryActionBorder,
    backgroundColor: colors.secondaryAction,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  active: { borderColor: colors.selectionBorder, backgroundColor: colors.primaryAction },
  label: { color: colors.textMuted, fontFamily: fonts.interMedium, fontSize: 13 },
  labelActive: { color: colors.primaryActionText },
});

export default Pill;
