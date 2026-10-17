import type { ComponentType } from 'react';

/** 모든 모드의 레벨이 공통으로 갖는 필드 */
export type BaseLevel = {
  id: number;
  /** 제한시간(초) */
  timeLimit: number;
};

/** 공통 게임 화면(GameScreen)이 각 모드의 보드에 넘겨주는 props */
export type BoardProps<L extends BaseLevel> = {
  level: L;
  /** 클리어/시간초과 후에는 입력을 막는다 */
  disabled: boolean;
  onSolved: () => void;
};

export type ModeInfo = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
};

/** 새 모드는 이 형태로 만들어 registry에 등록하면 홈/레벨 선택/게임 화면이 자동으로 붙는다 */
export type GameMode<L extends BaseLevel> = ModeInfo & {
  levels: L[];
  Board: ComponentType<BoardProps<L>>;
};
