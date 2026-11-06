import AsyncStorage from '@react-native-async-storage/async-storage';

export type MuscleId = 'arm' | 'shoulder' | 'chest' | 'back' | 'leg' | 'triceps' | 'other';

export type MuscleGroup = {
  id: MuscleId;
  name: string;
  icon: string;
};

export type WorkoutEntry = {
  id: string;
  date: string;
  muscleId: MuscleId;
  reps: number;
  createdAt: string;
};

export const MUSCLE_GROUPS: MuscleGroup[] = [
  { id: 'arm', name: 'Arm', icon: '💪' },
  { id: 'shoulder', name: 'Shoulder', icon: '◒' },
  { id: 'chest', name: 'Chest', icon: '◈' },
  { id: 'back', name: 'Back', icon: '▤' },
  { id: 'leg', name: 'Leg', icon: '◐' },
  { id: 'triceps', name: 'Triceps', icon: '✦' },
  { id: 'other', name: 'Other', icon: '＋' },
];

const STORAGE_KEY = '@gym-track/entries';

export function getLocalDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function loadEntries(): Promise<WorkoutEntry[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isWorkoutEntry);
  } catch {
    return [];
  }
}

export async function addEntry(muscleId: MuscleId, reps: number) {
  const entries = await loadEntries();
  const now = new Date();
  const entry: WorkoutEntry = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    date: getLocalDate(now),
    muscleId,
    reps,
    createdAt: now.toISOString(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...entries, entry]));
  return entry;
}

export async function updateEntryMuscle(entryId: string, muscleId: MuscleId) {
  const entries = await loadEntries();
  if (!entries.some((entry) => entry.id === entryId)) {
    throw new Error(`Workout entry not found: ${entryId}`);
  }
  const updatedEntries = entries.map((entry) =>
    entry.id === entryId ? { ...entry, muscleId } : entry,
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
  return updatedEntries.find((entry) => entry.id === entryId)!;
}

export async function deleteEntry(entryId: string) {
  const entries = await loadEntries();
  if (!entries.some((entry) => entry.id === entryId)) {
    throw new Error(`Workout entry not found: ${entryId}`);
  }
  const updatedEntries = entries.filter((entry) => entry.id !== entryId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
}

export async function deleteEntriesForDate(date: string) {
  const entries = await loadEntries();
  const updatedEntries = entries.filter((entry) => entry.date !== date);
  if (updatedEntries.length === entries.length) {
    throw new Error(`Workout entries not found for date: ${date}`);
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEntries));
}

export function totalsForDate(entries: WorkoutEntry[], date: string) {
  return MUSCLE_GROUPS.reduce<Record<MuscleId, number>>(
    (totals, muscle) => {
      totals[muscle.id] = entries
        .filter((entry) => entry.date === date && entry.muscleId === muscle.id)
        .reduce((sum, entry) => sum + entry.reps, 0);
      return totals;
    },
    {} as Record<MuscleId, number>,
  );
}

export function totalForDate(entries: WorkoutEntry[], date: string) {
  return entries
    .filter((entry) => entry.date === date)
    .reduce((sum, entry) => sum + entry.reps, 0);
}

function isWorkoutEntry(value: unknown): value is WorkoutEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as Partial<WorkoutEntry>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.date === 'string' &&
    typeof entry.muscleId === 'string' &&
    MUSCLE_GROUPS.some((muscle) => muscle.id === entry.muscleId) &&
    typeof entry.reps === 'number' &&
    typeof entry.createdAt === 'string'
  );
}