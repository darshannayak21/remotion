"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { EXERCISES, CATEGORY_LIST, Exercise } from "@/data/exerciseData";
import { useAuth } from "@/context/AuthContext";
import { useWorkout } from "@/context/WorkoutContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GlassCard from "@/components/ui/GlassCard";
import {
  getWorkoutGroups,
  saveWorkoutGroups,
  WorkoutGroup,
} from "@/lib/userService";
import {
  Search,
  Grid3X3,
  List,
  ArrowRight,
  Target,
  Clock,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.4, ease: "easeOut" as const },
  }),
};

function LibraryContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { setSelectedExerciseId } = useWorkout();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<"CATALOG" | "GROUPS">("CATALOG");
  const [savedGroups, setSavedGroups] = useState<WorkoutGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  // Load saved groups from Firestore
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const groups = await getWorkoutGroups(user.uid);
        setSavedGroups(groups);
      } catch (err) {
        console.error("Failed to load workout groups:", err);
      } finally {
        setLoadingGroups(false);
      }
    };
    load();
  }, [user]);

  const saveGroup = async () => {
    if (!user) return;
    const name = window.prompt("Enter a name for your custom routine:");
    if (!name) return;

    const newGroup: WorkoutGroup = {
      id: Date.now().toString(),
      name,
      exercises: selectedExercises,
    };

    const updated = [...savedGroups, newGroup];
    setSavedGroups(updated);
    setSelectedExercises([]);
    setIsSelectionMode(false);
    setActiveTab("GROUPS");

    try {
      await saveWorkoutGroups(user.uid, updated);
    } catch (err) {
      console.error("Failed to save workout group:", err);
    }
  };

  const deleteGroup = async (groupId: string) => {
    if (!user) return;
    if (!window.confirm("Delete this routine?")) return;

    const updated = savedGroups.filter((g) => g.id !== groupId);
    setSavedGroups(updated);

    try {
      await saveWorkoutGroups(user.uid, updated);
    } catch (err) {
      console.error("Failed to delete workout group:", err);
    }
  };

  const filtered = EXERCISES.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.targetJoints.some((j) => j.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !selectedCategory || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectExercise = (ex: Exercise) => {
    if (isSelectionMode) {
      setSelectedExercises((prev) =>
        prev.includes(ex.id) ? prev.filter((id) => id !== ex.id) : [...prev, ex.id]
      );
    } else {
      setSelectedExerciseId(ex.id);
      router.push(`/workout?exercise=${ex.id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Exercise <span className="text-gradient-maroon">Library</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
            {EXERCISES.length} exercises available · Click any to start
          </p>
        </div>
        {activeTab === "CATALOG" && (
          <button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedExercises([]);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
              isSelectionMode
                ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                : "bg-maroon-50 dark:bg-maroon-900/30 text-maroon-700 dark:text-maroon-300 hover:bg-maroon-100 dark:hover:bg-maroon-900/50"
            }`}
          >
            {isSelectionMode ? "Cancel Selection" : "Select Exercises"}
          </button>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab("CATALOG")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "CATALOG"
              ? "border-maroon-700 dark:border-maroon-400 text-maroon-700 dark:text-maroon-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          Exercise Catalog
        </button>
        <button
          onClick={() => setActiveTab("GROUPS")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "GROUPS"
              ? "border-maroon-700 dark:border-maroon-400 text-maroon-700 dark:text-maroon-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          My Routines ({savedGroups.length})
        </button>
      </div>

      {activeTab === "GROUPS" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
          {loadingGroups ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-maroon-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : savedGroups.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl mt-4">
              <p className="text-slate-500 text-sm mb-4 font-medium">
                You haven&apos;t created any custom routines yet.
              </p>
              <button
                onClick={() => {
                  setActiveTab("CATALOG");
                  setIsSelectionMode(true);
                }}
                className="px-6 py-3 bg-maroon-700 text-white rounded-xl text-sm font-medium shadow-lg hover:bg-maroon-800 transition-colors"
              >
                + Build Your First Routine
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {savedGroups.map((group) => (
                <GlassCard key={group.id} hover className="flex flex-col h-full !p-0 overflow-hidden">
                  <div className="p-5 flex-1 bg-gradient-to-br from-white/60 to-transparent">
                    <h3 className="font-bold text-lg text-slate-800 mb-1">{group.name}</h3>
                    <p className="text-sm text-slate-500">{group.exercises.length} Exercises</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {group.exercises.slice(0, 4).map((exId) => {
                        const ex = EXERCISES.find((e) => e.id === exId);
                        return ex ? (
                          <span
                            key={exId}
                            className="text-[10px] font-medium bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-md shadow-sm"
                          >
                            {ex.name}
                          </span>
                        ) : null;
                      })}
                      {group.exercises.length > 4 && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                          +{group.exercises.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-100 bg-white/40 flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/workout?queue=${group.exercises.join(",")}`)
                      }
                      className="flex-1 py-2.5 bg-maroon-700 text-white rounded-lg text-sm font-medium shadow-md shadow-maroon-700/20 hover:bg-maroon-800 transition-colors"
                    >
                      Start Routine →
                    </button>
                    <button
                      onClick={() => deleteGroup(group.id)}
                      className="px-4 py-2.5 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        <>
          {/* Search + View toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5"
          >
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search exercises or target joints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-maroon-300 dark:focus:border-maroon-500 focus:ring-2 focus:ring-maroon-100 dark:focus:ring-maroon-900/40 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-700 shadow-sm text-maroon-700 dark:text-maroon-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-700 shadow-sm text-maroon-700 dark:text-maroon-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                !selectedCategory
                  ? "bg-maroon-700 text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-maroon-200 dark:hover:border-maroon-500"
              }`}
            >
              All
            </button>
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat ? null : cat)
                }
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-maroon-700 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-maroon-200 dark:hover:border-maroon-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Exercise Grid / List */}
          {viewMode === "grid" ? (
            <motion.div
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.map((ex, i) => (
                <motion.div key={ex.id} custom={i} variants={fadeUp}>
                  <div
                    onClick={() => handleSelectExercise(ex)}
                    className={`h-full cursor-pointer transition-all rounded-2xl ${
                      isSelectionMode && selectedExercises.includes(ex.id)
                        ? "ring-2 ring-maroon-500 bg-maroon-50 border-transparent shadow-md transform scale-[0.98]"
                        : ""
                    }`}
                  >
                    <GlassCard hover className="h-full pointer-events-none">
                      {/* Image */}
                      <div className="aspect-[4/3] bg-gradient-to-br from-maroon-50 to-slate-50 rounded-xl flex items-center justify-center mb-3 border border-maroon-100/30 overflow-hidden">
                        {ex.image ? (
                          <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center">
                            <Target size={28} className="text-maroon-400 mx-auto" />
                            <p className="text-[10px] text-slate-400 mt-1">{ex.category}</p>
                          </div>
                        )}
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ex.categoryColor}`}
                      >
                        {ex.category}
                      </span>

                      <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mt-2 mb-1">
                        {ex.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed line-clamp-2 mb-3">
                        {ex.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Target size={11} />
                            {ex.targetJoints.length} joints
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} />
                            {ex.duration} min
                          </span>
                        </div>
                        <ArrowRight size={14} className="text-maroon-400" />
                      </div>
                    </GlassCard>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div initial="hidden" animate="visible" className="space-y-2">
              {filtered.map((ex, i) => (
                <motion.div key={ex.id} custom={i} variants={fadeUp}>
                  <div
                    onClick={() => handleSelectExercise(ex)}
                    className={`glass rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-maroon-200/50 hover:shadow-sm transition-all ${
                      isSelectionMode && selectedExercises.includes(ex.id)
                        ? "ring-2 ring-maroon-500 bg-maroon-50"
                        : ""
                    }`}
                  >
                    {/* Small image */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-maroon-50 to-slate-50 flex items-center justify-center shrink-0 border border-maroon-100/30 overflow-hidden">
                      {ex.image ? (
                        <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                      ) : (
                        <Target size={20} className="text-maroon-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                          {ex.name}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${ex.categoryColor}`}
                        >
                          {ex.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        {ex.targetJoints.join(" · ")}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                      <span>{ex.duration} min</span>
                      <ArrowRight size={14} className="text-maroon-400" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400 text-sm">No exercises found</p>
            </div>
          )}
        </>
      )}

      {/* Floating Action Bar */}
      <AnimatePresence>
        {isSelectionMode && selectedExercises.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
          >
            <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl p-2 pl-6 flex items-center gap-6">
              <span className="text-white text-sm font-medium">
                {selectedExercises.length} selected
              </span>
              <button
                onClick={saveGroup}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap border border-slate-600 shadow-lg"
              >
                Save as Routine
              </button>
              <button
                onClick={() =>
                  router.push(`/workout?queue=${selectedExercises.join(",")}`)
                }
                className="px-5 py-2.5 bg-maroon-600 hover:bg-maroon-500 text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap shadow-lg shadow-maroon-600/30"
              >
                Start Now →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <ProtectedRoute>
      <LibraryContent />
    </ProtectedRoute>
  );
}
