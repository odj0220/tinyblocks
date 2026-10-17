import { useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { BigButton } from '../../common/BigButton';
import type { BoardProps } from '../types';
import { isSolved, moveBlock, moveRange, type Block, type Level } from './logic';
import { SlidingBlock } from './SlidingBlock';

const PALETTE = ['#81D4FA', '#FFD54F', '#A5D6A7', '#CE93D8', '#FFAB91', '#90CAF9', '#FFF59D', '#80CBC4'];
const CARS = ['🚕', '🚙', '🚓', '🚐'];
const TRUCKS = ['🚌', '🚚'];
const TARGET_COLOR = '#EF5350';

function looksFor(block: Block, index: number) {
  if (block.target) return { color: TARGET_COLOR, emoji: '🚗' };
  return {
    color: PALETTE[index % PALETTE.length],
    emoji: block.len === 3 ? TRUCKS[index % TRUCKS.length] : CARS[index % CARS.length],
  };
}

export function SlidingBoard({ level, disabled, onSolved }: BoardProps<Level>) {
  const [blocks, setBlocks] = useState<Block[]>(level.blocks);
  const [history, setHistory] = useState<Block[][]>([]);
  const { width } = useWindowDimensions();
  // 오른쪽 출구 표시 자리를 남기고 화면에 맞춘다
  const cell = Math.floor(Math.min(width - 72, 420) / level.size);
  const boardSize = cell * level.size;
  const targetRow = level.blocks.find((b) => b.target)?.row ?? 0;

  const handleMove = (id: string, steps: number) => {
    const next = moveBlock(blocks, id, steps);
    setHistory((h) => [...h, blocks]);
    setBlocks(next);
    if (isSolved(next, level.size)) onSolved();
  };

  const undo = () => {
    if (disabled || history.length === 0) return;
    setBlocks(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <View style={styles.row}>
          <View style={[styles.board, { width: boardSize, height: boardSize }]}>
            {Array.from({ length: level.size * level.size }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.cell,
                  { width: cell - 4, height: cell - 4, left: (i % level.size) * cell + 2, top: Math.floor(i / level.size) * cell + 2 },
                ]}
              />
            ))}
            {blocks.map((block, i) => {
              const { color, emoji } = looksFor(block, i);
              return (
                <SlidingBlock
                  key={block.id}
                  block={block}
                  cell={cell}
                  range={moveRange(blocks, level.size, block)}
                  color={color}
                  emoji={emoji}
                  disabled={disabled}
                  onMove={handleMove}
                />
              );
            })}
          </View>
          <Text style={[styles.exit, { marginTop: targetRow * cell + cell * 0.2, fontSize: cell * 0.5 }]}>🏁</Text>
        </View>
        <Text style={styles.hint}>🚗를 🏁까지 보내요!</Text>
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
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  board: { backgroundColor: '#B0BEC5', borderRadius: 16 },
  cell: { position: 'absolute', backgroundColor: '#CFD8DC', borderRadius: 10 },
  exit: { marginLeft: 6 },
  hint: { fontSize: 20, fontWeight: '700', color: '#37474F', marginTop: 20 },
  footer: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 16 },
});
