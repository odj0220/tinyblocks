import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { canMove, isSolved, isTubeDone, move, starsFor, type Level, type Tube as TubeData } from './logic';
import { Tube } from './Tube';

type Props = {
  level: Level;
  hasNext: boolean;
  onNext: () => void;
  onExit: () => void;
  onClear: (stars: number) => void;
};

type Status = 'playing' | 'cleared' | 'timeout';

export function ColorSortScreen({ level, hasNext, onNext, onExit, onClear }: Props) {
  const [tubes, setTubes] = useState<TubeData[]>(level.tubes);
  const [history, setHistory] = useState<TubeData[][]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(level.timeLimit);
  const [status, setStatus] = useState<Status>('playing');
  const [shakeKeys, setShakeKeys] = useState<number[]>(() => level.tubes.map(() => 0));

  const restart = useCallback(() => {
    setTubes(level.tubes);
    setHistory([]);
    setSelected(null);
    setTimeLeft(level.timeLimit);
    setStatus('playing');
    setShakeKeys(level.tubes.map(() => 0));
  }, [level]);

  useEffect(restart, [restart]);

  useEffect(() => {
    if (status !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setStatus('timeout');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [status]);

  const handlePress = (index: number) => {
    if (status !== 'playing') return;
    if (selected === null) {
      if (tubes[index].length > 0) setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    if (!canMove(tubes, selected, index, level.capacity)) {
      setShakeKeys((keys) => keys.map((k, i) => (i === index ? k + 1 : k)));
      // 비어있지 않은 다른 튜브를 누르면 그 튜브로 선택을 바꿔준다
      setSelected(tubes[index].length > 0 ? index : null);
      return;
    }
    const next = move(tubes, selected, index);
    setHistory((h) => [...h, tubes]);
    setTubes(next);
    setSelected(null);
    if (isSolved(next, level.capacity)) {
      setStatus('cleared');
      onClear(starsFor(timeLeft, level.timeLimit));
    }
  };

  const undo = () => {
    if (status !== 'playing' || history.length === 0) return;
    setTubes(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    setSelected(null);
  };

  const urgent = timeLeft <= 10;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onExit} style={styles.iconButton}>
          <Text style={styles.iconText}>🏠</Text>
        </Pressable>
        <Text style={styles.title}>레벨 {level.id}</Text>
        <Text style={[styles.timer, urgent && styles.timerUrgent]}>⏰ {timeLeft}</Text>
      </View>

      <View style={styles.timeBar}>
        <View
          style={[
            styles.timeFill,
            { width: `${(timeLeft / level.timeLimit) * 100}%` },
            urgent && { backgroundColor: '#EF5350' },
          ]}
        />
      </View>

      <View style={styles.board}>
        {tubes.map((tube, i) => (
          <Tube
            key={i}
            tube={tube}
            capacity={level.capacity}
            selected={selected === i}
            done={isTubeDone(tube, level.capacity)}
            shakeKey={shakeKeys[i]}
            onPress={() => handlePress(i)}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable onPress={undo} style={[styles.button, history.length === 0 && styles.disabled]}>
          <Text style={styles.buttonText}>↩️ 되돌리기</Text>
        </Pressable>
        <Pressable onPress={restart} style={styles.button}>
          <Text style={styles.buttonText}>🔄 처음부터</Text>
        </Pressable>
      </View>

      {status !== 'playing' && (
        <View style={styles.overlay}>
          <View style={styles.card}>
            {status === 'cleared' ? (
              <>
                <Text style={styles.bigEmoji}>🎉</Text>
                <Text style={styles.cardTitle}>잘했어요!</Text>
                <Text style={styles.stars}>
                  {'⭐'.repeat(starsFor(timeLeft, level.timeLimit))}
                </Text>
                {hasNext ? (
                  <Pressable onPress={onNext} style={[styles.button, styles.primary]}>
                    <Text style={styles.buttonText}>다음 레벨 ▶️</Text>
                  </Pressable>
                ) : (
                  <Text style={styles.cardSub}>모든 레벨 완료! 🏆</Text>
                )}
              </>
            ) : (
              <>
                <Text style={styles.bigEmoji}>⏰</Text>
                <Text style={styles.cardTitle}>시간이 끝났어요</Text>
                <Pressable onPress={restart} style={[styles.button, styles.primary]}>
                  <Text style={styles.buttonText}>🔄 다시 하기</Text>
                </Pressable>
              </>
            )}
            <Pressable onPress={onExit} style={styles.button}>
              <Text style={styles.buttonText}>🏠 레벨 선택</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  iconButton: { padding: 8 },
  iconText: { fontSize: 28 },
  title: { fontSize: 26, fontWeight: '800', color: '#37474F' },
  timer: { fontSize: 24, fontWeight: '800', color: '#37474F', minWidth: 80, textAlign: 'right' },
  timerUrgent: { color: '#E53935' },
  timeBar: { height: 12, borderRadius: 6, backgroundColor: '#E0E6EE', overflow: 'hidden' },
  timeFill: { height: '100%', backgroundColor: '#66BB6A' },
  board: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    columnGap: 14,
    rowGap: 48,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingBottom: 16 },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  primary: { backgroundColor: '#FFD54F' },
  disabled: { opacity: 0.4 },
  buttonText: { fontSize: 20, fontWeight: '700', color: '#37474F' },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#00000066',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: { backgroundColor: '#FFF8E1', borderRadius: 32, padding: 28, alignItems: 'stretch', width: '80%' },
  bigEmoji: { fontSize: 72, textAlign: 'center' },
  cardTitle: { fontSize: 30, fontWeight: '800', textAlign: 'center', color: '#37474F', marginVertical: 8 },
  cardSub: { fontSize: 22, textAlign: 'center', marginVertical: 8 },
  stars: { fontSize: 40, textAlign: 'center', marginBottom: 8 },
});
