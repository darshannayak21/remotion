import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { awardSessionXP } from "@/lib/gamificationService";

// ── Types ──

export interface UserStats {
  totalReps: number;
  streak: number;
  avgAccuracy: number;
  consistencyScore: number;
  formImprovement: number;
  lastScore: number;
  sessionsCount: number;
}

export interface UserSettings {
  sensitivity: "strict" | "relaxed";
  demoVideoEnabled: boolean;
  voiceEnabled: boolean;
  mode: "beginner" | "advanced";
}

export interface WorkoutSession {
  exerciseId: string;
  exerciseName: string;
  score: number;
  reps: number;
  targetReps?: number;
  duration: number; // seconds
  date: string; // ISO string
  setNumber?: number;
}

export interface WorkoutGroup {
  id: string;
  name: string;
  exercises: string[];
  description?: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  createdAt: string;
  stats: UserStats;
  settings: UserSettings;
  workoutGroups: WorkoutGroup[];
  hasNewAssignment?: boolean;
  linkedDoctorId?: string;
}

// ── Profile ──

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  await updateDoc(doc(db, "users", uid), data);
}

// ── Stats ──

export async function getUserStats(uid: string): Promise<UserStats> {
  const profile = await getUserProfile(uid);
  return (
    profile?.stats ?? {
      totalReps: 0,
      streak: 0,
      avgAccuracy: 0,
      consistencyScore: 0,
      formImprovement: 0,
      lastScore: 0,
      sessionsCount: 0,
    }
  );
}

export async function updateUserStats(uid: string, stats: Partial<UserStats>) {
  await updateDoc(doc(db, "users", uid), {
    ...Object.fromEntries(Object.entries(stats).map(([k, v]) => [`stats.${k}`, v])),
  });
}

// ── Sessions ──

export async function saveWorkoutSession(uid: string, session: WorkoutSession) {
  const sessionsRef = collection(db, "users", uid, "sessions");
  await addDoc(sessionsRef, session);

  // Update aggregate stats
  const currentStats = await getUserStats(uid);
  const newSessionsCount = currentStats.sessionsCount + 1;
  const newTotalReps = currentStats.totalReps + session.reps;
  const newAvgAccuracy =
    (currentStats.avgAccuracy * currentStats.sessionsCount + session.score) /
    newSessionsCount;

  await updateUserStats(uid, {
    totalReps: newTotalReps,
    avgAccuracy: Math.round(newAvgAccuracy * 10) / 10,
    lastScore: session.score,
    sessionsCount: newSessionsCount,
  });

  // ── Award Gamification XP ──
  try {
    await awardSessionXP(uid, {
      exerciseId: session.exerciseId,
      reps: session.reps,
      accuracy: session.score,
    });
  } catch (err) {
    console.error("[Gamification] Failed to award XP:", err);
  }

  // ── Sync to Leaderboard ──
  try {
    const { syncToLeaderboard } = await import("@/lib/leaderboardService");
    // We don't have the user display name here, so we use a dynamic import
    // and pass a minimal identifier - the sync function will handle the rest
    const { getAuth } = await import("firebase/auth");
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      await syncToLeaderboard(
        uid,
        currentUser.displayName || currentUser.email?.split("@")[0] || "Anonymous",
        currentUser.photoURL
      );
    }
  } catch (err) {
    console.error("[Leaderboard] Failed to sync:", err);
  }
}

export async function getRecentSessions(
  uid: string,
  count: number = 5
): Promise<WorkoutSession[]> {
  const sessionsRef = collection(db, "users", uid, "sessions");
  const q = query(sessionsRef, orderBy("date", "desc"), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as WorkoutSession);
}

// ── Settings ──

export async function getUserSettings(uid: string): Promise<UserSettings> {
  const profile = await getUserProfile(uid);
  return (
    profile?.settings ?? {
      sensitivity: "relaxed",
      demoVideoEnabled: true,
      voiceEnabled: true,
      mode: "beginner",
    }
  );
}

export async function saveUserSettings(uid: string, settings: Partial<UserSettings>) {
  await updateDoc(doc(db, "users", uid), {
    ...Object.fromEntries(Object.entries(settings).map(([k, v]) => [`settings.${k}`, v])),
  });
}

// ── Workout Groups (Routines) ──

export async function getWorkoutGroups(uid: string): Promise<WorkoutGroup[]> {
  const profile = await getUserProfile(uid);
  return profile?.workoutGroups ?? [];
}

export async function saveWorkoutGroups(uid: string, groups: WorkoutGroup[]) {
  await updateDoc(doc(db, "users", uid), { workoutGroups: groups });
}
