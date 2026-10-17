import { StyleSheet, Text, View } from 'react-native';

import { BigButton } from './BigButton';
import { COLORS } from './theme';

type Props = {
  result: 'cleared' | 'timeout';
  stars: number;
  hasNext: boolean;
  onNext: () => void;
  onRetry: () => void;
  onExit: () => void;
};

export function ResultOverlay({ result, stars, hasNext, onNext, onRetry, onExit }: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {result === 'cleared' ? (
          <>
            <Text style={styles.bigEmoji}>🎉</Text>
            <Text style={styles.title}>잘했어요!</Text>
            <Text style={styles.stars}>{'⭐'.repeat(stars)}</Text>
            {hasNext ? (
              <BigButton label="다음 레벨 ▶️" onPress={onNext} primary />
            ) : (
              <Text style={styles.sub}>모든 레벨 완료! 🏆</Text>
            )}
            <BigButton label="🔄 한 번 더" onPress={onRetry} />
          </>
        ) : (
          <>
            <Text style={styles.bigEmoji}>⏰</Text>
            <Text style={styles.title}>시간이 끝났어요</Text>
            <BigButton label="🔄 다시 하기" onPress={onRetry} primary />
          </>
        )}
        <BigButton label="📋 레벨 선택" onPress={onExit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: { backgroundColor: COLORS.modal, borderRadius: 32, padding: 28, width: '80%' },
  bigEmoji: { fontSize: 72, textAlign: 'center' },
  title: { fontSize: 30, fontWeight: '800', textAlign: 'center', color: COLORS.text, marginVertical: 8 },
  sub: { fontSize: 22, textAlign: 'center', marginVertical: 8 },
  stars: { fontSize: 40, textAlign: 'center', marginBottom: 8 },
});
