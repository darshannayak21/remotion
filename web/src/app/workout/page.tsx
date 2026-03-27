"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkout } from "@/context/WorkoutContext";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { EXERCISES, getExerciseById, Exercise } from "@/data/exerciseData";
import {
  saveWorkoutSession,
  getWorkoutGroups,
  WorkoutGroup,
} from "@/lib/userService";
import {
  Play,
  Pause,
  SkipForward,
  Mic,
  MicOff,
  Eye,
  EyeOff,
  Target,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Timer,
  Video,
  Camera,
  CheckCircle2,
  Circle,
  Gauge,
  BarChart3,
  MessageCircle,
} from "lucide-react";

function WorkoutContent() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const {
    selectedExerciseId,
    setSelectedExerciseId,
    voiceEnabled,
    setVoiceEnabled,
    demoVideoEnabled,
    mode,
    setMode,
  } = useWorkout();

  // Exercise queue
  const [exerciseQueue, setExerciseQueue] = useState<Exercise[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [queueOpen, setQueueOpen] = useState(true);
  const activeExercise = exerciseQueue[activeIndex];

  // Saved Groups for Zero State
  const [savedGroups, setSavedGroups] = useState<WorkoutGroup[]>([]);

  useEffect(() => {
    if (!user) return;
    const loadGroups = async () => {
      try {
        const groups = await getWorkoutGroups(user.uid);
        setSavedGroups(groups);
      } catch (e) {
        console.error("Failed to load workout groups:", e);
      }
    };
    loadGroups();
  }, [user]);

  // Session state
  const [isRunning, setIsRunning] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [totalSets, setTotalSets] = useState(3);
  const [targetReps, setTargetReps] = useState(10);
  const [reps, setReps] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [status, setStatus] = useState<"READY" | "PERFECT" | "GOOD" | "NEEDS WORK">("READY");
  // Timer
  const [elapsed, setElapsed] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [engineMode, setEngineMode] = useState("IDLE");

  // Toggles
  const [showJointAngles, setShowJointAngles] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Duration per exercise (minutes)
  const [durations, setDurations] = useState<Record<string, number>>(() => {
    const d: Record<string, number> = {};
    EXERCISES.forEach((e) => (d[e.id] = e.duration));
    return d;
  });

  // Pick up exercise or queue from URL param
  useEffect(() => {
    const q = searchParams.get("queue");
    if (q) {
      const ids = q.split(",");
      const newQueue = ids.map((id) => getExerciseById(id)).filter(Boolean) as Exercise[];
      if (newQueue.length > 0) {
        setExerciseQueue(newQueue);
        setActiveIndex(0);
        setSelectedExerciseId(newQueue[0].id);
        return;
      }
    }

    const ex = searchParams.get("exercise");
    if (ex) {
      const idx = exerciseQueue.findIndex((e) => e.id === ex);
      if (idx >= 0) {
        setActiveIndex(idx);
        setSelectedExerciseId(ex);
      } else {
        const found = getExerciseById(ex);
        if (found) {
          const newQueue = [found, ...exerciseQueue.filter((e) => e.id !== ex)];
          setExerciseQueue(newQueue);
          setActiveIndex(0);
          setSelectedExerciseId(ex);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


  // ── Voice Announcements: Rep-Based Exercises ──
  const prevRepsRef = useRef(0);
  const announcedSetsRef = useRef(new Set<number>());

  useEffect(() => {
    if (!activeExercise || activeExercise.isHoldBased || !voiceEnabled) return;

    if (reps > prevRepsRef.current) {
      prevRepsRef.current = reps;

      if (reps === targetReps) {
         if (!announcedSetsRef.current.has(currentSet)) {
           announcedSetsRef.current.add(currentSet);
           fetch("http://127.0.0.1:8000/speak", {
             method: "POST", headers: { "Content-Type": "application/json" },
             body: JSON.stringify({text: `Great job! That's one set.`})
           }).catch(() => {});
         }
      } else if (reps === targetReps - 1) {
         fetch("http://127.0.0.1:8000/speak", {
           method: "POST", headers: { "Content-Type": "application/json" },
           body: JSON.stringify({text: `Just one more!`})
         }).catch(() => {});
      } else if (reps > 0 && reps < targetReps - 1) {
         fetch("http://127.0.0.1:8000/speak", {
           method: "POST", headers: { "Content-Type": "application/json" },
           body: JSON.stringify({text: `That's ${reps}`})
         }).catch(() => {});
      }
    } else if (reps === 0) {
      prevRepsRef.current = 0; // reset on set change
    }
  }, [reps, activeExercise, currentSet, voiceEnabled, targetReps]);

  // ── Voice Announcements: Hold-Based Exercises ──
  const holdSecondsRef = useRef(0);
  
  useEffect(() => {
    if (!isRunning || !activeExercise?.isHoldBased || !voiceEnabled) return;
    
    const iv = setInterval(() => {
       if (status === "PERFECT" || status === "GOOD") {
           holdSecondsRef.current += 1;
           const s = holdSecondsRef.current;
           if (s === 10) {
               fetch("http://127.0.0.1:8000/speak", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({text: "10 seconds, keep holding!"}) }).catch(()=>{});
           } else if (s === 20) {
               fetch("http://127.0.0.1:8000/speak", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({text: "20 seconds, almost there!"}) }).catch(()=>{});
           } else if (s === targetReps) {
               if (!announcedSetsRef.current.has(currentSet)) {
                  announcedSetsRef.current.add(currentSet);
                  fetch("http://127.0.0.1:8000/speak", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({text: `Great job! That's one set.`}) }).catch(()=>{});
               }
           }
       }
    }, 1000);
    return () => clearInterval(iv);
  }, [isRunning, status, activeExercise, currentSet, voiceEnabled, targetReps]);

  // Sync selected exercise
  useEffect(() => {
    if (activeExercise) {
      setSelectedExerciseId(activeExercise.id);

      // Auto-play demo if available on exercise switch
      if (activeExercise.demoVideo && demoVideoEnabled) {
        setShowDemo(true);
        setIsRunning(false);
        try { fetch("http://127.0.0.1:8000/stop"); } catch (e) { }
      } else {
        setShowDemo(false);
      }
    }
  }, [activeIndex, activeExercise, setSelectedExerciseId, demoVideoEnabled]);

  // Timer tick
  useEffect(() => {
    if (!isRunning || isResting || engineMode !== "ACTIVE_COACHING") return;
    const iv = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(iv);
  }, [isRunning, isResting, engineMode]);

  // Rest timer
  useEffect(() => {
    if (!isResting || restTimer <= 0) return;
    const iv = setInterval(() => {
      setRestTimer((t) => {
        if (t <= 1) {
          setIsResting(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [isResting, restTimer]);

  // Fetch real live data from Python API
  useEffect(() => {
    if (!isRunning) return;
    const iv = setInterval(async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/metrics");
        if (!res.ok) return;
        const data = await res.json();
        if (data.is_running) {
          setReps(data.reps);
          setAccuracy(data.accuracy);
          setStatus(data.status);
          setEngineMode(data.mode);
        } else {
          setEngineMode("IDLE");
        }
      } catch (e) {
        // Silently ignore connection errors to avoid spamming console
      }
    }, 500);
    return () => clearInterval(iv);
  }, [isRunning]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // Save session data to Firestore when moving to next exercise
  const saveCurrentSession = async (overrideSet?: number) => {
    if (!user || !activeExercise || reps === 0) return;
    try {
      await saveWorkoutSession(user.uid, {
        exerciseId: activeExercise.id,
        exerciseName: activeExercise.name,
        score: accuracy > 0 ? Math.round(accuracy) : 0,
        reps,
        targetReps,
        duration: elapsed,
        date: new Date().toISOString(),
        setNumber: overrideSet || currentSet,
      });
    } catch (err) {
      console.error("Failed to save workout session:", err);
    }
  };

  const nextExercise = async () => {
    if (activeIndex < exerciseQueue.length - 1) {
      await saveCurrentSession();
      setActiveIndex(activeIndex + 1);
      resetSession();
    }
  };

  const prevExercise = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      resetSession();
    }
  };

  const resetSession = async () => {
    setIsRunning(false);
    setReps(0);
    setAccuracy(0);
    setElapsed(0);
    setCurrentSet(1);
    setStatus("READY");
    setEngineMode("IDLE");
    prevRepsRef.current = 0;
    holdSecondsRef.current = 0;
    announcedSetsRef.current.clear();
    try {
      await fetch("http://127.0.0.1:8000/stop");
    } catch (e) { }
  };

  const toggleRunning = async () => {
    if (isRunning) {
      setIsRunning(false);
      try {
        await fetch("http://127.0.0.1:8000/stop");
      } catch (e) { }
    } else {
      setIsRunning(true);
    }
  };

  const startRest = () => {
    setIsResting(true);
    setRestTimer(30);
    setIsRunning(false);
  };

  const nextSet = async () => {
    if (currentSet < totalSets) {
      if (!announcedSetsRef.current.has(currentSet)) {
        announcedSetsRef.current.add(currentSet);
        fetch("http://127.0.0.1:8000/speak", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({text: `Great job! That's one set.`})
        }).catch(() => {});
      }
      await saveCurrentSession(currentSet);
      setCurrentSet(currentSet + 1);
      setReps(0);
      setElapsed(0);
      setIsRunning(true);
      setIsResting(false);
      setRestTimer(0);
      prevRepsRef.current = 0;
      holdSecondsRef.current = 0;
    } else {
      if (!announcedSetsRef.current.has(currentSet)) {
        announcedSetsRef.current.add(currentSet);
        fetch("http://127.0.0.1:8000/speak", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({text: `Great job! You completed set ${currentSet}.`})
        }).catch(() => {});
      }
      await saveCurrentSession(currentSet);
      nextExercise();
    }
  };

  const statusColor = (s: string) => {
    if (s === "PERFECT") return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    if (s === "GOOD") return "text-amber-400 bg-amber-500/10 border-amber-500/30";
    if (s === "NEEDS WORK") return "text-rose-400 bg-rose-500/10 border-rose-500/30";
    return "text-slate-400 bg-white/5 dark:bg-white/5 border-slate-200 dark:border-slate-700";
  };

  const updateDuration = (exId: string, delta: number) => {
    setDurations((prev) => ({
      ...prev,
      [exId]: Math.max(1, Math.min(30, (prev[exId] || 3) + delta)),
    }));
  };

  // ── ZERO STATE: No active queue ──
  if (exerciseQueue.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-[#060a14] min-h-screen">
        <div className="text-center w-full max-w-4xl mx-auto">
          <div className="w-20 h-20 bg-maroon-100 dark:bg-maroon-900/30 text-maroon-700 dark:text-maroon-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <BarChart3 size={36} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Ready to Workout?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10 text-base sm:text-lg max-w-xl mx-auto">
            You don't have an active exercise queue. Choose from your saved custom routines to launch your AI physiotherapy session.
          </p>

          {savedGroups.length > 0 ? (
            <div className="text-left w-full mb-10">
              <h2 className="font-semibold text-slate-700 dark:text-slate-200 text-lg mb-5 flex items-center gap-2">
                <Target size={20} className="text-maroon-600 dark:text-maroon-400" />
                Your Saved Routines
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedGroups.map(group => (
                  <button
                    key={group.id}
                    onClick={() => router.push(`/workout?queue=${group.exercises.join(',')}`)}
                    className="glass p-6 rounded-2xl text-left hover:border-maroon-300 dark:hover:border-maroon-600 transition-all group shadow-sm text-slate-800 dark:text-slate-100 flex flex-col h-full bg-white/80 dark:bg-white/5 dark:backdrop-blur-xl dark:border dark:border-white/10"
                  >
                    <h3 className="font-bold text-lg mb-1 group-hover:text-maroon-700 transition-colors">{group.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 flex-1">{group.exercises.length} Exercises bundled together</p>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between w-full">
                      <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-maroon-600 dark:group-hover:text-maroon-400 transition-colors">START SESSION</span>
                      <div className="w-8 h-8 rounded-full bg-maroon-50 text-maroon-700 flex items-center justify-center group-hover:bg-maroon-700 group-hover:text-white transition-colors">
                        <Play size={14} className="ml-0.5" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass p-8 rounded-3xl mb-10 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 max-w-md mx-auto shadow-sm">
              <p className="text-slate-500 mb-3 font-medium">You haven't built any custom routines yet.</p>
              <p className="text-sm text-slate-400">Head over to the Library to mix and match your perfect workout.</p>
            </div>
          )}

          <button
            onClick={() => router.push('/library')}
            className="px-8 py-3.5 bg-maroon-700 text-white font-medium rounded-xl hover:bg-maroon-800 transition-colors shadow-lg shadow-maroon-700/20 text-base"
          >
            + Build New Custom Routine
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-0px)] md:h-screen overflow-hidden">
      {/* ── Exercise Queue Panel (GFG-style) ── */}
      <AnimatePresence>
        {queueOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hidden md:flex flex-col bg-white dark:bg-[#0b0f19] border-r border-slate-100 dark:border-slate-800 overflow-hidden shrink-0"
          >
            <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 size={16} className="text-maroon-700 dark:text-maroon-400" />
                Exercise Queue ({exerciseQueue.length})
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {activeIndex + 1} of {exerciseQueue.length} complete
              </p>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-maroon-600 to-maroon-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((activeIndex) / exerciseQueue.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {exerciseQueue.map((ex, i) => {
                const isActive = i === activeIndex;
                const isDone = i < activeIndex;
                return (
                  <motion.button
                    key={ex.id}
                    onClick={() => {
                      setActiveIndex(i);
                      resetSession();
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left px-4 py-3 border-l-3 transition-all ${isActive
                        ? "border-l-maroon-700 bg-maroon-50/60 dark:bg-maroon-900/20"
                        : isDone
                          ? "border-l-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10"
                          : "border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                      ) : isActive ? (
                        <div className="w-4 h-4 rounded-full border-2 border-maroon-700 flex items-center justify-center shrink-0">
                          <div className="w-2 h-2 rounded-full bg-maroon-700 animate-pulse" />
                        </div>
                      ) : (
                        <Circle size={16} className="text-slate-300 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-medium truncate ${isActive ? "text-maroon-800 dark:text-maroon-300" : isDone ? "text-slate-500" : "text-slate-700 dark:text-slate-300"
                            }`}
                        >
                          {ex.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Timer size={10} /> {durations[ex.id] || ex.duration} min
                          </span>
                          {isActive && (
                            <div className="flex items-center gap-0.5">
                              <div
                                role="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateDuration(ex.id, -1);
                                }}
                                className="w-4 h-4 rounded bg-maroon-100 text-maroon-700 text-[10px] flex items-center justify-center hover:bg-maroon-200 cursor-pointer"
                              >
                                −
                              </div>
                              <div
                                role="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateDuration(ex.id, 1);
                                }}
                                className="w-4 h-4 rounded bg-maroon-100 text-maroon-700 text-[10px] flex items-center justify-center hover:bg-maroon-200 cursor-pointer"
                              >
                                +
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Vertical progress indicator */}
                    {isActive && (
                      <div className="mt-2 h-1 bg-maroon-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-maroon-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(100, (elapsed / ((durations[ex.id] || ex.duration) * 60)) * 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Queue toggle */}
      <button
        onClick={() => setQueueOpen(!queueOpen)}
        className="hidden md:flex absolute left-[68px] top-1/2 -translate-y-1/2 z-40 w-5 h-12 items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-lg shadow-sm hover:bg-maroon-50 dark:hover:bg-slate-700 transition-colors"
        style={{ left: queueOpen ? "calc(68px + 280px)" : "68px" }}
      >
        {queueOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* ── Main Work Area ── */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white" style={{ fontFamily: "var(--font-display)" }}>
                {activeExercise?.name || "Select Exercise"}
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {activeExercise?.category} · {activeExercise?.targetJoints.join(", ")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switch */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-white/5 rounded-lg p-0.5">
              <button
                onClick={() => setMode("beginner")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === "beginner"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-maroon-700 dark:text-maroon-300"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
              >
                Beginner
              </button>
              <button
                onClick={() => setMode("advanced")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === "advanced"
                    ? "bg-white dark:bg-slate-700 shadow-sm text-maroon-700 dark:text-maroon-300"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
              >
                Advanced
              </button>
            </div>

            {/* Nav arrows */}
            <button
              onClick={prevExercise}
              disabled={activeIndex === 0}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextExercise}
              disabled={activeIndex === exerciseQueue.length - 1}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 p-4 sm:p-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
            {/* ── LEFT: Camera + Image ── */}
            <div className="xl:col-span-2 space-y-4">
              {/* Camera Frame / Demo Video */}
              <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-lg dark:shadow-2xl dark:shadow-black/30">
                <AnimatePresence mode="wait">
                  {demoVideoEnabled && showDemo ? (
                    <motion.div
                      key="demo"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-slate-900"
                    >
                      {activeExercise?.demoVideo ? (
                        <>
                          <video
                            src={activeExercise.demoVideo}
                            autoPlay
                            loop
                            playsInline
                            controls
                            className="w-full h-full object-contain bg-black"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowDemo(false)}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-maroon-700/80 backdrop-blur-md hover:bg-maroon-800/90 text-white rounded-2xl text-sm font-bold border border-maroon-500/30 transition-all shadow-xl shadow-maroon-900/50 flex items-center gap-2"
                          >
                            Skip Demo →
                          </motion.button>
                        </>
                      ) : (
                        <div className="text-center">
                          <Video size={48} className="text-maroon-400 mx-auto mb-3" />
                          <p className="text-slate-200 font-medium">Demo Video Placeholder</p>
                          <p className="text-slate-400 text-sm mt-1">{activeExercise?.name}</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowDemo(false)}
                            className="mt-5 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium border border-white/20 transition-colors"
                          >
                            Skip Demo →
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="camera"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black"
                    >
                      {!isRunning ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                          <div className="text-center">
                            <Camera size={56} className="text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400 font-medium">Camera Feed</p>
                            <p className="text-slate-500 text-sm mt-1">
                              Your ReMotion pose model runs here
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setIsRunning(true)}
                              className="mt-4 px-5 py-2.5 bg-maroon-700 hover:bg-maroon-800 text-white rounded-xl text-sm font-medium shadow-lg shadow-maroon-700/30 transition-colors"
                            >
                              <Camera size={16} className="inline mr-2" />
                              Start Exercise
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <img
                            src={`http://127.0.0.1:8000/video_feed?exercise=${activeExercise?.id}&user_name=${encodeURIComponent(user?.displayName?.split(' ')[0] || 'User')}`}
                            alt="ReMotion Engine Stream"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: -1 }}>
                            <div className="text-center">
                              <div className="animate-spin w-8 h-8 border-3 border-maroon-700 border-t-transparent rounded-full mx-auto mb-3" />
                              <p className="text-slate-400 text-sm">Starting ReMotion Engine...</p>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Status overlay */}
                      {isRunning && (
                        <div className="absolute top-4 left-4 z-10">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-white text-xs font-medium">LIVE</span>
                          </div>
                        </div>
                      )}

                      {/* Timer overlay */}
                      {isRunning && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-lg border border-white/10">
                            <span className="text-white text-sm font-mono font-semibold">
                              {formatTime(elapsed)}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Controls bar */}
              <div className="flex items-center justify-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={resetSession}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                  <RotateCcw size={18} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleRunning}
                  className={`p-4 rounded-2xl text-white shadow-lg transition-all ${isRunning
                      ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/30"
                      : "bg-maroon-700 hover:bg-maroon-800 shadow-maroon-700/30"
                    }`}
                >
                  {isRunning ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={nextExercise}
                  className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                  <SkipForward size={18} />
                </motion.button>
                {activeExercise?.demoVideo && (
                  <motion.button
                    title="View Demo Video"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setShowDemo(true); setIsRunning(false); try { fetch("http://127.0.0.1:8000/stop"); } catch (e) { } }}
                    className="p-3 rounded-xl bg-maroon-50 dark:bg-maroon-900/20 text-maroon-700 dark:text-maroon-400 hover:bg-maroon-100 dark:hover:bg-maroon-900/40 transition-colors ml-2 shadow-sm border border-maroon-100 dark:border-maroon-800/30"
                  >
                    <Video size={18} />
                  </motion.button>
                )}
              </div>

              {/* Exercise Image (Moved Below) */}
              <div className="aspect-video md:aspect-[3/1] bg-gradient-to-br from-maroon-50 dark:from-maroon-950/30 to-slate-50 dark:to-slate-900/50 rounded-2xl flex items-center justify-center border border-maroon-100/50 dark:border-maroon-800/20 overflow-hidden relative">
                {activeExercise?.image ? (
                  <img src={activeExercise.image} alt={activeExercise.name} className="w-full h-full object-cover sm:object-contain bg-white dark:bg-slate-900" />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-maroon-100 flex items-center justify-center mx-auto mb-2">
                      <Gauge size={28} className="text-maroon-600" />
                    </div>
                    <p className="text-sm font-medium text-maroon-800">
                      {activeExercise?.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">No reference image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT: Stats & Controls ── */}
            <div className="space-y-4">
              {/* Live Stats */}
              <div className="rounded-2xl p-4 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.06] shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <BarChart3 size={14} className="text-maroon-700 dark:text-maroon-400" />
                  Live Stats
                </h3>
                <div className={`grid ${activeExercise?.isHoldBased ? "grid-cols-2" : "grid-cols-3"} gap-3`}>
                  {!activeExercise?.isHoldBased && (
                    <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-transparent dark:border-white/[0.06]">
                      <p className="text-2xl font-bold text-maroon-700 dark:text-maroon-400">{reps}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">REPS</p>
                    </div>
                  )}
                  <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-transparent dark:border-white/[0.06]">
                    <p className="text-2xl font-bold text-maroon-700 dark:text-maroon-400">
                      {accuracy > 0 ? accuracy.toFixed(0) : "—"}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">ACCURACY %</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-transparent dark:border-white/[0.06]">
                    <div
                      className={`inline-flex px-2 py-1 rounded-lg text-xs font-bold border ${statusColor(
                        status
                      )}`}
                    >
                      {status}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-1.5">STATUS</p>
                  </div>
                </div>
              </div>

              {/* Set System */}
              <div className="rounded-2xl p-4 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.06] shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Set Tracking</h3>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalSets }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${i + 1 === currentSet
                            ? "bg-maroon-700 text-white shadow-lg"
                            : i + 1 < currentSet
                              ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                              : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500"
                          }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTotalSets(Math.max(1, totalSets - 1))}
                      className="w-6 h-6 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10"
                    >
                      −
                    </button>
                    <button
                      onClick={() => setTotalSets(Math.min(10, totalSets + 1))}
                      className="w-6 h-6 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Reps / Secs</div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTargetReps(Math.max(1, targetReps - 1))}
                      className="w-6 h-6 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold w-6 text-center text-slate-800 dark:text-white">{targetReps}</span>
                    <button
                      onClick={() => setTargetReps(Math.min(50, targetReps + 1))}
                      className="w-6 h-6 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Rest timer */}
                {isResting ? (
                  <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
                    <p className="text-xs font-semibold text-amber-700 mb-1">REST</p>
                    <p className="text-3xl font-bold text-amber-600 font-mono">{restTimer}s</p>
                    <button
                      onClick={nextSet}
                      className="mt-2 px-4 py-1.5 bg-maroon-700 text-white text-xs font-medium rounded-lg hover:bg-maroon-800"
                    >
                      Skip Rest → Next Set
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={startRest}
                      className="flex-1 px-3 py-2 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    >
                      <Timer size={12} className="inline mr-1" />
                      Rest (30s)
                    </button>
                    <button
                      onClick={nextSet}
                      disabled={currentSet >= totalSets}
                      className="flex-1 px-3 py-2 bg-maroon-50 dark:bg-maroon-900/20 text-maroon-700 dark:text-maroon-400 text-xs font-medium rounded-lg hover:bg-maroon-100 dark:hover:bg-maroon-900/40 disabled:opacity-30 transition-colors"
                    >
                      Next Set →
                    </button>
                  </div>
                )}
              </div>

              {/* Voice Toggle */}
              <div className="rounded-2xl p-4 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.06] shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Voice Mode</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {voiceEnabled ? '"Hey Flex" active' : "Voice disabled"}
                    </p>
                  </div>
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`p-2.5 rounded-xl transition-all ${voiceEnabled
                        ? "bg-maroon-700 text-white shadow-lg shadow-maroon-700/30"
                        : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500"
                      }`}
                  >
                    {voiceEnabled ? <Mic size={18} /> : <MicOff size={18} />}
                  </button>
                </div>

                {/* Talk to ReMotion button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-maroon-600 to-maroon-800 text-white text-sm font-medium rounded-xl shadow-lg shadow-maroon-700/20 hover:shadow-maroon-700/40 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Talk to Flex
                </motion.button>
              </div>

              {/* Live Metrics */}
              <div className="rounded-2xl p-4 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.06] shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Live Metrics</h3>
                  <button
                    onClick={() => setShowJointAngles(!showJointAngles)}
                    className={`p-1.5 rounded-lg transition-colors ${showJointAngles
                        ? "bg-maroon-50 dark:bg-maroon-900/20 text-maroon-700 dark:text-maroon-400"
                        : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500"
                      }`}
                  >
                    {showJointAngles ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>


                {/* Joint angles (toggleable) */}
                <AnimatePresence>
                  {showJointAngles && activeExercise && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-white/[0.06]">
                        {activeExercise.joints.map((j) => (
                          <div
                            key={j.name}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-slate-600 dark:text-slate-400 capitalize">
                              {j.name.replace(/_/g, " ")}
                            </span>
                            <span className="font-mono text-slate-800 dark:text-slate-200">
                              {j.idealRange[0]}°–{j.idealRange[1]}°
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Exercise Info (Mobile) */}
              <div className="md:hidden rounded-2xl p-4 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.06] shadow-sm">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
                  Queue ({activeIndex + 1}/{exerciseQueue.length})
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {exerciseQueue.map((ex, i) => (
                    <button
                      key={ex.id}
                      onClick={() => {
                        setActiveIndex(i);
                        resetSession();
                      }}
                      className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all ${i === activeIndex
                          ? "bg-maroon-700 text-white"
                          : i < activeIndex
                            ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                            : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300"
                        }`}
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkoutPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin w-8 h-8 border-3 border-maroon-700 border-t-transparent rounded-full" />
          </div>
        }
      >
        <WorkoutContent />
      </Suspense>
    </ProtectedRoute>
  );
}
