import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconButton } from '../../common/IconButton';
import { useProgress } from '../../common/progress';
import { Screen } from '../../common/Screen';
import { COLORS, SHADOW } from '../../common/theme';
import { getMode } from '../../modes/registry';

export default function LevelSelectScreen() {
  const { mode: modeId } = useLocalSearchParams<{ mode: string }>();
  const mode = getMode(modeId);
  const { getStars } = useProgress();

  if (!mode) return <Redirect href="/" />;

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton icon="🏠" onPress={() => router.back()} />
        <Text style={styles.title}>
          {mode.emoji} {mode.title}
        </Text>
      </View>
      <View style={styles.grid}>
        {mode.levels.map((level, i) => {
          // 이전 레벨을 깨야 다음 레벨이 열린다
          const locked = i > 0 && getStars(mode.id, mode.levels[i - 1].id) === 0;
          const earned = getStars(mode.id, level.id);
          return (
            <Pressable
              key={level.id}
              disabled={locked}
              onPress={() => router.push(`/${mode.id}/${level.id}`)}
              style={({ pressed }) => [
                styles.cell,
                { backgroundColor: locked ? COLORS.locked : mode.color },
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cellNumber}>{locked ? '🔒' : level.id}</Text>
              <Text style={styles.cellStars}>{earned ? '⭐'.repeat(earned) : ' '}</Text>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginLeft: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  cell: { width: 84, height: 96, borderRadius: 24, alignItems: 'center', justifyContent: 'center', ...SHADOW },
  pressed: { transform: [{ scale: 0.95 }] },
  cellNumber: { fontSize: 34, fontWeight: '900', color: COLORS.text },
  cellStars: { fontSize: 14, marginTop: 4 },
});
