"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  getGamificationProfile,
  getLevelForXP,
  getXPProgress,
  LEVELS,
  ACHIEVEMENTS,
  GamificationProfile,
  AchievementDef,
} from "@/lib/gamificationService";
import {
  Trophy,
  Star,
  Flame,
  Zap,
  Lock,
  Unlock,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";

/* ── Animation Variants ── */
const fadeUp: any = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const popIn: any = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 500, damping: 25 } },
};

/* ── Category Colors ── */
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  reps:     { bg: "bg-blue-50 dark:bg-blue-900/20",     text: "text-blue-700 dark:text-blue-300",     border: "border-blue-200/60 dark:border-blue-700/40" },
  accuracy: { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200/60 dark:border-emerald-700/40" },
  streak:   { bg: "bg-amber-50 dark:bg-amber-900/20",    text: "text-amber-700 dark:text-amber-300",    border: "border-amber-200/60 dark:border-amber-700/40" },
  sessions: { bg: "bg-violet-50 dark:bg-violet-900/20",   text: "text-violet-700 dark:text-violet-300",   border: "border-violet-200/60 dark:border-violet-700/40" },
  exercise: { bg: "bg-rose-50 dark:bg-rose-900/20",      text: "text-rose-700 dark:text-rose-300",      border: "border-rose-200/60 dark:border-rose-700/40" },
};

/* ── Streak Multiplier Label ── */
function getMultiplierLabel(streak: number): string {
  if (streak >= 14) return "3.0x";
  if (streak >= 7)  return "2.5x";
  if (streak >= 3)  return "2.0x";
  if (streak >= 1)  return "1.5x";
  return "1.0x";
}

