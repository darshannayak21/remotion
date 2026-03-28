"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import StatCard from "@/components/ui/StatCard";
import {
  Flame,
  Target,
  Zap,
  TrendingUp,
  Activity,
  AlertTriangle,
  Brain,
  Dumbbell,
  Trophy,
  BarChart3,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

// Mock data — will be replaced by real telemetry
const MOCK = {
  todayWorkout: "Supported Squat",
  lastScore: 87,
  streak: 5,
  avgAccuracy: 82.4,
  totalReps: 248,
  consistencyScore: 78,
  formImprovement: 12,
  weakAreas: [
    { joint: "Right Knee Stability", severity: "high" as const },
    { joint: "Left Shoulder Flexion", severity: "medium" as const },
    { joint: "Back Posture (Squats)", severity: "low" as const },
  ],
  insights: [
    { text: "You tend to lean forward during squats — focus on chest-up cue", icon: "⚠️" },
    { text: "Left-right imbalance detected in knee raises (6° gap)", icon: "📊" },
    { text: "Your hip extension range improved 14% this week", icon: "🎯" },
    { text: "Try slowing down your reps for better muscle activation", icon: "💡" },
  ],
  recentSessions: [
    { name: "Standing Sky Reach", score: 92, reps: 20, date: "Today" },
    { name: "Supported Squat", score: 78, reps: 15, date: "Yesterday" },
    { name: "Wall Push-ups", score: 88, reps: 18, date: "2 days ago" },
  ],
};

function severityColor(s: string) {
  if (s === "high") return "text-rose-500 bg-rose-50";
  if (s === "medium") return "text-amber-600 bg-amber-50";
  return "text-emerald-600 bg-emerald-50";
}

function scoreColor(s: number) {
  if (s >= 90) return "text-emerald-600";
  if (s >= 75) return "text-amber-600";
  return "text-rose-500";
}

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          Welcome back, <span className="text-gradient-maroon">Darshan</span>
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm sm:text-base">
          Here&apos;s your fitness overview for today
        </p>
      </motion.div>

      {/* ── Daily Overview ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
      >
        <motion.div custom={0} variants={fadeUp}>
          <StatCard
            label="Today's Workout"
            value={1}
            suffix=""
            icon={<Dumbbell size={20} />}
            color="text-maroon-700"
          />
          <p className="text-xs text-slate-500 mt-1 ml-1 truncate">{MOCK.todayWorkout}</p>
        </motion.div>
        <motion.div custom={1} variants={fadeUp}>
          <StatCard
            label="Last Session Score"
            value={MOCK.lastScore}
            suffix="%"
            icon={<Target size={20} />}
            color="text-maroon-700"
          />
        </motion.div>
        <motion.div custom={2} variants={fadeUp}>
          <StatCard
            label="Day Streak"
            value={MOCK.streak}
            suffix=" days"
            icon={<Flame size={20} />}
            color="text-amber-600"
          />
        </motion.div>
        <motion.div custom={3} variants={fadeUp}>
          <StatCard
            label="Total Reps"
            value={MOCK.totalReps}
            icon={<Zap size={20} />}
            color="text-emerald-600"
          />
        </motion.div>
      </motion.div>

      {/* ── Performance + Scores Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6">
        {/* Performance Summary */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
          <GlassCard className="h-full">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} className="text-maroon-700" />
              <h2 className="font-semibold text-lg">Performance Summary</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-sm text-slate-500 mb-1">Average Accuracy</p>
                <p className="text-3xl font-bold text-maroon-700">
                  {MOCK.avgAccuracy}
                  <span className="text-base font-medium text-slate-400">%</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Reps This Week</p>
                <p className="text-3xl font-bold text-slate-800">{MOCK.totalReps}</p>
              </div>
            </div>

            {/* Weak Areas */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Weak Areas
              </p>
              <div className="space-y-2">
                {MOCK.weakAreas.map((area, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2.5"
                  >
                    <AlertTriangle size={14} className={severityColor(area.severity).split(" ")[0]} />
                    <span className="text-sm text-slate-700">{area.joint}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${severityColor(
                        area.severity
                      )}`}
                    >
                      {area.severity.toUpperCase()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Consistency + Form Scores */}
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <div className="space-y-4 h-full flex flex-col">
            <GlassCard className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={18} className="text-amber-500" />
                <h3 className="font-semibold">Consistency Score</h3>
              </div>
              <div className="relative w-28 h-28 mx-auto mb-2">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#cc2952"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 42 * (1 - MOCK.consistencyScore / 100),
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-maroon-700">
                    {MOCK.consistencyScore}%
                  </span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-emerald-500" />
                <h3 className="font-semibold">Form Improvement</h3>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-bold text-emerald-600">
                  +{MOCK.formImprovement}%
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">vs. last week</p>
            </GlassCard>
          </div>
        </motion.div>
      </div>

      {/* ── AI Insights + Recent Sessions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* AI Insights */}
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Brain size={18} className="text-maroon-700" />
              <h2 className="font-semibold text-lg">AI Insights</h2>
            </div>
            <div className="space-y-3">
              {MOCK.insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-maroon-50/50 border border-maroon-100/50"
                >
                  <span className="text-lg shrink-0 mt-0.5">{insight.icon}</span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {insight.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Recent Sessions */}
        <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible">
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={18} className="text-maroon-700" />
              <h2 className="font-semibold text-lg">Recent Sessions</h2>
            </div>
            <div className="space-y-3">
              {MOCK.recentSessions.map((session, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/60 border border-slate-100 hover:border-maroon-200/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm text-slate-800">{session.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {session.date} · {session.reps} reps
                    </p>
                  </div>
                  <div className={`text-lg font-bold ${scoreColor(session.score)}`}>
                    {session.score}%
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
