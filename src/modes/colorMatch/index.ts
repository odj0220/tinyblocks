import type { GameMode } from '../types';
import { ColorMatchBoard } from './ColorMatchBoard';
import { LEVELS } from './levels';
import type { Level } from './logic';

export const colorMatchMode: GameMode<Level> = {
  id: 'color-match',
  title: '색깔 잇기',
  emoji: '🔗',
  description: '같은 색끼리 이어요!',
  color: '#A5D6A7',
  levels: LEVELS,
  Board: ColorMatchBoard,
};
