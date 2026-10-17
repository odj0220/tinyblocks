import { useCallback, useEffect, useState } from 'react';

/** running 동안 1초씩 줄어드는 타이머. 0에서 멈춘다 */
export function useCountdown(seconds: number, running: boolean) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = useCallback(() => setTimeLeft(seconds), [seconds]);

  return { timeLeft, reset };
}
