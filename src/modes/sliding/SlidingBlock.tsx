import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { Block } from './logic';

type Props = {
  block: Block;
  cell: number;
  /** 지금 움직일 수 있는 칸 수 범위 */
  range: { min: number; max: number };
  color: string;
  emoji: string;
  disabled: boolean;
  onMove: (id: string, steps: number) => void;
};

const GAP = 4;
const SPRING = { damping: 18, stiffness: 220 };

export function SlidingBlock({ block, cell, range, color, emoji, disabled, onMove }: Props) {
  const horizontal = block.dir === 'h';
  const base = (horizontal ? block.col : block.row) * cell;
  const offset = useSharedValue(base);

  // 되돌리기/다시 하기로 위치가 바뀌면 그 자리로 미끄러져 간다
  useEffect(() => {
    offset.value = withSpring(base, SPRING);
  }, [base, offset]);

  const pan = Gesture.Pan()
    .runOnJS(true)
    .enabled(!disabled && (range.min < 0 || range.max > 0))
    .onUpdate((e) => {
      const moved = horizontal ? e.translationX : e.translationY;
      offset.value = Math.min(base + range.max * cell, Math.max(base + range.min * cell, base + moved));
    })
    .onEnd(() => {
      const steps = Math.round((offset.value - base) / cell);
      offset.value = withSpring(base + steps * cell, SPRING);
      if (steps !== 0) onMove(block.id, steps);
    });

  const animatedStyle = useAnimatedStyle(() =>
    horizontal
      ? { transform: [{ translateX: offset.value }, { translateY: block.row * cell }] }
      : { transform: [{ translateX: block.col * cell }, { translateY: offset.value }] },
  );

  const length = block.len * cell - GAP;
  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.block,
          {
            width: horizontal ? length : cell - GAP,
            height: horizontal ? cell - GAP : length,
            backgroundColor: color,
          },
          block.target && styles.target,
          animatedStyle,
        ]}
      >
        <Text style={{ fontSize: cell * 0.55 }}>{emoji}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  block: {
    position: 'absolute',
    left: GAP / 2,
    top: GAP / 2,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#00000022',
  },
  target: { borderColor: '#B71C1C' },
});
