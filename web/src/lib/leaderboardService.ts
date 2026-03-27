import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getGamificationProfile, getLevelForXP, LevelInfo } from "@/lib/gamificationService";

// ── Leaderboard Entry ──
export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  photoURL: string;
  xp: number;
  level: LevelInfo;
  streak: number;
  bestStreak: number;
  totalReps: number;
  totalSessions: number;
  bestAccuracy: number;
  achievementCount: number;
  updatedAt: string; // ISO string
}

// ── Sync user's gamification data to leaderboard ──
export async function syncToLeaderboard(
  uid: string,
  displayName: string,
  photoURL?: string | null
): Promise<void> {
  const profile = await getGamificationProfile(uid);
  const level = getLevelForXP(profile.xp);

  const entry: LeaderboardEntry = {
    uid,
    displayName: displayName || "Anonymous",
    photoURL: photoURL || "",
    xp: profile.xp,
    level,
    streak: profile.streak,
    bestStreak: profile.bestStreak,
    totalReps: profile.totalReps,
    totalSessions: profile.totalSessions,
    bestAccuracy: profile.bestAccuracy,
    achievementCount: profile.unlockedAchievements?.length ?? 0,
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, "leaderboard", uid), entry);
}

// ── Fetch top N leaderboard entries ──
export type LeaderboardSortKey = "xp" | "streak" | "totalReps" | "bestAccuracy" | "totalSessions";

export async function getLeaderboard(
  sortBy: LeaderboardSortKey = "xp",
  count: number = 50
): Promise<LeaderboardEntry[]> {
  const q = query(
    collection(db, "leaderboard"),
    orderBy(sortBy, "desc"),
    limit(count)
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as LeaderboardEntry);
}
