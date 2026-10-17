import { colorSortMode } from './colorSort';
import type { BaseLevel, GameMode, ModeInfo } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MODES: GameMode<any>[] = [colorSortMode];

/** 홈에 "곧 나와요"로 보여줄 모드. 구현하면 MODES로 옮긴다 */
export const COMING_SOON: ModeInfo[] = [
  { id: 'sliding', title: '블록 밀기', emoji: '🚗', description: '블록을 밀어 길을 만들어요!', color: '#81D4FA' },
  { id: 'color-match', title: '색깔 잇기', emoji: '🔗', description: '같은 색끼리 이어요!', color: '#A5D6A7' },
];

export function getMode(id: string | undefined): GameMode<BaseLevel> | undefined {
  return MODES.find((m) => m.id === id);
}
