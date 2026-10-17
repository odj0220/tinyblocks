import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from './theme';

type Props = {
  timeLeft: number;
  timeLimit: number;
};

const URGENT_SECONDS = 10;

export function TimerText({ timeLeft }: { timeLeft: number }) {
  return <Text style={[styles.text, timeLeft <= URGENT_SECONDS && styles.urgentText]}>⏰ {timeLeft}</Text>;
}

export function TimerBar({ timeLeft, timeLimit }: Props) {
  const urgent = timeLeft <= URGENT_SECONDS;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${(timeLeft / timeLimit) * 100}%` }, urgent && styles.urgentFill]} />
    </View>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 24, fontWeight: '800', color: COLORS.text, minWidth: 80, textAlign: 'right' },
  urgentText: { color: COLORS.danger },
  track: { height: 12, borderRadius: 6, backgroundColor: COLORS.track, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.success },
  urgentFill: { backgroundColor: COLORS.danger },
});
