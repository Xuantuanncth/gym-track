import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, BottomTabInset, MaxContentWidth, WebTabInset } from '@/constants/theme';
import {
  deleteEntry,
  deleteEntriesForDate,
  loadEntries,
  MUSCLE_GROUPS,
  totalForDate,
  totalsForDate,
  updateEntryMuscle,
  type MuscleId,
  type WorkoutEntry,
} from '@/data/gym-storage';

export default function HistoryScreen() {
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingDeleteDate, setPendingDeleteDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEntries()
      .then(setEntries)
      .catch(() => setError('Could not load history. Please try again.'));
  }, []);

  async function changeMuscle(entryId: string, muscleId: MuscleId) {
    setError(null);
    try {
      const updatedEntry = await updateEntryMuscle(entryId, muscleId);
      setEntries((current) =>
        current.map((entry) => (entry.id === entryId ? updatedEntry : entry)),
      );
      setEditingEntryId(null);
    } catch {
      setError('Could not update entry. Please try again.');
    }
  }

  async function removeEntry(entryId: string) {
    setError(null);
    try {
      await deleteEntry(entryId);
      setEntries((current) => current.filter((entry) => entry.id !== entryId));
      setPendingDeleteId(null);
      setEditingEntryId(null);
    } catch {
      setError('Could not delete entry. Please try again.');
    }
  }

  async function removeDate(date: string) {
    setError(null);
    try {
      await deleteEntriesForDate(date);
      setEntries((current) => current.filter((entry) => entry.date !== date));
      setSelectedDate(null);
      setPendingDeleteDate(null);
      setPendingDeleteId(null);
      setEditingEntryId(null);
    } catch {
      setError('Could not delete records for this day. Please try again.');
    }
  }

  const dates = [...new Set(entries.map((entry) => entry.date))].sort().reverse();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>YOUR TRAINING</Text>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>
          Entries save when you choose a muscle. Multiple workouts on one day stay grouped together.
        </Text>
        {error && <Text style={styles.error}>{error}</Text>}

        {dates.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>◌</Text>
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyText}>Your completed days will appear here.</Text>
          </View>
        ) : (
          dates.map((date) => {
            const totals = totalsForDate(entries, date);
            const dayEntries = entries.filter((entry) => entry.date === date).reverse();
            const isSelected = selectedDate === date;
            return (
              <View key={date} style={styles.session}>
                <Pressable onPress={() => setSelectedDate(isSelected ? null : date)} style={({ pressed }) => [styles.sessionHeader, pressed && styles.pressed]}>
                  <View>
                    <Text style={styles.sessionDate}>{formatDate(date)}</Text>
                    <Text style={styles.entryCount}>{dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'}</Text>
                  </View>
                  <View style={styles.sessionTotal}>
                    <Text style={styles.totalNumber}>{totalForDate(entries, date)}</Text>
                    <Text style={styles.totalLabel}>TOTAL REPS</Text>
                  </View>
                </Pressable>
                <View style={styles.summary}>
                  {MUSCLE_GROUPS.filter((muscle) => totals[muscle.id] > 0).map((muscle) => (
                    <View key={muscle.id} style={styles.summaryRow}>
                      <Text style={styles.summaryName}>{muscle.name}</Text>
                      <Text style={styles.summaryValue}>{totals[muscle.id]}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.dayActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setPendingDeleteDate(pendingDeleteDate === date ? null : date);
                      setPendingDeleteId(null);
                      setEditingEntryId(null);
                    }}
                    style={styles.dayDeleteButton}>
                    <Text style={styles.deleteActionText}>
                      {pendingDeleteDate === date ? 'Cancel delete day' : 'Delete day'}
                    </Text>
                  </Pressable>
                </View>
                {pendingDeleteDate === date && (
                  <View style={styles.dayDeleteConfirmation}>
                    <Text style={styles.actionPrompt}>
                      Delete all {dayEntries.length} entries for this day ({totalForDate(entries, date)} reps)?
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => removeDate(date)}
                      style={[styles.dayDeleteButton, styles.confirmDeleteAction]}>
                      <Text style={styles.deleteActionText}>Confirm delete day</Text>
                    </Pressable>
                  </View>
                )}
                {isSelected && (
                  <View style={styles.details}>
                    <Text style={styles.detailsTitle}>ENTRIES</Text>
                    {dayEntries.map((entry) => (
                      <View key={entry.id} style={styles.entryItem}>
                        <View style={styles.entryRow}>
                          <Text style={styles.entryReps}>{entry.reps}</Text>
                          <Text style={styles.entryArrow}>→</Text>
                          <Text style={styles.entryMuscle}>{MUSCLE_GROUPS.find((muscle) => muscle.id === entry.muscleId)?.name}</Text>
                          <Text style={styles.entryTime}>{formatTime(entry.createdAt)}</Text>
                        </View>
                        <View style={styles.entryActions}>
                          <Pressable
                            accessibilityRole="button"
                            onPress={() => {
                              setPendingDeleteId(null);
                              setEditingEntryId(editingEntryId === entry.id ? null : entry.id);
                            }}
                            style={styles.entryAction}>
                            <Text style={styles.entryActionText}>
                              {editingEntryId === entry.id ? 'Cancel edit' : 'Change muscle'}
                            </Text>
                          </Pressable>
                          <Pressable
                            accessibilityRole="button"
                            onPress={() => {
                              setEditingEntryId(null);
                              setPendingDeleteId(pendingDeleteId === entry.id ? null : entry.id);
                            }}
                            style={styles.entryAction}>
                            <Text style={styles.deleteActionText}>
                              {pendingDeleteId === entry.id ? 'Cancel delete' : 'Delete'}
                            </Text>
                          </Pressable>
                        </View>
                        {editingEntryId === entry.id && (
                          <View style={styles.musclePicker}>
                            <Text style={styles.actionPrompt}>Move entry to:</Text>
                            {MUSCLE_GROUPS.map((muscle) => (
                              <Pressable
                                key={muscle.id}
                                accessibilityRole="button"
                                accessibilityState={{ selected: entry.muscleId === muscle.id }}
                                disabled={entry.muscleId === muscle.id}
                                onPress={() => changeMuscle(entry.id, muscle.id)}
                                style={[
                                  styles.muscleOption,
                                  entry.muscleId === muscle.id && styles.selectedMuscleOption,
                                ]}>
                                <Text style={styles.muscleOptionText}>{muscle.name}</Text>
                              </Pressable>
                            ))}
                          </View>
                        )}
                        {pendingDeleteId === entry.id && (
                          <View style={styles.deleteConfirmation}>
                            <Text style={styles.actionPrompt}>Delete this {entry.reps}-rep entry?</Text>
                            <Pressable
                              accessibilityRole="button"
                              onPress={() => removeEntry(entry.id)}
                              style={[styles.entryAction, styles.confirmDeleteAction]}>
                              <Text style={styles.deleteActionText}>Confirm delete</Text>
                            </Pressable>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(date: string) {
  const [year, month, day] = date.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  content: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', padding: 20, paddingBottom: BottomTabInset + WebTabInset + 32 },
  eyebrow: { color: Colors.light.accent, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: Colors.light.ink, fontSize: 42, fontWeight: '800', marginTop: 5 },
  subtitle: { color: Colors.light.muted, fontSize: 14, marginTop: 7, marginBottom: 26 },
  error: { color: '#B3261E', fontSize: 13, marginTop: -14, marginBottom: 16 },
  emptyState: { backgroundColor: '#E4F0E5', borderRadius: 22, alignItems: 'center', padding: 34, marginTop: 12 },
  emptyIcon: { color: Colors.light.accent, fontSize: 42 },
  emptyTitle: { color: Colors.light.ink, fontSize: 20, fontWeight: '800', marginTop: 12 },
  emptyText: { color: Colors.light.muted, marginTop: 5 },
  session: { backgroundColor: '#F0F1EC', borderRadius: 20, marginBottom: 14, overflow: 'hidden' },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  sessionDate: { color: Colors.light.ink, fontSize: 18, fontWeight: '800' },
  entryCount: { color: Colors.light.muted, fontSize: 12, marginTop: 4 },
  sessionTotal: { alignItems: 'flex-end' },
  totalNumber: { color: Colors.light.accent, fontSize: 25, fontWeight: '800' },
  totalLabel: { color: Colors.light.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  summary: { borderTopWidth: 1, borderTopColor: '#DDE1DA', paddingHorizontal: 18, paddingVertical: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  summaryName: { color: Colors.light.muted, fontSize: 13 },
  summaryValue: { color: Colors.light.ink, fontSize: 13, fontWeight: '800' },
  dayActions: { alignItems: 'flex-end', paddingHorizontal: 18, paddingBottom: 8 },
  dayDeleteButton: { paddingVertical: 6, paddingHorizontal: 9, backgroundColor: '#303A3A', borderRadius: 8 },
  dayDeleteConfirmation: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, paddingHorizontal: 18, paddingBottom: 12 },
  details: { backgroundColor: Colors.light.ink, padding: 18 },
  detailsTitle: { color: '#A5ADA8', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  entryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7 },
  entryItem: { borderBottomWidth: 1, borderBottomColor: '#303A3A', paddingVertical: 8 },
  entryReps: { color: Colors.light.white, fontSize: 17, fontWeight: '800', width: 42 },
  entryArrow: { color: Colors.light.accent, fontSize: 16, width: 30 },
  entryMuscle: { color: Colors.light.white, fontSize: 14 },
  entryTime: { color: '#A5ADA8', fontSize: 11, marginLeft: 'auto' },
  entryActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  entryAction: { paddingVertical: 6, paddingHorizontal: 8, backgroundColor: '#303A3A', borderRadius: 8 },
  entryActionText: { color: '#D9E7D7', fontSize: 12, fontWeight: '700' },
  deleteActionText: { color: '#FFB4AB', fontSize: 12, fontWeight: '700' },
  musclePicker: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 8 },
  actionPrompt: { color: '#A5ADA8', fontSize: 12, marginRight: 4 },
  muscleOption: { paddingVertical: 6, paddingHorizontal: 9, backgroundColor: '#303A3A', borderRadius: 8 },
  selectedMuscleOption: { backgroundColor: Colors.light.accent },
  muscleOptionText: { color: Colors.light.white, fontSize: 12, fontWeight: '700' },
  deleteConfirmation: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 8 },
  confirmDeleteAction: { backgroundColor: '#5B2525' },
  pressed: { opacity: 0.7 },
});
