"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GlassCard from "@/components/ui/GlassCard";
import {
  getLeaderboard,
  syncToLeaderboard,
  LeaderboardEntry,
  LeaderboardSortKey,
} from "@/lib/leaderboardService";
import { getLevelForXP } from "@/lib/gamificationService";
import {
  Trophy,
  Flame,
  Zap,
  Target,
  Dumbbell,
  Medal,
  Crown,
  RefreshCcw,
  TrendingUp,
  Users,
} from "lucide-react";

const SORT_TABS: { key: LeaderboardSortKey; label: string; icon: React.ReactNode }[] = [
  { key: "xp", label: "XP", icon: <Zap size={14} /> },
  { key: "streak", label: "Streaks", icon: <Flame size={14} /> },
  { key: "totalReps", label: "Reps", icon: <Dumbbell size={14} /> },
  { key: "bestAccuracy", label: "Accuracy", icon: <Target size={14} /> },
  { key: "totalSessions", label: "Sessions", icon: <TrendingUp size={14} /> },
];

function getRankBadge(rank: number) {
  if (rank === 1) return { icon: <Crown size={18} />, color: "from-yellow-400 to-amber-500", text: "text-amber-600 dark:text-amber-400", bg: "bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-amber-200 dark:border-amber-700/40" };
  if (rank === 2) return { icon: <Medal size={18} />, color: "from-slate-300 to-slate-400", text: "text-slate-500 dark:text-slate-300", bg: "bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800/50 dark:to-gray-800/50 border-slate-200 dark:border-slate-700/40" };
  if (rank === 3) return { icon: <Medal size={18} />, color: "from-orange-300 to-orange-500", text: "text-orange-600 dark:text-orange-400", bg: "bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/20 border-orange-200 dark:border-orange-700/40" };
  return null;
}

function getSortValue(entry: LeaderboardEntry, sortBy: LeaderboardSortKey): string | number {
  switch (sortBy) {
    case "xp": return `${entry.xp.toLocaleString()} XP`;
    case "streak": return `${entry.streak} 🔥`;
    case "totalReps": return `${entry.totalReps.toLocaleString()} reps`;
    case "bestAccuracy": return `${entry.bestAccuracy.toFixed(1)}%`;
    case "totalSessions": return `${entry.totalSessions} sessions`;
    default: return entry.xp;
  }
}

