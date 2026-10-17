import type { GameMode } from '../types';
import { LEVELS } from './levels';
import type { Level } from './logic';
import { SlidingBoard } from './SlidingBoard';

export const slidingMode: GameMode<Level> = {
  id: 'sliding',
  title: '블록 밀기',
  emoji: '🚗',
  description: '블록을 밀어 길을 만들어요!',
  color: '#81D4FA',
  levels: LEVELS,
  Board: SlidingBoard,
};
