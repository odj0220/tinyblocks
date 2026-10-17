import { Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  icon: string;
  onPress: () => void;
};

export function IconButton({ icon, onPress }: Props) {
  return (
    <Pressable onPress={onPress} hitSlop={12} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.icon}>{icon}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8 },
  pressed: { transform: [{ scale: 0.9 }] },
  icon: { fontSize: 28 },
});
