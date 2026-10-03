import { useEffect, useState, type ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, MaxContentWidth } from '@/constants/theme';
import {
  addEntry,
  getLocalDate,
  loadEntries,
  MUSCLE_GROUPS,
  totalForDate,
  totalsForDate,
  type MuscleId,
  type WorkoutEntry,
} from '@/data/gym-storage';

const keypadRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['✓', '0', '⌫'],
];
const primaryMuscles: MuscleId[] = ['arm', 'chest', 'leg', 'back', 'shoulder'];
const muscleIcons: Record<MuscleId, number> = {
  arm: require('@/assets/icon/muscles/bicep.png'),
  shoulder: require('@/assets/icon/muscles/shoulder.png'),
  chest: require('@/assets/icon/muscles/front.png'),
  back: require('@/assets/icon/muscles/back.png'),
  leg: require('@/assets/icon/muscles/gym.png'),
  triceps: require('@/assets/icon/muscles/bicep.png'),
  other: require('@/assets/icon/muscles/app.png'),
};

export default function HomeScreen() {
  const { height: windowHeight } = useWindowDimensions();
  const [input, setInput] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const date = getLocalDate();
  const totals = totalsForDate(entries, date);
  const actionHeight = Math.min(480, Math.max(350, windowHeight * 0.58));

  useEffect(() => {
    loadEntries().then(setEntries);
  }, []);

  function pressKey(key: string) {
    if (key === '✓') return setConfirmed(true);
    if (key === '⌫') {
      setConfirmed(false);
      return setInput((value) => value.slice(0, -1));
    }
    setConfirmed(false);
    if (input.length < 3) setInput((value) => (value === '0' ? key : value + key));
  }

  async function assign(muscleId: MuscleId) {
    const reps = Number(input);
    if (!Number.isInteger(reps) || reps < 1 || reps > 999) return;
    const entry = await addEntry(muscleId, reps);
    setEntries((current) => [...current, entry]);
    setInput('');
    setConfirmed(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <View style={styles.summaryList}>
            {primaryMuscles.map((muscleId) => {
              const muscle = MUSCLE_GROUPS.find((item) => item.id === muscleId)!;
              return (
                <View key={muscle.id} style={styles.summaryRow}>
                  <Image source={muscleIcons[muscle.id]} style={styles.summaryIcon} resizeMode="contain" />
                  <TextLabel style={styles.summaryName}>{muscle.name}</TextLabel>
                  <TextLabel style={styles.summaryReps}>{totals[muscle.id]}</TextLabel>
                </View>
              );
            })}
          </View>
          <View style={styles.totalPanel}>
            <TextLabel style={styles.date}>{formatDate(date)}</TextLabel>
            <TextLabel style={styles.totalNumber}>{totalForDate(entries, date)}</TextLabel>
            <TextLabel style={styles.totalLabel}>TOTAL REPS</TextLabel>
            <View style={styles.inputPanel}>
              <TextLabel style={styles.inputCaption}>CURRENT INPUT</TextLabel>
              <TextLabel style={styles.inputValue}>{input || '0'}</TextLabel>
              <TextLabel style={styles.inputHint}>
                {input ? (confirmed ? 'Ready to assign' : 'Tap a muscle to record') : 'Enter reps'}
              </TextLabel>
            </View>
          </View>
        </View>

        <View style={[styles.actionGrid, { height: actionHeight }]}>
          <View style={styles.keypad}>
            {keypadRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.keypadRow}>
                {row.map((key) => (
                  <Pressable
                    key={key}
                    accessibilityRole="button"
                    accessibilityLabel={key === '✓' ? 'Confirm reps' : key === '⌫' ? 'Delete last digit' : key}
                    onPress={() => pressKey(key)}
                    onLongPress={key === '⌫' ? () => { setInput(''); setConfirmed(false); } : undefined}
                    style={({ pressed }) => [styles.key, pressed && styles.pressed]}>
                    <TextLabel style={[styles.keyText, key === '✓' && styles.confirmText]}>{key}</TextLabel>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
          <View style={styles.muscleActions}>
            {primaryMuscles.map((muscleId) => {
              const muscle = MUSCLE_GROUPS.find((item) => item.id === muscleId)!;
              return (
                <Pressable
                  key={muscle.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Add ${input || 0} reps to ${muscle.name}`}
                  onPress={() => assign(muscle.id)}
                  style={({ pressed }) => [styles.muscleAction, pressed && styles.musclePressed]}>
                  <Image source={muscleIcons[muscle.id]} style={styles.actionIcon} resizeMode="contain" />
                  <TextLabel style={styles.muscleName}>{muscle.name}</TextLabel>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TextLabel({ children, style }: { children: ReactNode; style?: object }) {
  return <Text style={style}>{children}</Text>;
}

function formatDate(date: string) {
  const [year, month, day] = date.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  content: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', flexGrow: 1, padding: 12, paddingBottom: 12 },
  summary: { flexDirection: 'row', minHeight: 164, marginBottom: 10, gap: 8 },
  summaryList: { flex: 1.1, justifyContent: 'center', gap: 2 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', minHeight: 22, gap: 6 },
  summaryIcon: { width: 20, height: 20 },
  summaryName: { flex: 1, color: Colors.light.ink, fontSize: 12, fontWeight: '600' },
  summaryReps: { color: Colors.light.ink, fontSize: 15, fontWeight: '800' },
  totalPanel: { flex: 0.9, alignItems: 'flex-end', justifyContent: 'center' },
  date: { color: Colors.light.muted, fontSize: 12, fontWeight: '600', textAlign: 'right' },
  totalNumber: { color: '#E53935', fontSize: 46, lineHeight: 52, fontWeight: '900', marginTop: 6 },
  totalLabel: { color: Colors.light.muted, fontSize: 9, fontWeight: '800' },
  inputPanel: { width: '100%', backgroundColor: Colors.light.ink, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8, alignItems: 'center', marginTop: 6 },
  inputCaption: { color: '#A5ADA8', fontSize: 8, fontWeight: '800' },
  inputValue: { color: Colors.light.white, fontSize: 25, lineHeight: 28, fontWeight: '800' },
  inputHint: { color: '#A5ADA8', fontSize: 8, textAlign: 'center' },
  actionGrid: { flexDirection: 'row', gap: 8, alignItems: 'stretch' },
  keypad: { flex: 1.55, justifyContent: 'space-between', gap: 5 },
  keypadRow: { flex: 1, flexDirection: 'row', gap: 4 },
  key: { flex: 1, aspectRatio: 1, backgroundColor: '#F0F1EC', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  keyText: { color: Colors.light.ink, fontSize: 20, fontWeight: '700' },
  confirmText: { color: '#2D7D46' },
  pressed: { opacity: 0.65, transform: [{ scale: 0.97 }] },
  muscleActions: { flex: 0.65, justifyContent: 'center', gap: 8 },
  muscleAction: { height: 48, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 6, backgroundColor: '#E4F0E5', borderRadius: 7 },
  actionIcon: { width: 16, height: 16 },
  musclePressed: { backgroundColor: '#CDE5D0', transform: [{ scale: 0.98 }] },
  muscleName: { color: Colors.light.ink, fontSize: 11, fontWeight: '700' },
});
