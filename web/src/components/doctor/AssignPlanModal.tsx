"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Sparkles, Brain, CheckCircle2, ChevronRight, ChevronLeft, 
  Loader2, AlertCircle, FileText, User
} from "lucide-react";
import { EXERCISES, CATEGORY_LIST, Exercise } from "@/data/exerciseData";

interface AssignPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorUid: string;
  doctorName: string;
}

export default function AssignPlanModal({ isOpen, onClose, doctorUid, doctorName }: AssignPlanModalProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [condition, setCondition] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(new Set());
  
  // AI States
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestionReasoning, setSuggestionReasoning] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStep(1);
    setEmail("");
    setFullName("");
    setAge("");
    setBloodGroup("");
    setCondition("");
    setNotes("");
    setSelectedExercises(new Set());
    setSuggestionReasoning("");
    setError("");
    setSuccess(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/doctor/extract-report", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to extract report");

      const data = result.data || result;
      setFullName(data.fullName || "");
      setAge(data.age || "");
      setBloodGroup(data.bloodGroup || "");
      setCondition(data.condition || "");
      setNotes(data.notes || "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGetSuggestions = async () => {
    if (!condition) {
      setError("Please enter a condition first to get suggestions.");
      return;
    }

    setIsSuggesting(true);
    setError("");

    try {
      const res = await fetch("/api/doctor/suggest-exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition, notes, age, bloodGroup }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get suggestions");

      setSuggestionReasoning(data.reasoning || "");
      if (data.suggestedExerciseIds && Array.isArray(data.suggestedExerciseIds)) {
        const newSet = new Set(selectedExercises);
        data.suggestedExerciseIds.forEach((id: string) => newSet.add(id));
        setSelectedExercises(newSet);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleAssign = async () => {
    if (!email || !condition || selectedExercises.size === 0) {
      setError("Please ensure email, condition, and at least 1 exercise is selected.");
      return;
    }

    setIsAssigning(true);
    setError("");

    try {
      const { assignExercisesByEmail } = await import("@/lib/doctorService");
      
      const result = await assignExercisesByEmail(
        doctorUid, 
        doctorName, 
        { email, fullName, age, bloodGroup }, 
        condition, 
        notes, 
        Array.from(selectedExercises)
      );

      if (!result.success) {
        throw new Error(result.message);
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAssigning(false);
    }
  };

  const toggleExercise = (id: string) => {
    const newSet = new Set(selectedExercises);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedExercises(newSet);
  };

  // Group exercises by Category
  const groupedExercises: Record<string, Exercise[]> = {};
  CATEGORY_LIST.forEach(cat => groupedExercises[cat] = []);
  EXERCISES.forEach(ex => {
    if (groupedExercises[ex.category]) {
      groupedExercises[ex.category].push(ex);
    }
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={handleClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                <Sparkles size={20} className="text-maroon-600" />
                Assign AI Recovery Plan
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Step {step} of 3: {step === 1 ? "Patient Initial Detail" : step === 2 ? "Report & Diagnosis" : "AI Suggestions"}
              </p>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-slate-100">
            <motion.div 
              className="h-full bg-maroon-600"
              initial={{ width: "33%" }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mx-5 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2 text-rose-700 text-sm">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Success Banner */}
          {success && (
            <div className="mx-5 mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center text-emerald-700 text-center py-8">
              <CheckCircle2 size={48} className="mb-3 text-emerald-500" />
              <p className="text-lg font-bold">Plan Assigned Successfully!</p>
              <p className="text-sm opacity-80 mt-1">The patient has been notified.</p>
            </div>
          )}

          {/* Body */}
          {!success && (
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar">
              
              {/* STEP 1: Email */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-slate-700">
                      Patient Email Address
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="patient@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-maroon-100 dark:focus:ring-maroon-900 focus:border-maroon-300 transition-all font-medium text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      We will assign the plan directly to this user account. Ensure they have already registered with this email, or we will create an offline profile for them.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Report & Details */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="p-5 rounded-2xl border-2 border-dashed border-maroon-200 dark:border-maroon-800/50 bg-maroon-50/50 dark:bg-maroon-900/10 text-center transition-all hover:bg-maroon-50 dark:hover:bg-maroon-900/20 relative">
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      ref={fileInputRef}
                      disabled={isExtracting}
                    />
                    {isExtracting ? (
                      <div className="py-6 flex flex-col items-center">
                        <Loader2 size={32} className="text-maroon-600 animate-spin mb-4" />
                        <p className="text-base font-bold text-maroon-800">Reading Med Report with Gemini AI...</p>
                        <p className="text-sm text-maroon-600/70 mt-1">Extracting patient details & diagnosis</p>
                      </div>
                    ) : (
                      <div className="py-4 flex flex-col items-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center mb-3 text-maroon-600 dark:text-maroon-400">
                          <FileText size={24} />
                        </div>
                        <p className="text-base font-bold text-slate-700 dark:text-slate-200">Upload Patient Report</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Image or PDF. AI will auto-fill the form below.</p>
                        <span className="mt-4 px-4 py-2 rounded-full bg-maroon-600 text-white text-xs font-bold shadow-sm hover:bg-maroon-700 transition-colors">
                          Browse Files
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 py-1">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-xs font-bold text-slate-400">PATIENT DETAILS</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Patient Email</label>
                      <input type="email" value={email} disabled className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-sm font-medium opacity-70 text-slate-800 dark:text-slate-200" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                      <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Auto-filled" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:ring-2 focus:ring-maroon-100 dark:focus:ring-maroon-900 focus:border-maroon-300 text-sm font-medium text-slate-800 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Age</label>
                      <input type="text" value={age} onChange={e => setAge(e.target.value)} placeholder="Optional" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:ring-2 focus:ring-maroon-100 dark:focus:ring-maroon-900 focus:border-maroon-300 text-sm font-medium text-slate-800 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Blood Group</label>
                      <input type="text" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} placeholder="Optional" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:ring-2 focus:ring-maroon-100 dark:focus:ring-maroon-900 focus:border-maroon-300 text-sm font-medium text-slate-800 dark:text-slate-100" />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Primary Condition *</label>
                    <input type="text" value={condition} onChange={e => setCondition(e.target.value)} placeholder="e.g. Total Knee Replacement (Right)" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:ring-2 focus:ring-maroon-100 dark:focus:ring-maroon-900 text-sm font-medium mb-4 text-slate-800 dark:text-slate-100" />

                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Doctor Notes</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Precautions, instructions, etc." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 focus:ring-2 focus:ring-maroon-100 dark:focus:ring-maroon-900 text-sm font-medium min-h-[80px] resize-none text-slate-800 dark:text-slate-100" />
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Exercise Selection */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="flex sm:flex-row flex-col sm:items-center gap-3 justify-between p-4 rounded-xl bg-gradient-to-br from-maroon-50 to-rose-50 dark:from-maroon-900/30 dark:to-rose-900/20 border border-maroon-100 dark:border-maroon-800/50">
                    <div>
                      <h3 className="text-sm font-bold text-maroon-900 flex items-center gap-1.5">
                        <Brain size={16} /> AI Suggested Draft
                      </h3>
                      <p className="text-xs text-maroon-700/70 mt-0.5">
                        Let Groq AI suggest the perfect exercises based on "{condition || "condition"}".
                      </p>
                    </div>
                    <button 
                      onClick={handleGetSuggestions}
                      disabled={isSuggesting || !condition}
                      className="shrink-0 px-4 py-2 rounded-lg bg-maroon-600 text-white text-xs font-bold hover:bg-maroon-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 justify-center"
                    >
                      {isSuggesting ? (
                        <><Loader2 size={14} className="animate-spin" /> Analyzing...</>
                      ) : (
                        <><Sparkles size={14} /> Auto-Suggest</>
                      )}
                    </button>
                  </div>

                  {suggestionReasoning && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-sm text-blue-900 leading-relaxed italic">
                      " {suggestionReasoning} "
                    </motion.div>
                  )}

                  <div className="space-y-6 mt-4">
                    {CATEGORY_LIST.map(category => {
                      const categoryExercises = groupedExercises[category];
                      if (!categoryExercises || categoryExercises.length === 0) return null;
                      
                      return (
                        <div key={category}>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            {category}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {categoryExercises.map(ex => {
                              const isSelected = selectedExercises.has(ex.id);
                              return (
                                <div 
                                  key={ex.id}
                                  onClick={() => toggleExercise(ex.id)}
                                  className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${
                                    isSelected 
                                    ? "bg-maroon-50 border-maroon-200 shadow-sm" 
                                    : "bg-white border-slate-100 hover:border-slate-200"
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                                    isSelected ? "bg-maroon-600 border-maroon-600" : "bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                                  }`}>
                                    {isSelected && <CheckCircle2 size={12} className="text-white" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-semibold truncate ${isSelected ? "text-maroon-900 dark:text-maroon-100" : "text-slate-700 dark:text-slate-200"}`}>
                                      {ex.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                      {ex.targetJoints.join(", ")}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

            </div>
          )}

          {/* Footer Actions */}
          {!success && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#0b0f19] flex items-center justify-between shrink-0">
              {step > 1 ? (
                <button 
                  onClick={() => setStep(s => s - 1)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200/50 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button 
                  onClick={() => {
                    if (step === 1 && !email) {
                      setError("Please provide a patient email.");
                      return;
                    }
                    if (step === 2 && !condition) {
                      setError("Please provide a diagnosis or condition.");
                      return;
                    }
                    setError("");
                    setStep(s => s + 1);
                  }}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-white text-sm font-bold hover:bg-slate-900 transition-colors shadow-sm flex items-center gap-1"
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button 
                  onClick={handleAssign}
                  disabled={isAssigning || selectedExercises.size === 0}
                  className="px-6 py-2 rounded-xl bg-maroon-600 text-white text-sm font-bold hover:bg-maroon-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAssigning ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Assign {selectedExercises.size > 0 ? `(${selectedExercises.size})` : ""} Exercises
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
