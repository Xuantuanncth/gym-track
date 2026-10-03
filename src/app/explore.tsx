import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { loadEntries, MUSCLE_GROUPS, totalForDate, totalsForDate, type WorkoutEntry } from '@/data/gym-storage';

export default function HistoryScreen() {
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    loadEntries().then(setEntries);
  }, []);

  const dates = [...new Set(entries.map((entry) => entry.date))].sort().reverse();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>YOUR TRAINING</Text>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Every rep, kept exactly as you logged it.</Text>

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
                {isSelected && (
                  <View style={styles.details}>
                    <Text style={styles.detailsTitle}>ENTRIES</Text>
                    {dayEntries.map((entry) => (
                      <View key={entry.id} style={styles.entryRow}>
                        <Text style={styles.entryReps}>{entry.reps}</Text>
                        <Text style={styles.entryArrow}>→</Text>
                        <Text style={styles.entryMuscle}>{MUSCLE_GROUPS.find((muscle) => muscle.id === entry.muscleId)?.name}</Text>
                        <Text style={styles.entryTime}>{formatTime(entry.createdAt)}</Text>
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
  content: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', padding: 20, paddingBottom: BottomTabInset + 32 },
  eyebrow: { color: Colors.light.accent, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: Colors.light.ink, fontSize: 42, fontWeight: '800', marginTop: 5 },
  subtitle: { color: Colors.light.muted, fontSize: 14, marginTop: 7, marginBottom: 26 },
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
  details: { backgroundColor: Colors.light.ink, padding: 18 },
  detailsTitle: { color: '#A5ADA8', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  entryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7 },
  entryReps: { color: Colors.light.white, fontSize: 17, fontWeight: '800', width: 42 },
  entryArrow: { color: Colors.light.accent, fontSize: 16, width: 30 },
  entryMuscle: { color: Colors.light.white, fontSize: 14 },
  entryTime: { color: '#A5ADA8', fontSize: 11, marginLeft: 'auto' },
  pressed: { opacity: 0.7 },
});
