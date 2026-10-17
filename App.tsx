import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { ColorSortScreen } from './src/colorSort/ColorSortScreen';
import { LevelSelectScreen } from './src/colorSort/LevelSelectScreen';
import { LEVELS } from './src/colorSort/levels';

export default function App() {
  const [levelIndex, setLevelIndex] = useState<number | null>(null);
  const [stars, setStars] = useState<Record<number, number>>({});

  const level = levelIndex === null ? null : LEVELS[levelIndex];

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.root}>
          {level === null ? (
            <LevelSelectScreen levels={LEVELS} stars={stars} onSelect={setLevelIndex} />
          ) : (
            <ColorSortScreen
              level={level}
              hasNext={levelIndex! < LEVELS.length - 1}
              onNext={() => setLevelIndex(levelIndex! + 1)}
              onExit={() => setLevelIndex(null)}
              onClear={(earned) =>
                setStars((s) => ({ ...s, [level.id]: Math.max(s[level.id] ?? 0, earned) }))
              }
            />
          )}
          <StatusBar style="dark" />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#E3F2FD' },
});
