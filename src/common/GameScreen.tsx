import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { BaseLevel, GameMode } from '../modes/types';
import { IconButton } from './IconButton';
import { useProgress } from './progress';
import { ResultOverlay } from './ResultOverlay';
import { Screen } from './Screen';
import { starsFor } from './stars';
import { COLORS } from './theme';
import { TimerBar, TimerText } from './TimerBar';
import { useCountdown } from './useCountdown';

type Props = {
  mode: GameMode<BaseLevel>;
  level: BaseLevel;
  hasNext: boolean;
  onNext: () => void;
  onExit: () => void;
};

type Status = 'playing' | 'cleared';

/** 모든 모드가 함께 쓰는 게임 화면: 헤더, 타이머, 다시 하기, 결과 화면을 맡고 보드만 모드별로 바뀐다 */
export function GameScreen({ mode, level, hasNext, onNext, onExit }: Props) {
  const [status, setStatus] = useState<Status>('playing');
  const [attempt, setAttempt] = useState(0);
  const [stars, setStars] = useState(0);
  const { recordStars } = useProgress();
  const { timeLeft, reset } = useCountdown(level.timeLimit, status === 'playing');
  const result = status === 'cleared' ? 'cleared' : timeLeft === 0 ? 'timeout' : null;

  const restart = () => {
    reset();
    setStatus('playing');
    // key를 바꿔 보드를 처음 상태로 다시 만든다
    setAttempt((a) => a + 1);
  };

  const handleSolved = () => {
    const earned = starsFor(timeLeft, level.timeLimit);
    setStars(earned);
    setStatus('cleared');
    recordStars(mode.id, level.id, earned);
  };

  const { Board } = mode;

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton icon="📋" onPress={onExit} />
        <IconButton icon="🔄" onPress={restart} />
        <Text style={styles.title}>레벨 {level.id}</Text>
        <TimerText timeLeft={timeLeft} />
      </View>
      <TimerBar timeLeft={timeLeft} timeLimit={level.timeLimit} />

      <Board key={attempt} level={level} disabled={result !== null} onSolved={handleSolved} />

      {result && (
        <ResultOverlay
          result={result}
          stars={stars}
          hasNext={hasNext}
          onNext={onNext}
          onRetry={restart}
          onExit={onExit}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  title: { flex: 1, fontSize: 26, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
});
