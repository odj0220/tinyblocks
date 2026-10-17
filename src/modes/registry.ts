import { colorMatchMode } from './colorMatch';
import { colorSortMode } from './colorSort';
import { slidingMode } from './sliding';
import type { BaseLevel, GameMode, ModeInfo } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const MODES: GameMode<any>[] = [colorSortMode, slidingMode, colorMatchMode];

/** 홈에 "곧 나와요"로 보여줄 모드. 구현하면 MODES로 옮긴다 */
export const COMING_SOON: ModeInfo[] = [];

export function getMode(id: string | undefined): GameMode<BaseLevel> | undefined {
  return MODES.find((m) => m.id === id);
}