export function GamificationPanel() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementDef | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const gp = await getGamificationProfile(user.uid);
        setProfile(gp);
      } catch (err) {
        console.error("Failed to load gamification:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading || !profile) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-6 animate-pulse h-44" />
        ))}
      </div>
    );
  }

  const currentLevel = getLevelForXP(profile.xp);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1) ?? currentLevel;
  const { current: xpCurrent, needed: xpNeeded, percent: xpPercent } = getXPProgress(profile.xp);
  const unlockedSet = new Set(profile.unlockedAchievements);
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => unlockedSet.has(a.id));
  const lockedAchievements = ACHIEVEMENTS.filter((a) => !unlockedSet.has(a.id));
  const displayAchievements = showAllAchievements ? ACHIEVEMENTS : ACHIEVEMENTS.slice(0, 8);

  return (
    <>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 relative z-10"
      >
        {/* ── Level & XP Card ── */}
        <motion.div variants={fadeUp} className="lg:col-span-1">
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-xl transition-shadow duration-300 hover:shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/[0.03] pointer-events-none" />
            
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentLevel.color}`} />

            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${currentLevel.color} flex items-center justify-center text-2xl shadow-lg`}>
                {currentLevel.icon}
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">Level {currentLevel.level}</p>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: "var(--font-display)" }}>
                  {currentLevel.title}
                </h3>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase tracking-wider">
                <span>{profile.xp.toLocaleString()} XP Total</span>
                <span>{nextLevel.level > currentLevel.level ? `${xpNeeded - xpCurrent} XP to ${nextLevel.title}` : "Max Level!"}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${currentLevel.color} relative`}
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercent}%` }}
                  transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                </motion.div>
              </div>
            </div>

            {/* Mini Level Dots */}
            <div className="flex items-center gap-1.5 mt-3 relative z-10">
              {LEVELS.map((l) => (
                <div
                  key={l.level}
                  className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                    l.level <= currentLevel.level
                      ? `bg-gradient-to-r ${l.color}`
                      : "bg-slate-100 dark:bg-slate-800"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Streak & Multiplier Card ── */}
        <motion.div variants={fadeUp} className="lg:col-span-1">
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-xl transition-shadow duration-300 hover:shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/[0.03] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />

            <div className="flex items-center gap-2.5 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                <Flame size={16} className="text-amber-500" />
              </div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Daily Streak</h3>
            </div>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-baseline gap-2">
                <motion.span
                  className="text-5xl font-black text-amber-500 tabular-nums"
                  style={{ fontFamily: "var(--font-display)" }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
                >
                  {profile.streak}
                </motion.span>
                <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                  {profile.streak === 1 ? "day" : "days"}
                </span>
              </div>
              
              {/* Multiplier Badge */}
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.6 }}
                className="flex flex-col items-center"
              >
                <div className="px-3 py-1.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-extrabold text-sm shadow-lg shadow-amber-500/20">
                  {getMultiplierLabel(profile.streak)}
                </div>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-1 uppercase tracking-wider">XP Boost</span>
              </motion.div>
            </div>

            {/* Best Streak */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 relative z-10">
              <Trophy size={12} className="text-slate-400" />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">
                Best: {profile.bestStreak} days
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Stats Summary Card ── */}
        <motion.div variants={fadeUp} className="lg:col-span-1">
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-7 h-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-xl transition-shadow duration-300 hover:shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/[0.03] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 to-indigo-500" />
            
            <div className="flex items-center gap-2.5 mb-4 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
                <Zap size={16} className="text-violet-500" />
              </div>
              <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Progress Stats</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              {[
                { label: "Sessions", value: profile.totalSessions, icon: "🏋️" },
                { label: "Total Reps", value: profile.totalReps.toLocaleString(), icon: "💪" },
                { label: "Best Score", value: `${profile.bestAccuracy}%`, icon: "🎯" },
                { label: "Unlocked", value: `${unlockedAchievements.length}/${ACHIEVEMENTS.length}`, icon: "🏆" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/30 border border-slate-100/60 dark:border-slate-700/40"
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs">{stat.icon}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Achievements Section ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-6 relative z-10"
      >
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/[0.03] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-maroon-500 to-rose-700 flex items-center justify-center shadow-sm">
                <Star size={14} className="text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-base text-slate-800 dark:text-slate-100">Achievements</h2>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  {unlockedAchievements.length} of {ACHIEVEMENTS.length} unlocked
                </p>
              </div>
            </div>
            {ACHIEVEMENTS.length > 8 && (
              <button
                onClick={() => setShowAllAchievements(!showAllAchievements)}
                className="text-[11px] text-maroon-600 dark:text-maroon-400 font-bold hover:text-maroon-800 transition-colors flex items-center gap-0.5"
              >
                {showAllAchievements ? "Show Less" : "View All"} <ChevronRight size={12} />
              </button>
            )}
          </div>

          {/* Achievement Grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 relative z-10"
          >
            {displayAchievements.map((achievement) => {
              const isUnlocked = unlockedSet.has(achievement.id);
              const colors = categoryColors[achievement.category] || categoryColors.sessions;

              return (
                <motion.button
                  key={achievement.id}
                  variants={popIn}
                  onClick={() => setSelectedAchievement(achievement)}
                  className={`relative overflow-hidden p-3.5 rounded-xl border transition-all duration-300 text-left group hover:-translate-y-0.5 ${
                    isUnlocked
                      ? `${colors.bg} ${colors.border} shadow-sm hover:shadow-lg backdrop-blur-md`
                      : "bg-white/40 dark:bg-slate-800/20 border-white/40 dark:border-slate-700/30 opacity-60 hover:opacity-90 backdrop-blur-sm"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent dark:from-white/[0.02] pointer-events-none" />
                  {/* Glow ring for unlocked */}
                  {isUnlocked && (
                    <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  )}

                  {/* Premium Quality Lock/Unlock Badge */}
                  <div className={`absolute top-2 right-2 p-1 rounded-full backdrop-blur-md shadow-sm border ${
                    isUnlocked 
                      ? "bg-white/60 dark:bg-slate-800/60 border-white/50 dark:border-slate-600/50" 
                      : "bg-slate-900/5 dark:bg-white/5 border-transparent"
                  }`}>
                    {isUnlocked ? (
                      <Unlock size={10} className={colors.text} strokeWidth={3} />
                    ) : (
                      <Lock size={10} className="text-slate-400 dark:text-slate-500" strokeWidth={3} />
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 mb-1.5 pt-1">
                    <span className={`text-2xl drop-shadow-sm ${isUnlocked ? "saturate-150" : "grayscale opacity-70"}`}>
                      {achievement.icon}
                    </span>
                  </div>
                  <p className={`text-xs font-bold truncate ${isUnlocked ? colors.text : "text-slate-400 dark:text-slate-600"}`}>
                    {achievement.title}
                  </p>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                    {achievement.description}
                  </p>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Achievement Detail Modal ── */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSelectedAchievement(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xs bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-center"
            >
              <button
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>

              {(() => {
                const isUnlocked = unlockedSet.has(selectedAchievement.id);
                const colors = categoryColors[selectedAchievement.category];
                return (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className={`w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl ${
                        isUnlocked ? `${colors.bg} shadow-lg` : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      <span className={isUnlocked ? "" : "grayscale opacity-40"}>
                        {selectedAchievement.icon}
                      </span>
                    </motion.div>
                    <h3 className={`text-lg font-bold mb-1 ${isUnlocked ? "text-slate-800 dark:text-slate-100" : "text-slate-400 dark:text-slate-500"}`}>
                      {selectedAchievement.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      {selectedAchievement.description}
                    </p>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                      isUnlocked
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-700/40"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/60 dark:border-slate-700/40"
                    }`}>
                      {isUnlocked ? (
                        <><Sparkles size={12} /> Unlocked!</>
                      ) : (
                        <><Lock size={12} /> Locked</>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
