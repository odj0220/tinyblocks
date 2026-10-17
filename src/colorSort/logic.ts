export type Color = 'R' | 'Y' | 'B' | 'G' | 'P' | 'O';
/** 각 튜브는 아래 → 위 순서의 블록 배열 */
export type Tube = Color[];

export type Level = {
  id: number;
  capacity: number;
  timeLimit: number;
  tubes: Tube[];
};

export const COLOR_EMOJI: Record<Color, string> = {
  R: '🟥',
  Y: '🟨',
  B: '🟦',
  G: '🟩',
  P: '🟪',
  O: '🟧',
};

export function canMove(tubes: Tube[], from: number, to: number, capacity: number): boolean {
  if (from === to) return false;
  const src = tubes[from];
  const dst = tubes[to];
  if (src.length === 0 || dst.length >= capacity) return false;
  return dst.length === 0 || dst[dst.length - 1] === src[src.length - 1];
}

/** 맨 위 블록 1개를 옮긴 새 튜브 배열을 반환 */
export function move(tubes: Tube[], from: number, to: number): Tube[] {
  const next = tubes.map((t) => [...t]);
  next[to].push(next[from].pop()!);
  return next;
}

export function isTubeDone(tube: Tube, capacity: number): boolean {
  return tube.length === capacity && tube.every((c) => c === tube[0]);
}

export function isSolved(tubes: Tube[], capacity: number): boolean {
  return tubes.every((t) => t.length === 0 || isTubeDone(t, capacity));
}

/** 남은 시간 비율로 별 1~3개 */
export function starsFor(timeLeft: number, timeLimit: number): number {
  const ratio = timeLeft / timeLimit;
  if (ratio >= 0.5) return 3;
  if (ratio >= 0.25) return 2;
  return 1;
}
