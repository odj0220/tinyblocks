import type { BaseLevel } from '../types';

export type Block = {
  id: string;
  row: number;
  col: number;
  len: number;
  /** h: 좌우로만, v: 위아래로만 움직인다 */
  dir: 'h' | 'v';
  /** 출구까지 빼내야 하는 블록 (항상 가로) */
  target?: boolean;
};

export type Level = BaseLevel & {
  size: number;
  /** 솔버로 구한 최소 이동 수 (한 번 끌기 = 1수) */
  minMoves: number;
  blocks: Block[];
};

function cells(block: Block): [number, number][] {
  return Array.from({ length: block.len }, (_, k) =>
    block.dir === 'h' ? [block.row, block.col + k] : [block.row + k, block.col],
  );
}

function isFree(blocks: Block[], size: number, row: number, col: number, skipId: string): boolean {
  if (row < 0 || col < 0 || row >= size || col >= size) return false;
  return !blocks.some((b) => b.id !== skipId && cells(b).some(([r, c]) => r === row && c === col));
}

/** 블록이 지금 위치에서 움직일 수 있는 칸 수 범위. min은 0 이하, max는 0 이상 */
export function moveRange(blocks: Block[], size: number, block: Block): { min: number; max: number } {
  const step = (d: number) =>
    block.dir === 'h'
      ? isFree(blocks, size, block.row, d < 0 ? block.col + d : block.col + block.len - 1 + d, block.id)
      : isFree(blocks, size, d < 0 ? block.row + d : block.row + block.len - 1 + d, block.col, block.id);
  let min = 0;
  while (step(min - 1)) min--;
  let max = 0;
  while (step(max + 1)) max++;
  return { min, max };
}

export function moveBlock(blocks: Block[], id: string, steps: number): Block[] {
  return blocks.map((b) =>
    b.id !== id ? b : b.dir === 'h' ? { ...b, col: b.col + steps } : { ...b, row: b.row + steps },
  );
}

/** 목표 블록이 오른쪽 끝(출구)에 닿으면 클리어 */
export function isSolved(blocks: Block[], size: number): boolean {
  const target = blocks.find((b) => b.target);
  return target !== undefined && target.col + target.len === size;
}
