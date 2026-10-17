import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';

import { COLOR_EMOJI, type Tube as TubeData } from './logic';

type Props = {
  tube: TubeData;
  capacity: number;
  selected: boolean;
  done: boolean;
  /** 잘못된 이동 시 흔들기 트리거 (값이 바뀔 때마다 흔들림) */
  shakeKey: number;
  onPress: () => void;
};

const BLOCK = 46;

export function Tube({ tube, capacity, selected, done, shakeKey, onPress }: Props) {
  const lift = useSharedValue(0);
  const shake = useSharedValue(0);

  useEffect(() => {
    lift.value = withSpring(selected ? -24 : 0);
  }, [selected, lift]);

  useEffect(() => {
    if (shakeKey === 0) return;
    shake.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  }, [shakeKey, shake]);

  const topStyle = useAnimatedStyle(() => ({ transform: [{ translateY: lift.value }] }));
  const tubeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  return (
    <Pressable onPress={onPress} hitSlop={8}>
      <Animated.View
        style={[
          styles.tube,
          { height: capacity * BLOCK + 16 },
          selected && styles.selected,
          done && styles.done,
          tubeStyle,
        ]}
      >
        {tube.map((color, i) => {
          const isTop = i === tube.length - 1;
          return (
            <Animated.View key={i} style={[styles.block, isTop && topStyle]}>
              <Text style={styles.emoji}>{COLOR_EMOJI[color]}</Text>
            </Animated.View>
          );
        })}
      </Animated.View>
      {done && <Text style={styles.star}>⭐</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tube: {
    width: BLOCK + 14,
    borderWidth: 4,
    borderTopWidth: 0,
    borderColor: '#B9C6D8',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: '#FFFFFFAA',
    flexDirection: 'column-reverse',
    alignItems: 'center',
    paddingVertical: 6,
  },
  selected: { borderColor: '#FFB300' },
  done: { borderColor: '#66BB6A' },
  block: { width: BLOCK, height: BLOCK, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 38, lineHeight: 44 },
  star: { position: 'absolute', top: -30, alignSelf: 'center', fontSize: 22 },
});