function LeaderboardContent() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<LeaderboardSortKey>("xp");
  const [syncing, setSyncing] = useState(false);

  const fetchLeaderboard = async (sort: LeaderboardSortKey) => {
    setLoading(true);
    try {
      const data = await getLeaderboard(sort, 50);
      setEntries(data);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sync current user and fetch on mount
  useEffect(() => {
    const init = async () => {
      if (user) {
        try {
          await syncToLeaderboard(
            user.uid,
            user.displayName || user.email?.split("@")[0] || "Anonymous",
            user.photoURL
          );
        } catch (e) {
          console.error("Leaderboard sync failed:", e);
        }
      }
      await fetchLeaderboard(sortBy);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const changeSortBy = async (key: LeaderboardSortKey) => {
    setSortBy(key);
    await fetchLeaderboard(key);
  };

  const handleRefresh = async () => {
    setSyncing(true);
    if (user) {
      await syncToLeaderboard(
        user.uid,
        user.displayName || user.email?.split("@")[0] || "Anonymous",
        user.photoURL
      );
    }
    await fetchLeaderboard(sortBy);
    setSyncing(false);
  };

  const userRank = entries.findIndex((e) => e.uid === user?.uid) + 1;

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Ambient blobs */}
      <div className="ambient-blob w-[400px] h-[400px] bg-maroon-300 -top-32 -right-32 animate-float-slow" />
      <div className="ambient-blob w-[300px] h-[300px] bg-amber-200 top-1/3 -left-40 animate-float-medium" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Trophy size={20} className="text-white" />
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="text-gradient-maroon">Leaderboard</span>
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base flex items-center gap-2 mt-1">
              <Users size={14} className="text-slate-400" />
              {entries.length} athletes competing
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleRefresh}
            disabled={syncing}
            className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/40 text-slate-500 dark:text-slate-400 hover:text-maroon-600 dark:hover:text-maroon-400 hover:border-maroon-200 dark:hover:border-maroon-700 transition-all disabled:opacity-50"
          >
            <RefreshCcw size={18} className={syncing ? "animate-spin" : ""} />
          </motion.button>
        </div>
      </motion.div>

      {/* Your Rank Banner */}
      {userRank > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <GlassCard className="!p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-maroon-500 to-maroon-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-maroon-600/20">
                  #{userRank}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Your Ranking
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {userRank <= 3
                      ? "🏆 Top 3 — You're a champion!"
                      : userRank <= 10
                      ? "🔥 Top 10 — Keep pushing!"
                      : `Out of ${entries.length} athletes`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 dark:text-slate-500">Sorted by</p>
                <p className="text-sm font-bold text-maroon-700 dark:text-maroon-400 capitalize">
                  {SORT_TABS.find((t) => t.key === sortBy)?.label || sortBy}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Sort Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex gap-2 mb-6 overflow-x-auto pb-1"
      >
        {SORT_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => changeSortBy(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              sortBy === tab.key
                ? "bg-maroon-700 text-white shadow-lg shadow-maroon-700/20"
                : "bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/40 text-slate-600 dark:text-slate-300 hover:border-maroon-200 dark:hover:border-maroon-600"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Leaderboard List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-maroon-100 dark:border-maroon-900/40" />
              <div className="absolute inset-0 rounded-full border-2 border-maroon-600 border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading rankings...</p>
          </div>
        </div>
      ) : entries.length === 0 ? (
        <GlassCard className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/10 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 dark:border-amber-700/30">
            <Trophy size={28} className="text-amber-500" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No rankings yet</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
            Complete exercises to appear on the leaderboard and compete with others!
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-2.5">
          <AnimatePresence>
            {entries.map((entry, i) => {
              const rank = i + 1;
              const isUser = entry.uid === user?.uid;
              const badge = getRankBadge(rank);
              const level = getLevelForXP(entry.xp);

              return (
                <motion.div
                  key={entry.uid}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  className={`group relative flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl backdrop-blur-xl border transition-all duration-200 ${
                    isUser
                      ? "bg-maroon-50/60 dark:bg-maroon-900/15 border-maroon-200/60 dark:border-maroon-700/30 ring-1 ring-maroon-200/40 dark:ring-maroon-800/30"
                      : badge
                      ? `${badge.bg} border`
                      : "bg-white/60 dark:bg-slate-800/40 border-slate-100/80 dark:border-slate-700/40 hover:border-slate-200 dark:hover:border-slate-600"
                  }`}
                >
                  {/* Rank */}
                  <div className="shrink-0 w-10 text-center">
                    {badge ? (
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${badge.color} flex items-center justify-center text-white mx-auto shadow-md`}>
                        {badge.icon}
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-slate-400 dark:text-slate-500 tabular-nums">
                        {rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="shrink-0">
                    {entry.photoURL ? (
                      <img
                        src={entry.photoURL}
                        alt={entry.displayName}
                        className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-maroon-400 to-maroon-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {entry.displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold text-sm truncate ${isUser ? "text-maroon-800 dark:text-maroon-300" : "text-slate-800 dark:text-slate-100"}`}>
                        {entry.displayName}
                        {isUser && (
                          <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-maroon-100 dark:bg-maroon-900/40 text-maroon-600 dark:text-maroon-400">
                            YOU
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                        {level.icon} Lv.{level.level} {level.title}
                      </span>
                      <span className="text-[10px] text-slate-300 dark:text-slate-600">·</span>
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                        🏅 {entry.achievementCount} achievements
                      </span>
                    </div>
                  </div>

                  {/* Score (dynamic based on sort) */}
                  <div className="shrink-0 text-right">
                    <p className={`text-sm font-bold tabular-nums ${
                      rank === 1 ? "text-amber-600 dark:text-amber-400" :
                      rank === 2 ? "text-slate-500 dark:text-slate-300" :
                      rank === 3 ? "text-orange-600 dark:text-orange-400" :
                      isUser ? "text-maroon-700 dark:text-maroon-400" :
                      "text-slate-700 dark:text-slate-200"
                    }`}>
                      {getSortValue(entry, sortBy)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <ProtectedRoute>
      <LeaderboardContent />
    </ProtectedRoute>
  );
}
