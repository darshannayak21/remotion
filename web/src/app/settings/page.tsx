"use client";

import { motion } from "framer-motion";
import { useWorkout } from "@/context/WorkoutContext";
import GlassCard from "@/components/ui/GlassCard";
import {
  Gauge,
  Camera,
  Video,
  Volume2,
  Mic,
  Info,
} from "lucide-react";

export default function SettingsPage() {
  const {
    sensitivity,
    setSensitivity,
    demoVideoEnabled,
    setDemoVideoEnabled,
    voiceEnabled,
    setVoiceEnabled,
  } = useWorkout();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
        <p className="text-slate-500 mt-1 text-sm sm:text-base">
          Customize your FLEX experience
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
                <h3 className="font-semibold text-slate-800">Detection Sensitivity</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Controls how strict the angle tolerance is for form evaluation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSensitivity("strict")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all border ${
                  sensitivity === "strict"
                    ? "bg-maroon-700 text-white border-maroon-700 shadow-lg shadow-maroon-700/20"
                    : "bg-white text-slate-600 border-slate-200 hover:border-maroon-200"
                }`}
              >
                <div className="font-semibold">Strict</div>
                <div className={`text-xs mt-0.5 ${sensitivity === "strict" ? "text-maroon-200" : "text-slate-400"}`}>
                  5° tolerance — clinical precision
                </div>
              </button>
              <button
                onClick={() => setSensitivity("relaxed")}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all border ${
                  sensitivity === "relaxed"
                    ? "bg-maroon-700 text-white border-maroon-700 shadow-lg shadow-maroon-700/20"
                    : "bg-white text-slate-600 border-slate-200 hover:border-maroon-200"
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
              <p className="text-xs text-slate-500">
                Maps to <code className="text-maroon-600">tolerance_degrees</code> in the FLEX engine.
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
                <h3 className="font-semibold text-slate-800">Camera Settings</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your camera source for pose detection
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                  Camera Source
                </label>
                <select className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-maroon-300 focus:ring-2 focus:ring-maroon-100 transition-all appearance-none">
                  <option>Default Camera (Camera 0)</option>
                  <option>External Webcam (Camera 1)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    Resolution
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-maroon-300 focus:ring-2 focus:ring-maroon-100 transition-all appearance-none">
                    <option>1280 × 720</option>
                    <option>640 × 480</option>
                    <option>1920 × 1080</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1.5 block">
                    FPS
                  </label>
                  <select className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-maroon-300 focus:ring-2 focus:ring-maroon-100 transition-all appearance-none">
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
                  <h3 className="font-semibold text-slate-800">Demo Videos</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Show exercise demo option before each workout
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDemoVideoEnabled(!demoVideoEnabled)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  demoVideoEnabled ? "bg-maroon-700" : "bg-slate-300"
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
                  <h3 className="font-semibold text-slate-800">Voice Interaction</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Enable &ldquo;Hey Flex&rdquo; wake word for hands-free coaching
                  </p>
                </div>
              </div>

              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  voiceEnabled ? "bg-maroon-700" : "bg-slate-300"
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
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className="text-slate-500" />
                <span className="text-sm text-slate-600">Sound Feedback</span>
              </div>
              <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                Coming Soon
              </span>
            </div>
          </GlassCard>
        </motion.div>

        {/* ── About ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="text-center pt-6 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center mx-auto shadow-lg shadow-maroon-700/30 mb-3">
              <span className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
                F
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-700">
              FLEX AI Physiotherapy
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              v1.0.0 · Powered by MediaPipe + Gemini + Groq
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
