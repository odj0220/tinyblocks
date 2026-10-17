import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '../common/Screen';
import { COLORS, SHADOW } from '../common/theme';
import { COMING_SOON, MODES } from '../modes/registry';
import type { ModeInfo } from '../modes/types';

export default function HomeScreen() {
  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.logo}>🧱 tinyblocks</Text>
        <Text style={styles.subtitle}>무엇을 하고 놀까요?</Text>
      </View>
      <View style={styles.list}>
        {MODES.map((mode) => (
          <ModeCard key={mode.id} mode={mode} onPress={() => router.push(`/${mode.id}`)} />
        ))}
        {COMING_SOON.map((mode) => (
          <ModeCard key={mode.id} mode={mode} />
        ))}
      </View>
    </Screen>
  );
}

function ModeCard({ mode, onPress }: { mode: ModeInfo; onPress?: () => void }) {
  const locked = !onPress;
  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: locked ? COLORS.locked : mode.color },
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.cardEmoji}>{mode.emoji}</Text>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{mode.title}</Text>
        <Text style={styles.cardDesc}>{locked ? '곧 나와요 🔒' : mode.description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingTop: 48, paddingBottom: 32 },
  logo: { fontSize: 40, fontWeight: '900', color: COLORS.text },
  subtitle: { fontSize: 20, color: COLORS.subText, marginTop: 8 },
  list: { gap: 16 },
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 28, padding: 20, ...SHADOW },
  pressed: { transform: [{ scale: 0.97 }] },
  cardEmoji: { fontSize: 48, marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 26, fontWeight: '900', color: COLORS.text },
  cardDesc: { fontSize: 16, color: COLORS.text, marginTop: 4 },
});
