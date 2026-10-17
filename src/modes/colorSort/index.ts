import type { GameMode } from '../types';
import { ColorSortBoard } from './ColorSortBoard';
import { LEVELS } from './levels';
import type { Level } from './logic';

export const colorSortMode: GameMode<Level> = {
  id: 'color-sort',
  title: '색깔 모으기',
  emoji: '🧪',
  description: '같은 색끼리 모아요!',
  color: '#FFD54F',
  levels: LEVELS,
  Board: ColorSortBoard,
};
