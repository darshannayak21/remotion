"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useWorkout } from "@/context/WorkoutContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GlassCard from "@/components/ui/GlassCard";
import {
  getUserSettings,
  saveUserSettings,
  UserSettings,
} from "@/lib/userService";
import {
  Gauge,
  Camera,
  Video,
  Volume2,
  Mic,
  Info,
  LogOut,
  Loader2,
} from "lucide-react";

function SettingsContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const {
    sensitivity,
    setSensitivity,
    demoVideoEnabled,
    setDemoVideoEnabled,
    voiceEnabled,
    setVoiceEnabled,
  } = useWorkout();

  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Load settings from Firestore
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const settings = await getUserSettings(user.uid);
        setSensitivity(settings.sensitivity);
        setDemoVideoEnabled(settings.demoVideoEnabled);
        setVoiceEnabled(settings.voiceEnabled);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoadingSettings(false);
      }
    };
    load();
  }, [user, setSensitivity, setDemoVideoEnabled, setVoiceEnabled]);

  // Save setting to Firestore
  const saveSetting = async (key: keyof UserSettings, value: unknown) => {
    if (!user) return;
    try {
      await saveUserSettings(user.uid, { [key]: value } as Partial<UserSettings>);
    } catch (err) {
      console.error("Failed to save setting:", err);
    }
  };

  const handleSensitivityChange = (val: "strict" | "relaxed") => {
    setSensitivity(val);
    saveSetting("sensitivity", val);
  };

  const handleDemoVideoToggle = () => {
    const newVal = !demoVideoEnabled;
    setDemoVideoEnabled(newVal);
    saveSetting("demoVideoEnabled", newVal);
  };

  const handleVoiceToggle = () => {
    const newVal = !voiceEnabled;
    setVoiceEnabled(newVal);
    saveSetting("voiceEnabled", newVal);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    router.push("/login");
  };

  if (loadingSettings) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-maroon-700 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ── Ambient Background Blobs ── */}
      <div className="ambient-blob w-[500px] h-[500px] bg-maroon-300/40 -top-40 -right-40 animate-float-slow" />
      <div className="ambient-blob w-[400px] h-[400px] bg-rose-200/30 top-1/3 -left-48 animate-float-medium" />
      <div className="ambient-blob w-[300px] h-[300px] bg-amber-200/20 bottom-20 right-1/4 animate-float-slow" style={{ animationDelay: "2s" }} />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-gradient-maroon">Settings</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
            Customize your ReMotion experience
          </p>
        </motion.div>

      <div className="space-y-5">
        {/* ── Sensitivity ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <GlassCard>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-maroon-50 flex items-center justify-center shrink-0">
                <Gauge size={20} className="text-maroon-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 dark:text-slate-100">Detection Sensitivity</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 mt-0.5">
                  Controls how strict the angle tolerance is for form evaluation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSensitivityChange("strict")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all border ${
                  sensitivity === "strict"
                    ? "bg-maroon-700 text-white border-maroon-700 shadow-lg shadow-maroon-700/20"
                    : "bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-maroon-200 dark:hover:border-maroon-500/50"
                }`}
              >
                <div className="font-semibold">Strict</div>
                <div className={`text-xs mt-0.5 ${sensitivity === "strict" ? "text-maroon-200" : "text-slate-400"}`}>
                  5° tolerance — clinical precision
                </div>
              </button>
              <button
                onClick={() => handleSensitivityChange("relaxed")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all border ${
                  sensitivity === "relaxed"
                    ? "bg-maroon-700 text-white border-maroon-700 shadow-lg shadow-maroon-700/20"
                    : "bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-maroon-200 dark:hover:border-maroon-500/50"
                }`}
              >
                <div className="font-semibold">Relaxed</div>
                <div className={`text-xs mt-0.5 ${sensitivity === "relaxed" ? "text-maroon-200" : "text-slate-400"}`}>
                  10° tolerance — beginner friendly
                </div>
              </button>
            </div>

            <div className="flex items-start gap-2 mt-3 p-2.5 rounded-lg bg-slate-50">
              <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Maps to <code className="text-maroon-600">tolerance_degrees</code> in the ReMotion engine.
                Strict = 5°, Relaxed = 10°.
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Camera Settings ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-maroon-50 flex items-center justify-center shrink-0">
                <Camera size={20} className="text-maroon-700" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Camera Settings</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select your camera source for pose detection
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                  Camera Source
                </label>
                <select className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-maroon-300 focus:ring-2 focus:ring-maroon-100 dark:focus:ring-maroon-900 transition-all appearance-none cursor-pointer">
                  <option>Default Camera (Camera 0)</option>
                  <option>External Webcam (Camera 1)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                    Resolution
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-maroon-300 focus:ring-2 focus:ring-maroon-100 dark:focus:ring-maroon-900 transition-all appearance-none cursor-pointer">
                    <option>1280 × 720</option>
                    <option>640 × 480</option>
                    <option>1920 × 1080</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 block">
                    FPS
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-maroon-300 focus:ring-2 focus:ring-maroon-100 dark:focus:ring-maroon-900 transition-all appearance-none cursor-pointer">
                    <option>30 FPS</option>
                    <option>15 FPS</option>
                    <option>60 FPS</option>
                  </select>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Demo Video ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-maroon-50 flex items-center justify-center shrink-0">
                  <Video size={20} className="text-maroon-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Demo Videos</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Show exercise demo option before each workout
                  </p>
                </div>
              </div>

              <button
                onClick={handleDemoVideoToggle}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  demoVideoEnabled ? "bg-maroon-700" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <motion.div
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                  animate={{ left: demoVideoEnabled ? 24 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Voice ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-maroon-50 flex items-center justify-center shrink-0">
                  <Mic size={20} className="text-maroon-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Voice Interaction</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Enable &ldquo;Hey ReMotion&rdquo; wake word for hands-free coaching
                  </p>
                </div>
              </div>

              <button
                onClick={handleVoiceToggle}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  voiceEnabled ? "bg-maroon-700" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <motion.div
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                  animate={{ left: voiceEnabled ? 24 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Sound Feedback */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0b0f19] border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-slate-500 dark:text-slate-400" />
                <span className="text-sm text-slate-600 dark:text-slate-300">Sound Feedback</span>
              </div>
              <span className="text-xs text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                Coming Soon
              </span>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Account ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                  <LogOut size={20} className="text-rose-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Account</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Logged in as {user?.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="px-5 py-2.5 bg-rose-50 text-rose-600 font-medium rounded-xl hover:bg-rose-100 transition-colors text-sm border border-rose-200 disabled:opacity-50"
              >
                {loggingOut ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Log Out"
                )}
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── About ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center pt-6 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center mx-auto shadow-lg shadow-maroon-700/30 mb-3">
              <span
                className="text-white font-bold text-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                R
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              ReMotion AI Physiotherapy
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              v1.0.0 · Powered by MediaPipe + Gemini + Groq
            </p>
          </div>
        </motion.div>
      </div>
    </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
