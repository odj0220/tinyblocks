import { Pressable, StyleSheet, Text } from 'react-native';

import { COLORS, SHADOW } from './theme';

type Props = {
  label: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
};

export function BigButton({ label, onPress, primary, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        primary && styles.primary,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.card,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    ...SHADOW,
  },
  primary: { backgroundColor: COLORS.primary },
  disabled: { opacity: 0.4 },
  pressed: { transform: [{ scale: 0.96 }] },
  label: { fontSize: 20, fontWeight: '700', color: COLORS.text },
});
