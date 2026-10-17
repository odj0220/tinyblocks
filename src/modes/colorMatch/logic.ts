import type { BaseLevel } from '../types';

export type Color = 'R' | 'B' | 'Y' | 'G' | 'P' | 'O';
/** [행, 열] */
export type Cell = [number, number];

export type Dot = { color: Color; a: Cell; b: Cell };

export type Level = BaseLevel & {
  size: number;
  dots: Dot[];
};

/** 색마다 그린 선. 첫 칸은 항상 그 색의 점 중 하나 */
export type Paths = Partial<Record<Color, Cell[]>>;

export const COLOR_EMOJI: Record<Color, string> = { R: '🔴', B: '🔵', Y: '🟡', G: '🟢', P: '🟣', O: '🟠' };
export const COLOR_HEX: Record<Color, string> = {
  R: '#E53935',
  B: '#1E88E5',
  Y: '#FDD835',
  G: '#43A047',
  P: '#8E24AA',
  O: '#FB8C00',
};

const same = (x: Cell, y: Cell) => x[0] === y[0] && x[1] === y[1];
const adjacent = (x: Cell, y: Cell) => Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]) === 1;

export function dotAt(level: Level, cell: Cell): Color | undefined {
  return level.dots.find((d) => same(d.a, cell) || same(d.b, cell))?.color;
}

function pathOwner(paths: Paths, cell: Cell): Color | undefined {
  return (Object.keys(paths) as Color[]).find((color) => paths[color]!.some((p) => same(p, cell)));
}

export function isConnected(level: Level, color: Color, path: Cell[] | undefined): boolean {
  const dot = level.dots.find((d) => d.color === color);
  if (!dot || !path || path.length < 2) return false;
  const [first, last] = [path[0], path[path.length - 1]];
  return (same(first, dot.a) && same(last, dot.b)) || (same(first, dot.b) && same(last, dot.a));
}

export function isSolved(level: Level, paths: Paths): boolean {
  return level.dots.every((d) => isConnected(level, d.color, paths[d.color]));
}

/**
 * 손가락을 댄 칸에서 선 긋기를 시작한다.
 * 점을 누르면 그 색 선을 새로 시작하고, 이미 그린 선 위를 누르면 거기까지 잘라서 이어 그린다.
 */
export function startStroke(level: Level, paths: Paths, cell: Cell): { paths: Paths; color: Color } | null {
  const dot = dotAt(level, cell);
  if (dot) return { paths: { ...paths, [dot]: [cell] }, color: dot };
  const owner = pathOwner(paths, cell);
  if (!owner) return null;
  const path = paths[owner]!;
  return { paths: { ...paths, [owner]: path.slice(0, path.findIndex((p) => same(p, cell)) + 1) }, color: owner };
}

/** 선을 옆 칸으로 한 칸 늘린다. 못 가는 칸이면 그대로 돌려준다 */
export function extendStroke(level: Level, paths: Paths, color: Color, cell: Cell): Paths {
  const path = paths[color];
  if (!path) return paths;
  const last = path[path.length - 1];
  if (same(last, cell) || !adjacent(last, cell)) return paths;

  // 자기 선으로 되돌아가면 거기까지 지운다
  const back = path.findIndex((p) => same(p, cell));
  if (back >= 0) return { ...paths, [color]: path.slice(0, back + 1) };

  // 이미 반대쪽 점에 닿았으면 더 늘리지 않는다
  if (isConnected(level, color, path)) return paths;

  const dot = dotAt(level, cell);
  if (dot && dot !== color) return paths;
  if (pathOwner(paths, cell)) return paths;

  return { ...paths, [color]: [...path, cell] };
}
