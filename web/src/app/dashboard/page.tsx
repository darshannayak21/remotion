"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GlassCard from "@/components/ui/GlassCard";
import {
  getRecentSessions,
  getUserProfile,
  updateUserProfile,
  WorkoutSession,
  UserProfile,
} from "@/lib/userService";
import {
  Activity,
  Dumbbell,
  X,
  ChevronRight,
  Bell,
  ArrowUpRight,
  Calendar,
  Play,
} from "lucide-react";
import Link from "next/link";
import FlexChat from "@/components/dashboard/FlexChat";
import { GamificationPanel } from "@/components/dashboard/GamificationPanel";

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function scoreColor(s: number) {
  if (s >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (s >= 75) return "text-amber-600 dark:text-amber-400";
  return "text-rose-500 dark:text-rose-400";
}
function scoreBg(s: number) {
  if (s >= 90) return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/60 dark:border-emerald-700/40";
  if (s >= 75) return "bg-amber-50 dark:bg-amber-900/20 border-amber-200/60 dark:border-amber-700/40";
  return "bg-rose-50 dark:bg-rose-900/20 border-rose-200/60 dark:border-rose-700/40";
}

/* ── Greeting Helper ── */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function DashboardContent() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const [recentSessions, userProf] = await Promise.all([
          getRecentSessions(user.uid, 5),
          getUserProfile(user.uid),
        ]);
        setSessions(recentSessions);
        setProfile(userProf);
        if (userProf?.hasNewAssignment) {
          setTimeout(() => setShowNotification(true), 600);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";
  const greeting = getGreeting();

  const dismissNotification = async () => {
    setShowNotification(false);
    if (user) {
      await updateUserProfile(user.uid, { hasNewAssignment: false });
      setProfile(p => p ? { ...p, hasNewAssignment: false } : p);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="relative w-12 h-12 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-maroon-100" />
              <div className="absolute inset-0 rounded-full border-2 border-maroon-600 border-t-transparent animate-spin" />
            </div>
            <p className="text-sm text-slate-500 font-medium">Loading your dashboard...</p>
            <p className="text-xs text-slate-400 mt-1">Fetching your progress data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ── Ambient Background Blobs ── */}
      <div className="ambient-blob w-[500px] h-[500px] bg-maroon-300/40 dark:bg-maroon-900/30 -top-40 -right-40 animate-float-slow" />
      <div className="ambient-blob w-[400px] h-[400px] bg-rose-200/30 dark:bg-rose-900/20 top-1/3 -left-48 animate-float-medium" />
      <div className="ambient-blob w-[300px] h-[300px] bg-amber-200/30 dark:bg-amber-900/10 bottom-20 right-1/4 animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-10">

      {/* Flex Chatbot Integration */}
      <FlexChat />

      {/* ── Premium Notification Toast ── */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-auto sm:max-w-md"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-maroon-600/15 border border-maroon-200/40 dark:border-maroon-900/40">
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-maroon-600 via-rose-500 to-maroon-700 animate-gradient rounded-2xl" />
              <div className="relative m-[2px] bg-white/90 dark:bg-[#0b0f19]/80 backdrop-blur-2xl rounded-[14px] p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-maroon-500 to-maroon-700 flex items-center justify-center shadow-lg shadow-maroon-600/20">
                      <Bell size={20} className="text-white animate-bell" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-badge" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      New Recovery Plan Assigned!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Your doctor has prescribed a personalized AI-guided exercise plan. Check your Workout Groups to get started.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Link
                        href="/workout"
                        onClick={dismissNotification}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-maroon-600 text-white text-xs font-bold hover:bg-maroon-700 transition-colors shadow-sm"
                      >
                        View Plan <ArrowUpRight size={12} />
                      </Link>
                      <button
                        onClick={dismissNotification}
                        className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors px-2 py-1.5"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={dismissNotification}
                    className="shrink-0 p-1 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative mb-8 pt-4"
      >
        <p className="text-sm text-slate-400 dark:text-slate-400 font-medium mb-1">{greeting},</p>
        <h1
          className="text-3xl sm:text-4xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="text-gradient-maroon">{displayName}</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base flex items-center gap-2">
          <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </motion.div>

      {/* ── 🎮 Gamification Panel ── */}
      <GamificationPanel />

      {/* ── Recent Sessions ── */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative z-10"
      >
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/[0.03] pointer-events-none" />
          <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Activity size={16} className="text-maroon-700 dark:text-maroon-400" />
              </div>
              <h2 className="font-semibold text-base text-slate-800 dark:text-slate-100">Recent Sessions</h2>
            </div>
            {sessions.length > 0 && (
              <Link href="/workout" className="text-[10px] text-maroon-600 dark:text-maroon-400 font-bold hover:text-maroon-800 transition-colors flex items-center gap-0.5">
                View All <ChevronRight size={10} />
              </Link>
            )}
          </div>
          {sessions.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 border border-slate-100 dark:border-slate-700">
                <Play size={22} className="text-maroon-400 translate-x-0.5" />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">No sessions yet</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
                Complete your first AI-guided exercise to see your history here.
              </p>
              <Link
                href="/workout"
                className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 rounded-xl bg-maroon-600 text-white text-xs font-bold hover:bg-maroon-700 transition-colors shadow-sm shadow-maroon-600/10"
              >
                Start First Workout <ArrowUpRight size={12} />
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {sessions.map((session, i) => {
                const sessionDate = new Date(session.date);
                const now = new Date();
                const diffDays = Math.floor(
                  (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
                );
                let dateLabel = sessionDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
                if (diffDays === 0) dateLabel = "Today";
                else if (diffDays === 1) dateLabel = "Yesterday";
                else if (diffDays < 7) dateLabel = `${diffDays}d ago`;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className="group flex items-center justify-between p-3.5 rounded-xl bg-white/60 dark:bg-slate-800/40 border border-slate-100/80 dark:border-slate-700/50 hover:border-maroon-200/40 dark:hover:border-maroon-500/30 hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${scoreBg(session.score)}`}>
                        <Dumbbell size={14} className={scoreColor(session.score)} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">
                          {session.exerciseName}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {dateLabel} · {session.reps} reps
                        </p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${scoreColor(session.score)} tabular-nums`}>
                      {session.score}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
          </div>
        </div>
      </motion.div>
    </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
