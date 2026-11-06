import { useEffect, useState, type ReactNode } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, MaxContentWidth, WebTabInset } from '@/constants/theme';
import {
  addEntry,
  deleteEntry,
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
  const [lastAddedEntry, setLastAddedEntry] = useState<WorkoutEntry | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [undoing, setUndoing] = useState(false);
  const date = getLocalDate();
  const totals = totalsForDate(entries, date);
  const actionHeight = Math.min(360, Math.max(240, windowHeight * 0.4));
  const summaryHeight = Math.min(220, Math.max(164, windowHeight * 0.3));

  useEffect(() => {
    loadEntries()
      .then(setEntries)
      .catch(() => setActionError('Could not load workout entries.'));
  }, []);

  function pressKey(key: string) {
    if (key === '✓') return setConfirmed(true);
    if (key === '⌫') {
      setConfirmed(false);
      if (!input && lastAddedEntry) {
        void undoLastEntry();
        return;
      }
      return setInput((value) => value.slice(0, -1));
    }
    setConfirmed(false);
    if (input.length < 3) {
      setLastAddedEntry(null);
      setActionError(null);
      setInput((value) => (value === '0' ? key : value + key));
    }
  }

  async function undoLastEntry() {
    if (!lastAddedEntry || undoing) return;
    setUndoing(true);
    setActionError(null);
    try {
      await deleteEntry(lastAddedEntry.id);
      setEntries((current) => current.filter((entry) => entry.id !== lastAddedEntry.id));
      setInput(String(lastAddedEntry.reps));
      setConfirmed(false);
      setLastAddedEntry(null);
    } catch {
      setActionError('Could not undo last entry. Please try again.');
    } finally {
      setUndoing(false);
    }
  }

  async function assign(muscleId: MuscleId) {
    const reps = Number(input);
    if (!Number.isInteger(reps) || reps < 1 || reps > 999) return;
    setActionError(null);
    try {
      const entry = await addEntry(muscleId, reps);
      setEntries((current) => [...current, entry]);
      setLastAddedEntry(entry);
      setInput('');
      setConfirmed(false);
    } catch {
      setActionError('Could not save reps. Please try again.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.summary, { minHeight: summaryHeight }]}>
          <View style={styles.summaryList}>
            {primaryMuscles.map((muscleId) => {
              const muscle = MUSCLE_GROUPS.find((item) => item.id === muscleId)!;
              return (
                <View
                  key={muscle.id}
                  accessible
                  accessibilityLabel={`${muscle.name}, ${totals[muscle.id]} reps`}
                  style={styles.summaryRow}>
                  <Image source={muscleIcons[muscle.id]} style={styles.summaryIcon} resizeMode="contain" />
                  <TextLabel style={styles.summaryReps}>{totals[muscle.id]}</TextLabel>
                </View>
              );
            })}
          </View>
          <View style={styles.totalPanel}>
            <TextLabel style={styles.date}>{formatDate(date)}</TextLabel>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.5}
              style={[
                styles.totalNumber,
                { color: totalForDate(entries, date) < 500 ? '#E53935' : '#7CB342' },
              ]}>
              {totalForDate(entries, date)}
            </Text>
            <TextLabel style={styles.totalLabel}>TOTAL REPS</TextLabel>
          </View>
        </View>

        <View style={styles.actionSection}>
          <View style={styles.inputReadout}>
            <TextLabel style={styles.inputHint}>
              {input
                ? (confirmed ? 'READY TO ASSIGN' : 'REPS')
                : lastAddedEntry
                  ? 'WRONG GROUP? TAP ⌫ TO UNDO'
                  : 'ENTER REPS'}
            </TextLabel>
            <TextLabel accessibilityLiveRegion="polite" style={styles.inputValue}>
              {input || '0'}
            </TextLabel>
          </View>
          {actionError && <TextLabel style={styles.actionError}>{actionError}</TextLabel>}

          <View style={[styles.actionGrid, { height: actionHeight }]}>
            <View style={styles.keypad}>
              {keypadRows.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.keypadRow}>
                  {row.map((key, columnIndex) => (
                    <Pressable
                      key={key}
                      accessibilityRole="button"
                      accessibilityLabel={
                        key === '✓'
                          ? 'Confirm reps'
                          : key === '⌫'
                            ? !input && lastAddedEntry
                              ? 'Undo last entry'
                              : 'Delete last digit'
                            : key
                      }
                      disabled={undoing}
                      onPress={() => pressKey(key)}
                      onLongPress={key === '⌫' ? () => { setInput(''); setConfirmed(false); } : undefined}
                      style={({ pressed }) => [
                        styles.key,
                        rowIndex < keypadRows.length - 1 && styles.keyBottomBorder,
                        columnIndex < row.length - 1 && styles.keyRightBorder,
                        pressed && styles.keyPressed,
                      ]}>
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
                    disabled={undoing}
                    onPress={() => assign(muscle.id)}
                    style={({ pressed }) => [styles.muscleAction, pressed && styles.musclePressed]}>
                    <Image source={muscleIcons[muscle.id]} style={styles.actionIcon} resizeMode="contain" />
                    <TextLabel style={styles.muscleName}>{muscle.name}</TextLabel>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TextLabel({
  children,
  style,
  accessibilityLiveRegion,
}: {
  children: ReactNode;
  style?: object;
  accessibilityLiveRegion?: 'none' | 'polite' | 'assertive';
}) {
  return (
    <Text accessibilityLiveRegion={accessibilityLiveRegion} style={style}>
      {children}
    </Text>
  );
}

function formatDate(date: string) {
  const [year, month, day] = date.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  content: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', flexGrow: 1, justifyContent: 'space-between', padding: 12, paddingBottom: 12 + WebTabInset },
  summary: { flexDirection: 'row', marginBottom: 8, gap: 8 },
  summaryList: { flex: 1, justifyContent: 'center', gap: 6 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', minHeight: 32, gap: 10, paddingHorizontal: 4 },
  summaryIcon: { width: 45, height: 45 },
  summaryReps: { color: Colors.light.ink, fontSize: 25, lineHeight: 28, fontWeight: '900' },
  totalPanel: { flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 16 },
  date: { color: Colors.light.muted, fontSize: 20, fontWeight: '600', textAlign: 'right' },
  totalNumber: { width: '100%', fontSize: 100, lineHeight: 112, fontWeight: '900', marginTop: 8, textAlign: 'right' },
  totalLabel: { color: Colors.light.muted, fontSize: 20, fontWeight: '800' },
  actionSection: { width: '100%' },
  actionGrid: { flexDirection: 'row', gap: 10, alignItems: 'stretch' },
  inputReadout: { height: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, marginBottom: 2 },
  inputHint: { color: Colors.light.muted, fontSize: 15, fontWeight: '800' },
  inputValue: { color: Colors.light.ink, fontSize: 30, lineHeight: 28, fontWeight: '800' },
  actionError: { color: '#B3261E', fontSize: 12, paddingHorizontal: 8, marginBottom: 4 },
  keypad: { flex: 1.55, borderWidth: StyleSheet.hairlineWidth, borderColor: '#D8DDD8', overflow: 'hidden', flexDirection: 'column' },
  keypadRow: { flex: 1, flexDirection: 'row' },
  key: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light.background },
  keyBottomBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#D8DDD8' },
  keyRightBorder: { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: '#D8DDD8' },
  keyText: { color: Colors.light.ink, fontSize: 30, fontWeight: '700' },
  confirmText: { color: '#2D7D46' },
  keyPressed: { opacity: 0.65, backgroundColor: '#E7EBE7' },
  muscleActions: { flex: 0.65, gap: 4 },
  muscleAction: { flex: 1, minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 8, backgroundColor: '#E4F0E5', borderRadius: 4 },
  actionIcon: { width: 30, height: 30 },
  musclePressed: { backgroundColor: '#CDE5D0', transform: [{ scale: 0.98 }] },
  muscleName: { color: Colors.light.ink, fontSize: 12, fontWeight: '700' },
});
