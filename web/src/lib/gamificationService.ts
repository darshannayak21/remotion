import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ── Level Tiers ──
export interface LevelInfo {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  icon: string;
  color: string;
}

export const LEVELS: LevelInfo[] = [
  { level: 1, title: "Beginner",     minXP: 0,     maxXP: 200,   icon: "🌱", color: "from-slate-400 to-slate-500" },
  { level: 2, title: "Apprentice",   minXP: 200,   maxXP: 600,   icon: "🔰", color: "from-emerald-400 to-emerald-600" },
  { level: 3, title: "Intermediate", minXP: 600,   maxXP: 1500,  icon: "⚡", color: "from-blue-400 to-blue-600" },
  { level: 4, title: "Advanced",     minXP: 1500,  maxXP: 3000,  icon: "🔥", color: "from-amber-400 to-orange-600" },
  { level: 5, title: "Expert",       minXP: 3000,  maxXP: 6000,  icon: "💎", color: "from-violet-400 to-purple-600" },
  { level: 6, title: "Pro",          minXP: 6000,  maxXP: 10000, icon: "👑", color: "from-yellow-400 to-amber-600" },
  { level: 7, title: "Legend",       minXP: 10000, maxXP: 99999, icon: "🏆", color: "from-maroon-500 to-rose-700" },
];

// ── Achievement Definitions ──
export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "reps" | "accuracy" | "streak" | "sessions" | "exercise";
  condition: (profile: GamificationProfile) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // ── Reps ──
  { id: "first_rep",     title: "First Rep",       description: "Complete your first repetition",       icon: "💪", category: "reps",     condition: (p) => p.totalReps >= 1 },
  { id: "century_club",  title: "Century Club",     description: "Complete 100 total repetitions",       icon: "💯", category: "reps",     condition: (p) => p.totalReps >= 100 },
  { id: "rep_machine",   title: "Rep Machine",      description: "Smash through 500 total reps",        icon: "⚙️", category: "reps",     condition: (p) => p.totalReps >= 500 },
  { id: "iron_will",     title: "Iron Will",        description: "Conquer 1,000 total repetitions",     icon: "🦾", category: "reps",     condition: (p) => p.totalReps >= 1000 },
  
  // ── Accuracy ──
  { id: "sharpshooter",  title: "Sharpshooter",     description: "Score 90%+ accuracy in a session",    icon: "🎯", category: "accuracy", condition: (p) => p.bestAccuracy >= 90 },
  { id: "perfectionist", title: "Perfectionist",    description: "Score 95%+ accuracy in a session",    icon: "✨", category: "accuracy", condition: (p) => p.bestAccuracy >= 95 },
  { id: "flawless",      title: "Flawless",         description: "Achieve a perfect 100% session",      icon: "🌟", category: "accuracy", condition: (p) => p.bestAccuracy >= 100 },
  
  // ── Streaks ──
  { id: "on_fire",       title: "On Fire",          description: "Maintain a 3-day workout streak",     icon: "🔥", category: "streak",   condition: (p) => p.bestStreak >= 3 },
  { id: "unstoppable",   title: "Unstoppable",      description: "Maintain a 7-day workout streak",     icon: "⚡", category: "streak",   condition: (p) => p.bestStreak >= 7 },
  { id: "dedicated",     title: "Dedicated",        description: "Maintain a 14-day workout streak",    icon: "🏅", category: "streak",   condition: (p) => p.bestStreak >= 14 },
  { id: "monthly_warrior", title: "Monthly Warrior", description: "30-day unbroken streak!",            icon: "🗓️", category: "streak",   condition: (p) => p.bestStreak >= 30 },
  
  // ── Sessions ──
  { id: "first_session", title: "First Steps",      description: "Complete your first workout session",  icon: "🚀", category: "sessions", condition: (p) => p.totalSessions >= 1 },
  { id: "ten_sessions",  title: "Getting Serious",  description: "Complete 10 workout sessions",         icon: "🎖️", category: "sessions", condition: (p) => p.totalSessions >= 10 },
  { id: "fifty_sessions", title: "Veteran",         description: "Complete 50 workout sessions",         icon: "🏆", category: "sessions", condition: (p) => p.totalSessions >= 50 },
  
  // ── Exercise-Specific ──
  { id: "wall_sit_master",  title: "Wall Sit Master",   description: "Complete 10 Wall Sit sessions",      icon: "🧱", category: "exercise", condition: (p) => (p.exerciseCounts?.["wall_sit"] ?? 0) >= 10 },
  { id: "lunge_legend",     title: "Lunge Legend",       description: "Complete 10 Forward Lunge sessions", icon: "🦵", category: "exercise", condition: (p) => (p.exerciseCounts?.["forward_lunge"] ?? 0) >= 10 },
  { id: "knee_raise_pro",   title: "Knee Raise Pro",     description: "Complete 10 Knee Raise sessions",   icon: "🦿", category: "exercise", condition: (p) => (p.exerciseCounts?.["standing_knee_raise"] ?? 0) >= 10 },
];

