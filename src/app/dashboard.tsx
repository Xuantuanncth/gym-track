import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomTabInset, Colors, MaxContentWidth } from '@/constants/theme';
import { loadEntries, MUSCLE_GROUPS, type MuscleId, type WorkoutEntry } from '@/data/gym-storage';

const muscleIcons: Record<MuscleId, number> = {
  arm: require('@/assets/icon/muscles/bicep.png'),
  shoulder: require('@/assets/icon/muscles/shoulder.png'),
  chest: require('@/assets/icon/muscles/front.png'),
  back: require('@/assets/icon/muscles/back.png'),
  leg: require('@/assets/icon/muscles/gym.png'),
  triceps: require('@/assets/icon/muscles/bicep.png'),
  other: require('@/assets/icon/muscles/app.png'),
};

export default function DashboardScreen() {
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);

  useEffect(() => {
    loadEntries().then(setEntries);
  }, []);

  const totals = MUSCLE_GROUPS.map((muscle) => ({
    ...muscle,
    reps: entries.filter((entry) => entry.muscleId === muscle.id).reduce((sum, entry) => sum + entry.reps, 0),
  }));
  const grandTotal = totals.reduce((sum, muscle) => sum + muscle.reps, 0);
  const trainingDays = new Set(entries.map((entry) => entry.date)).size;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>ALL-TIME OVERVIEW</Text>
        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.metrics}>
          <View style={[styles.metric, styles.totalMetric]}>
            <Text style={styles.metricLabel}>TOTAL REPS</Text>
            <Text style={styles.totalValue}>{grandTotal}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>TRAINING DAYS</Text>
            <Text style={styles.metricValue}>{trainingDays}</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>ENTRIES</Text>
            <Text style={styles.metricValue}>{entries.length}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>BY MUSCLE GROUP</Text>
        <View style={styles.muscleList}>
          {totals.map((muscle) => (
            <View key={muscle.id} style={styles.muscleRow}>
              <Image source={muscleIcons[muscle.id]} style={styles.icon} resizeMode="contain" />
              <Text style={styles.muscleName}>{muscle.name}</Text>
              <Text style={styles.reps}>{muscle.reps}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.light.background },
  content: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', padding: 20, paddingBottom: BottomTabInset + 24 },
  eyebrow: { color: Colors.light.accent, fontSize: 11, fontWeight: '800' },
  title: { color: Colors.light.ink, fontSize: 32, fontWeight: '800', marginTop: 4, marginBottom: 22 },
  metrics: { flexDirection: 'row', gap: 8, marginBottom: 28 },
  metric: { flex: 1, minHeight: 92, justifyContent: 'center', paddingHorizontal: 12, backgroundColor: '#F0F1EC', borderRadius: 8 },
  totalMetric: { backgroundColor: Colors.light.ink },
  metricLabel: { color: Colors.light.muted, fontSize: 9, fontWeight: '800' },
  metricValue: { color: Colors.light.ink, fontSize: 25, fontWeight: '800', marginTop: 5 },
  totalValue: { color: '#E53935', fontSize: 25, fontWeight: '900', marginTop: 5 },
  sectionTitle: { color: Colors.light.ink, fontSize: 12, fontWeight: '800', marginBottom: 10 },
  muscleList: { borderTopWidth: 1, borderTopColor: '#DDE1DA' },
  muscleRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DDE1DA', gap: 12 },
  icon: { width: 30, height: 30 },
  muscleName: { flex: 1, color: Colors.light.ink, fontSize: 14, fontWeight: '600' },
  reps: { color: Colors.light.ink, fontSize: 17, fontWeight: '800' },
});