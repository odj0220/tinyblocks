import { useRef, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import { BigButton } from '../../common/BigButton';
import type { BoardProps } from '../types';
import {
  COLOR_EMOJI,
  COLOR_HEX,
  extendStroke,
  isConnected,
  isSolved,
  startStroke,
  type Cell,
  type Color,
  type Level,
  type Paths,
} from './logic';

export function ColorMatchBoard({ level, disabled, onSolved }: BoardProps<Level>) {
  const [paths, setPaths] = useState<Paths>({});
  const [history, setHistory] = useState<Paths[]>([]);
  // 제스처 콜백은 매 프레임 불리므로 최신 값은 ref로 들고 있는다
  const pathsRef = useRef<Paths>({});
  const colorRef = useRef<Color | null>(null);
  const { width } = useWindowDimensions();
  const cell = Math.floor(Math.min(width - 32, 420) / level.size);
  const boardSize = cell * level.size;

  const update = (next: Paths) => {
    pathsRef.current = next;
    setPaths(next);
  };

  const cellAt = (x: number, y: number): Cell | null => {
    const r = Math.floor(y / cell);
    const c = Math.floor(x / cell);
    return r >= 0 && c >= 0 && r < level.size && c < level.size ? [r, c] : null;
  };

  const pan = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .enabled(!disabled)
    .onStart((e) => {
      const target = cellAt(e.x, e.y);
      const started = target && startStroke(level, pathsRef.current, target);
      if (!started) return;
      setHistory((h) => [...h, pathsRef.current]);
      colorRef.current = started.color;
      update(started.paths);
    })
    .onUpdate((e) => {
      const color = colorRef.current;
      const target = cellAt(e.x, e.y);
      if (!color || !target) return;
      // 손가락이 빨라 칸을 건너뛰면 한 칸씩 따라가며 잇는다
      let next = pathsRef.current;
      for (let i = 0; i < level.size * 2; i++) {
        const path = next[color]!;
        const [r, c] = path[path.length - 1];
        if (r === target[0] && c === target[1]) break;
        const dr = target[0] - r;
        const dc = target[1] - c;
        const step: Cell = Math.abs(dr) >= Math.abs(dc) ? [r + Math.sign(dr), c] : [r, c + Math.sign(dc)];
        const extended = extendStroke(level, next, color, step);
        if (extended === next) break;
        next = extended;
      }
      if (next !== pathsRef.current) update(next);
    })
    .onEnd(() => {
      if (isSolved(level, pathsRef.current)) onSolved();
    })
    .onFinalize(() => {
      // 제스처가 중간에 취소돼도 다음 터치가 이전 색을 이어 그리지 않게 한다
      colorRef.current = null;
    });

  const undo = () => {
    if (disabled || history.length === 0) return;
    update(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  const thick = cell * 0.36;

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <GestureDetector gesture={pan}>
          <View style={[styles.board, { width: boardSize, height: boardSize }]}>
            {Array.from({ length: level.size * level.size }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.cell,
                  {
                    width: cell - 4,
                    height: cell - 4,
                    left: (i % level.size) * cell + 2,
                    top: Math.floor(i / level.size) * cell + 2,
                  },
                ]}
              />
            ))}

            {(Object.keys(paths) as Color[]).map((color) => {
              const path = paths[color]!;
              const opacity = isConnected(level, color, path) ? 1 : 0.6;
              return path.map(([r, c], i) => {
                const prev = path[i - 1];
                return (
                  <View key={`${color}-${i}`} pointerEvents="none">
                    <View
                      style={[
                        styles.joint,
                        {
                          width: thick,
                          height: thick,
                          borderRadius: thick / 2,
                          left: c * cell + (cell - thick) / 2,
                          top: r * cell + (cell - thick) / 2,
                          backgroundColor: COLOR_HEX[color],
                          opacity,
                        },
                      ]}
                    />
                    {prev && (
                      <View
                        style={[
                          styles.joint,
                          {
                            // 이전 칸 중심과 이번 칸 중심을 잇는 막대
                            left: Math.min(prev[1], c) * cell + (cell - thick) / 2,
                            top: Math.min(prev[0], r) * cell + (cell - thick) / 2,
                            width: prev[0] === r ? cell + thick : thick,
                            height: prev[0] === r ? thick : cell + thick,
                            backgroundColor: COLOR_HEX[color],
                            opacity,
                          },
                        ]}
                      />
                    )}
                  </View>
                );
              });
            })}

            {level.dots.flatMap((dot) =>
              [dot.a, dot.b].map(([r, c], i) => (
                <Text
                  key={`${dot.color}-dot-${i}`}
                  pointerEvents="none"
                  style={[
                    styles.dot,
                    { left: c * cell, top: r * cell, width: cell, height: cell, fontSize: cell * 0.6, lineHeight: cell },
                  ]}
                >
                  {COLOR_EMOJI[dot.color]}
                </Text>
              )),
            )}
          </View>
        </GestureDetector>
        <Text style={styles.hint}>같은 색 동그라미를 선으로 이어요!</Text>
      </View>
      <View style={styles.footer}>
        <BigButton label="↩️ 되돌리기" onPress={undo} disabled={history.length === 0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  board: { backgroundColor: '#B0BEC5', borderRadius: 16 },
  cell: { position: 'absolute', backgroundColor: '#ECEFF1', borderRadius: 10 },
  joint: { position: 'absolute' },
  dot: { position: 'absolute', textAlign: 'center' },
  hint: { fontSize: 20, fontWeight: '700', color: '#37474F', marginTop: 20 },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 16 },
});
