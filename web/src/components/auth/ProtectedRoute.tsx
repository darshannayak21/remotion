"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    // If a doctor tries to access patient pages, redirect to doctor dashboard
    if (!loading && user && role === "doctor") {
      router.push("/doctor/dashboard");
    }
  }, [user, loading, role, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-maroon-700 to-maroon-900 flex items-center justify-center mx-auto shadow-lg shadow-maroon-700/30 mb-4 animate-pulse">
            <span
              className="text-white font-bold text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              R
            </span>
          </div>
          <div className="w-8 h-8 border-3 border-maroon-700 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
