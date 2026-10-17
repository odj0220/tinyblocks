import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BigButton } from '../../common/BigButton';
import type { BoardProps } from '../types';
import { canMove, isSolved, isTubeDone, move, type Level, type Tube as TubeData } from './logic';
import { Tube } from './Tube';

export function ColorSortBoard({ level, disabled, onSolved }: BoardProps<Level>) {
  const [tubes, setTubes] = useState<TubeData[]>(level.tubes);
  const [history, setHistory] = useState<TubeData[][]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [shakeKeys, setShakeKeys] = useState<number[]>(() => level.tubes.map(() => 0));

  const handlePress = (index: number) => {
    if (disabled) return;
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
    if (isSolved(next, level.capacity)) onSolved();
  };

  const undo = () => {
    if (disabled || history.length === 0) return;
    setTubes(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    setSelected(null);
  };

  return (
    <View style={styles.container}>
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
        <BigButton label="↩️ 되돌리기" onPress={undo} disabled={history.length === 0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  board: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    columnGap: 14,
    rowGap: 48,
  },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 16 },
});
