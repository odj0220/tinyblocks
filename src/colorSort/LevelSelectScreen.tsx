import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Level } from './logic';

type Props = {
  levels: Level[];
  stars: Record<number, number>;
  onSelect: (index: number) => void;
};

export function LevelSelectScreen({ levels, stars, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🧱 tinyblocks</Text>
      <Text style={styles.subtitle}>같은 색끼리 모아요!</Text>
      <View style={styles.grid}>
        {levels.map((level, i) => {
          // 이전 레벨을 깨야 다음 레벨이 열린다
          const locked = i > 0 && !stars[levels[i - 1].id];
          const earned = stars[level.id] ?? 0;
          return (
            <Pressable
              key={level.id}
              disabled={locked}
              onPress={() => onSelect(i)}
              style={[styles.cell, locked && styles.locked]}
            >
              <Text style={styles.cellNumber}>{locked ? '🔒' : level.id}</Text>
              <Text style={styles.cellStars}>{earned ? '⭐'.repeat(earned) : ' '}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 48, paddingHorizontal: 16 },
  logo: { fontSize: 40, fontWeight: '900', color: '#37474F' },
  subtitle: { fontSize: 20, color: '#607D8B', marginTop: 8, marginBottom: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  cell: {
    width: 84,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#FFD54F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  locked: { backgroundColor: '#CFD8DC' },
  cellNumber: { fontSize: 34, fontWeight: '900', color: '#37474F' },
  cellStars: { fontSize: 14, marginTop: 4 },
});
