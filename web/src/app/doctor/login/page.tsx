"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import {
  ArrowRight,
  Loader2,
  AlertCircle,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";

export default function DoctorLoginPage() {
  const router = useRouter();
  const { user, loading, role, signInAsDoctor } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in as doctor
  useEffect(() => {
    if (!loading && user && role === "doctor") {
      router.push("/doctor/dashboard");
    }
  }, [user, loading, role, router]);

  const handleGoogleSignIn = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      await signInAsDoctor();
      router.push("/doctor/dashboard");
    } catch (err: unknown) {
      const firebaseErr = err as { message?: string };
      setError(firebaseErr.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-3 border-maroon-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-maroon-50/30 to-slate-100 p-4">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-maroon-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-maroon-300/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-maroon-100/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Branding */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center mx-auto shadow-xl shadow-maroon-700/30 mb-4 relative">
            <Stethoscope size={28} className="text-white" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
              <ShieldCheck size={12} className="text-white" />
            </div>
          </div>
          <h1
            className="text-3xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-gradient-maroon">ReMotion</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Doctor Portal
          </p>
        </motion.div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-7 shadow-xl shadow-maroon-900/5">
          {/* Doctor Badge */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-maroon-50 border border-maroon-100/50 mb-6">
            <div className="w-8 h-8 rounded-lg bg-maroon-700 flex items-center justify-center shrink-0">
              <Stethoscope size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-maroon-800">Doctor Login</p>
              <p className="text-[11px] text-maroon-600/70">Authorized personnel only</p>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-4"
              >
                <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
                  <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-rose-700">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info */}
          <p className="text-sm text-slate-500 text-center mb-5">
            Sign in with your authorized Google account to access the doctor dashboard.
          </p>

          {/* Google Sign In */}
          <motion.button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className="w-full py-3.5 bg-gradient-to-r from-maroon-700 to-maroon-800 text-white font-semibold rounded-xl shadow-lg shadow-maroon-700/25 hover:shadow-maroon-700/40 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#fff"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#fff"
                    fillOpacity={0.8}
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#fff"
                    fillOpacity={0.6}
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#fff"
                    fillOpacity={0.9}
                  />
                </svg>
                Sign In with Google
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>

          {/* Patient login link */}
          <div className="mt-5 text-center">
            <button
              onClick={() => router.push("/login")}
              className="text-xs text-slate-400 hover:text-maroon-700 transition-colors"
            >
              Are you a patient? Sign in here →
            </button>
          </div>
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-slate-400 mt-6"
        >
          ReMotion Doctor Portal · Authorized Access Only
        </motion.p>
      </motion.div>
    </div>
  );
}