// ── Gamification Profile ──
export interface GamificationProfile {
  xp: number;
  level: number;
  streak: number;
  bestStreak: number;
  lastWorkoutDate: string; // ISO date string (YYYY-MM-DD)
  totalSessions: number;
  totalReps: number;
  bestAccuracy: number;
  unlockedAchievements: string[]; // Array of achievement IDs
  exerciseCounts: Record<string, number>; // exercise_id -> count
}

const DEFAULT_PROFILE: GamificationProfile = {
  xp: 0,
  level: 1,
  streak: 0,
  bestStreak: 0,
  lastWorkoutDate: "",
  totalSessions: 0,
  totalReps: 0,
  bestAccuracy: 0,
  unlockedAchievements: [],
  exerciseCounts: {},
};

// ── Helpers ──

export function getLevelForXP(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getXPProgress(xp: number): { current: number; needed: number; percent: number } {
  const level = getLevelForXP(xp);
  const current = xp - level.minXP;
  const needed = level.maxXP - level.minXP;
  const percent = Math.min((current / needed) * 100, 100);
  return { current, needed, percent };
}

function getStreakMultiplier(streak: number): number {
  if (streak >= 14) return 3.0;
  if (streak >= 7)  return 2.5;
  if (streak >= 3)  return 2.0;
  if (streak >= 1)  return 1.5;
  return 1.0;
}

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

// ── Firestore Operations ──

export async function getGamificationProfile(uid: string): Promise<GamificationProfile> {
  const snap = await getDoc(doc(db, "users", uid, "gamification", "profile"));
  if (snap.exists()) {
    return { ...DEFAULT_PROFILE, ...snap.data() } as GamificationProfile;
  }
  return { ...DEFAULT_PROFILE };
}

export async function saveGamificationProfile(uid: string, profile: GamificationProfile): Promise<void> {
  await setDoc(doc(db, "users", uid, "gamification", "profile"), profile);
}

// ── Core XP Award Function ──

export interface XPAwardResult {
  xpGained: number;
  newLevel: LevelInfo;
  oldLevel: LevelInfo;
  leveledUp: boolean;
  newAchievements: AchievementDef[];
  streakMultiplier: number;
  newProfile: GamificationProfile;
}

export async function awardSessionXP(
  uid: string,
  sessionData: {
    exerciseId: string;
    reps: number;
    accuracy: number;
  }
): Promise<XPAwardResult> {
  const profile = await getGamificationProfile(uid);
  const oldLevel = getLevelForXP(profile.xp);

  // ── Update Streak ──
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (profile.lastWorkoutDate === today) {
    // Already worked out today, don't double-count streak
  } else if (profile.lastWorkoutDate === yesterday) {
    profile.streak += 1;
  } else {
    profile.streak = 1; // Reset streak
  }
  profile.lastWorkoutDate = today;
  profile.bestStreak = Math.max(profile.bestStreak, profile.streak);

  // ── Calculate XP ──
  const baseXP = 20; // Base XP per session
  const repXP = sessionData.reps * 2; // 2 XP per rep
  const accuracyBonus = Math.round(sessionData.accuracy * 0.5); // Up to 50 XP for 100% accuracy
  const streakMultiplier = getStreakMultiplier(profile.streak);
  const rawXP = baseXP + repXP + accuracyBonus;
  const xpGained = Math.round(rawXP * streakMultiplier);

  profile.xp += xpGained;
  profile.totalSessions += 1;
  profile.totalReps += sessionData.reps;
  profile.bestAccuracy = Math.max(profile.bestAccuracy, sessionData.accuracy);
  profile.level = getLevelForXP(profile.xp).level;

  // ── Track Exercise Counts ──
  if (!profile.exerciseCounts) profile.exerciseCounts = {};
  profile.exerciseCounts[sessionData.exerciseId] = 
    (profile.exerciseCounts[sessionData.exerciseId] ?? 0) + 1;

  // ── Check Achievements ──
  const newAchievements: AchievementDef[] = [];
  for (const achievement of ACHIEVEMENTS) {
    if (!profile.unlockedAchievements.includes(achievement.id) && achievement.condition(profile)) {
      profile.unlockedAchievements.push(achievement.id);
      newAchievements.push(achievement);
    }
  }

  const newLevel = getLevelForXP(profile.xp);
  const leveledUp = newLevel.level > oldLevel.level;

  // ── Save to Firestore ──
  await saveGamificationProfile(uid, profile);

  return {
    xpGained,
    newLevel,
    oldLevel,
    leveledUp,
    newAchievements,
    streakMultiplier,
    newProfile: profile,
  };
}
