"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import AssignPlanModal from "@/components/doctor/AssignPlanModal";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  getDoctorPatients,
  removeLinkedPatient,
  PatientSummary,
} from "@/lib/doctorService";
import {
  Users,
  Activity,
  Target,
  Flame,
  Zap,
  TrendingUp,
  Clock,
  BarChart3,
  Stethoscope,
  ChevronRight,
  ChevronDown,
  Search,
  Loader2,
  UserCircle,
  LogOut,
  Sparkles,
  Trash2,
  Plus,
  Award,
  Calendar,
} from "lucide-react";

/* ── Animation Variants ── */
const staggerContainer: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const scaleIn: any = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

function scoreColor(s: number) {
  if (s >= 90) return "text-emerald-600";
  if (s >= 75) return "text-amber-600";
  return "text-rose-500";
}

function scoreBg(s: number) {
  if (s >= 90) return "bg-emerald-50 border-emerald-200/60";
  if (s >= 75) return "bg-amber-50 border-amber-200/60";
  return "bg-rose-50 border-rose-200/60";
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DoctorDashboardPage() {
  const { user, loading, role, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/doctor/login");
  };

  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientSummary | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  // Redirect if not doctor
  useEffect(() => {
    if (!loading && (!user || role !== "doctor")) {
      router.push("/doctor/login");
    }
  }, [user, loading, role, router]);

  // Fetch patients
  useEffect(() => {
    if (!user || role !== "doctor") return;
    const fetchPatients = async () => {
      try {
        const data = await getDoctorPatients(user.uid);
        setPatients(data);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      } finally {
        setLoadingPatients(false);
      }
    };
    fetchPatients();
  }, [user, role]);

  const handleRemovePatient = async (patientUid: string) => {
    if (!confirm("Are you sure you want to remove this patient from your dashboard?")) return;
    
    try {
      const res = await removeLinkedPatient(patientUid);
      if (res.success) {
        setPatients(prev => prev.filter(p => p.uid !== patientUid));
        if (selectedPatient?.uid === patientUid) setSelectedPatient(null);
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while removing the patient.");
    }
  };

  const doctorName = user?.displayName || "Doctor";
  const greeting = mounted ? getGreeting() : "";
  const dateString = mounted ? new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) : "";

  const filteredPatients = patients.filter(
    (p) =>
      p.displayName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  // Aggregate stats
  const totalPatients = patients.length;
  const totalSessions = patients.reduce((a, p) => a + p.stats.sessionsCount, 0);
  const avgAccuracy =
    patients.length > 0
      ? patients.reduce((a, p) => a + p.stats.avgAccuracy, 0) / patients.length
      : 0;
  const totalReps = patients.reduce((a, p) => a + p.stats.totalReps, 0);
  const activePatients = patients.filter(p => p.stats.sessionsCount > 0).length;

  if (loading || role !== "doctor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-maroon-100" />
            <div className="absolute inset-0 rounded-full border-2 border-maroon-600 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300">
      {/* ── Ambient Background Blobs ── */}
      <div className="ambient-blob w-[500px] h-[500px] bg-maroon-300/40 dark:bg-maroon-900/30 -top-48 -right-48 animate-float-slow" />
      <div className="ambient-blob w-[350px] h-[350px] bg-rose-200/40 dark:bg-rose-900/20 top-1/2 -left-40 animate-float-medium" />
      <div className="ambient-blob w-[300px] h-[300px] bg-amber-100/40 dark:bg-amber-900/10 bottom-20 right-20 animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-10">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative mb-8"
      >
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center shadow-xl shadow-maroon-700/20">
              <Stethoscope size={22} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium">{greeting},</p>
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Dr. <span className="text-gradient-maroon">{doctorName}</span>
              </h1>
              {mounted && (
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Calendar size={11} /> {dateString}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsAssignModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-maroon-600 text-sm font-bold text-white shadow-lg shadow-maroon-600/15 hover:bg-maroon-700 transition-all"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Assign Plan</span>
            </motion.button>
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-700/40 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900 transition-all"
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AssignPlanModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        doctorUid={user?.uid || ""}
        doctorName={doctorName}
      />

      {/* ── Stats Cards ── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 relative z-10"
      >
        {[
          { label: "Total Patients", value: totalPatients, icon: <Users size={20} />, color: "text-maroon-700", bg: "bg-maroon-50" },
          { label: "Total Sessions", value: totalSessions, icon: <Activity size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Avg Accuracy", value: avgAccuracy > 0 ? `${avgAccuracy.toFixed(1)}%` : "—", icon: <Target size={20} />, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Total Reps", value: totalReps, icon: <Zap size={20} />, color: "text-violet-500", bg: "bg-violet-50" },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeUp}>
            <div className="relative overflow-hidden rounded-3xl p-5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)] group transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/[0.03] pointer-events-none" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer rounded-3xl" />
              <div className="relative flex items-center gap-3.5 z-10">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} dark:bg-opacity-10 ring-1 ring-black/[0.03] dark:ring-white/[0.05]`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <div>
                  <p className={`text-2xl font-bold tracking-tight ${stat.color} dark:brightness-110`}>{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{stat.label}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10">
        {/* Patient List (left 2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Search Bar */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl glass text-sm focus:outline-none focus:ring-2 focus:ring-maroon-200/50 focus:border-maroon-300 transition-all placeholder:text-slate-400"
              />
            </div>
          </motion.div>

          {/* Patients Card */}
          <motion.div variants={scaleIn} initial="hidden" animate="visible">
            <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/[0.03] pointer-events-none" />
              <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-maroon-50 dark:bg-maroon-500/10 flex items-center justify-center">
                    <Users size={16} className="text-maroon-700 dark:text-maroon-400" />
                  </div>
                  <h2 className="font-semibold text-base text-slate-800 dark:text-slate-100">Patients</h2>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {filteredPatients.length} found
                </span>
              </div>

              {loadingPatients ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <div className="relative w-10 h-10 mx-auto mb-3">
                      <div className="absolute inset-0 rounded-full border-2 border-maroon-100" />
                      <div className="absolute inset-0 rounded-full border-2 border-maroon-600 border-t-transparent animate-spin" />
                    </div>
                    <p className="text-xs text-slate-400">Loading patients...</p>
                  </div>
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3 border border-slate-100">
                    <Users size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">
                    {patients.length === 0
                      ? "No patients registered yet"
                      : "No patients match your search"}
                  </p>
                  {patients.length === 0 && (
                    <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
                      Use the &quot;Assign Plan&quot; button to add your first patient.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredPatients.map((patient, i) => {
                    const isSelected = selectedPatient?.uid === patient.uid;
                    const initial =
                      patient.displayName?.charAt(0)?.toUpperCase() || "P";
                    const joinedDate = patient.createdAt
                      ? new Date(patient.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Unknown";

                    return (
                      <motion.div
                        key={patient.uid}
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: i * 0.05 }}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            setSelectedPatient(isSelected ? null : patient)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setSelectedPatient(isSelected ? null : patient);
                            }
                          }}
                          className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-maroon-50/80 dark:bg-maroon-900/40 border-maroon-200/60 dark:border-maroon-700/50 shadow-md shadow-maroon-600/5"
                              : "bg-white/50 dark:bg-slate-800/40 border-slate-100/80 dark:border-slate-700 hover:border-maroon-200/40 dark:hover:border-maroon-800/50 hover:bg-white/70 dark:hover:bg-slate-800/80 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Avatar */}
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                                patient.stats.sessionsCount > 0
                                  ? "bg-gradient-to-br from-maroon-100 to-maroon-200 text-maroon-700 ring-1 ring-maroon-200/50"
                                  : "bg-slate-100 text-slate-500 ring-1 ring-slate-200/50"
                              }`}
                            >
                              {initial}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                                  {patient.displayName}
                                </p>
                                {patient.stats.sessionsCount > 0 ? (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 shrink-0 uppercase tracking-wide">
                                    Active
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-50 text-slate-400 border border-slate-100 shrink-0 uppercase tracking-wide">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 truncate">
                                {patient.email}
                              </p>
                              {(patient.age || patient.bloodGroup) && (
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                                  {patient.age ? `Age: ${patient.age}` : ""}
                                  {patient.age && patient.bloodGroup ? " · " : ""}
                                  {patient.bloodGroup ? `Blood: ${patient.bloodGroup}` : ""}
                                </p>
                              )}
                            </div>

                            {/* Quick Stats */}
                            <div className="hidden sm:flex items-center gap-5 shrink-0">
                              <div className="text-center">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200 tabular-nums">
                                  {patient.stats.sessionsCount}
                                </p>
                                <p className="text-[9px] text-slate-400 uppercase tracking-wide">Sessions</p>
                              </div>
                              <div className="text-center">
                                <p className={`text-sm font-bold tabular-nums ${
                                  patient.stats.avgAccuracy > 0
                                    ? scoreColor(patient.stats.avgAccuracy)
                                    : "text-slate-400"
                                }`}>
                                  {patient.stats.avgAccuracy > 0
                                    ? `${patient.stats.avgAccuracy.toFixed(0)}%`
                                    : "—"}
                                </p>
                                <p className="text-[9px] text-slate-400 uppercase tracking-wide">Score</p>
                              </div>
                            </div>

                            {isSelected ? (
                              <ChevronDown size={16} className="text-maroon-500 shrink-0" />
                            ) : (
                              <ChevronRight size={16} className="text-slate-400 shrink-0" />
                            )}
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="overflow-hidden"
                              >
                                <div className="mt-4 pt-4 border-t border-maroon-100/40">
                                  {/* Stats Grid */}
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                                    {[
                                      { icon: <Activity size={12} />, label: "Sessions", value: patient.stats.sessionsCount, iconColor: "text-maroon-600", bg: "bg-maroon-50" },
                                      { icon: <Zap size={12} />, label: "Total Reps", value: patient.stats.totalReps, iconColor: "text-emerald-600", bg: "bg-emerald-50" },
                                      { icon: <Flame size={12} />, label: "Streak", value: `${patient.stats.streak}d`, iconColor: "text-amber-600", bg: "bg-amber-50" },
                                      { icon: <TrendingUp size={12} />, label: "Form Δ", value: `${patient.stats.formImprovement > 0 ? "+" : ""}${patient.stats.formImprovement}%`, iconColor: "text-violet-600", bg: "bg-violet-50" },
                                    ].map((stat, j) => (
                                      <div key={j} className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-slate-100/60 dark:border-slate-700/50">
                                        <div className="flex items-center gap-1.5 mb-1">
                                          <div className={`w-5 h-5 rounded-md ${stat.bg} flex items-center justify-center`}>
                                            <span className={stat.iconColor}>{stat.icon}</span>
                                          </div>
                                          <span className="text-[9px] text-slate-400 uppercase tracking-wide font-medium">{stat.label}</span>
                                        </div>
                                        <p className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums">{stat.value}</p>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Recent Sessions */}
                                  {patient.recentSessions.length > 0 && (
                                    <div className="mb-3">
                                      <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                        Recent Sessions
                                      </p>
                                      <div className="space-y-1.5">
                                        {patient.recentSessions.slice(0, 3).map((session, j) => (
                                          <div
                                            key={j}
                                            className="flex items-center justify-between p-2.5 rounded-lg bg-white/60 dark:bg-slate-800/40 border border-slate-100/60 dark:border-slate-700/50"
                                          >
                                            <div>
                                              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                                                {session.exerciseName}
                                              </p>
                                              <p className="text-[10px] text-slate-400">
                                                {new Date(session.date).toLocaleDateString("en-IN", {
                                                  month: "short",
                                                  day: "numeric",
                                                })}{" "}
                                                · {session.reps} reps
                                              </p>
                                            </div>
                                            <span
                                              className={`text-xs font-bold px-2 py-1 rounded-full border ${scoreBg(
                                                session.score
                                              )} ${scoreColor(session.score)} tabular-nums`}
                                            >
                                              {session.score}%
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between pt-2 border-t border-slate-100/60">
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                      <Clock size={10} />
                                      <span>Joined {joinedDate}</span>
                                    </div>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemovePatient(patient.uid);
                                      }}
                                      className="px-2.5 py-1 rounded-lg text-[10px] text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 flex items-center gap-1 font-semibold transition"
                                    >
                                      <Trash2 size={11} /> Remove
                                    </motion.button>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* Activity Summary */}
          <motion.div variants={fadeUp}>
            <div className="relative overflow-hidden rounded-3xl p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/[0.03] pointer-events-none" />
              <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg bg-maroon-50 dark:bg-maroon-500/10 flex items-center justify-center">
                  <BarChart3 size={16} className="text-maroon-700 dark:text-maroon-400" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Activity Overview</h3>
              </div>

              {patients.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-3 border border-slate-100">
                    <UserCircle size={22} className="text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">No patient data yet</p>
                  <p className="text-xs text-slate-400 mt-1">Assign plans to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Active patients */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Active patients</span>
                      <span className="font-bold text-maroon-700 dark:text-maroon-400 tabular-nums">
                        {activePatients}/{totalPatients}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-maroon-500 to-maroon-700 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${
                            totalPatients > 0
                              ? (activePatients / totalPatients) * 100
                              : 0
                          }%`,
                        }}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    </div>
                  </div>

                  {/* Average accuracy */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-500 font-medium">Avg accuracy</span>
                      <span className="font-bold text-emerald-600 tabular-nums">
                        {avgAccuracy > 0 ? avgAccuracy.toFixed(1) : "—"}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${avgAccuracy}%` }}
                        transition={{ duration: 1.2, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                      />
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </motion.div>

          {/* Top Performers */}
          <motion.div variants={fadeUp}>
            <div className="relative overflow-hidden rounded-3xl p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/[0.03] pointer-events-none" />
              <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <Award size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Top Performers</h3>
              </div>

              {patients.filter(p => p.stats.sessionsCount > 0).length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-xs text-slate-400">No active patients yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {patients
                    .filter((p) => p.stats.sessionsCount > 0)
                    .sort((a, b) => b.stats.avgAccuracy - a.stats.avgAccuracy)
                    .slice(0, 3)
                    .map((p, i) => (
                      <div
                        key={p.uid}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-slate-100/60 card-hover-lift"
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          i === 0 ? "bg-amber-100 text-amber-700" :
                          i === 1 ? "bg-slate-100 text-slate-600" :
                          "bg-orange-50 text-orange-600"
                        }`}>
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {p.displayName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {p.stats.sessionsCount} sessions
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold tabular-nums ${scoreColor(p.stats.avgAccuracy)}`}
                        >
                          {p.stats.avgAccuracy.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                </div>
              )}
              </div>
            </div>
          </motion.div>

          {/* Portal Card */}
          <motion.div variants={fadeUp}>
            <div className="relative overflow-hidden rounded-3xl p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] text-center transition-shadow duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-maroon-600/5 to-rose-500/5 dark:from-maroon-900/10 dark:to-rose-900/10" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center mx-auto shadow-xl shadow-maroon-700/25 mb-3">
                  <Stethoscope size={20} className="text-white" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">ReMotion Doctor Portal</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Monitor patient progress in real-time
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
    </div>
  );
}
