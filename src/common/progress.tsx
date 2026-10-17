import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

/** modeId → levelId → 획득한 별 개수 */
type Stars = Record<string, Record<number, number>>;

type Progress = {
  getStars: (modeId: string, levelId: number) => number;
  recordStars: (modeId: string, levelId: number, stars: number) => void;
};

const ProgressContext = createContext<Progress | null>(null);

// 지금은 메모리에만 저장한다. 앱을 꺼도 남게 하려면 여기서 AsyncStorage 등에 저장/복원하면 된다
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [stars, setStars] = useState<Stars>({});

  const getStars = useCallback((modeId: string, levelId: number) => stars[modeId]?.[levelId] ?? 0, [stars]);

  const recordStars = useCallback((modeId: string, levelId: number, earned: number) => {
    setStars((s) => {
      const mode = s[modeId] ?? {};
      return { ...s, [modeId]: { ...mode, [levelId]: Math.max(mode[levelId] ?? 0, earned) } };
    });
  }, []);

  const value = useMemo(() => ({ getStars, recordStars }), [getStars, recordStars]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): Progress {
  const progress = useContext(ProgressContext);
  if (!progress) throw new Error('useProgress must be used inside ProgressProvider');
  return progress;
}
