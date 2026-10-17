import { Redirect, router, useLocalSearchParams } from 'expo-router';

import { GameScreen } from '../../common/GameScreen';
import { getMode } from '../../modes/registry';

export default function PlayScreen() {
  const params = useLocalSearchParams<{ mode: string; level: string }>();
  const mode = getMode(params.mode);
  const index = mode?.levels.findIndex((l) => l.id === Number(params.level)) ?? -1;

  if (!mode || index < 0) return <Redirect href="/" />;

  const level = mode.levels[index];
  const next = mode.levels[index + 1];

  return (
    <GameScreen
      key={`${mode.id}-${level.id}`}
      mode={mode}
      level={level}
      hasNext={next !== undefined}
      onNext={() => router.replace(`/${mode.id}/${next.id}`)}
      onExit={() => router.back()}
    />
  );
}
