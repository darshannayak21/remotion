"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";
import { WorkoutProvider } from "@/context/WorkoutContext";
import Sidebar from "@/components/layout/Sidebar";
import DoctorSidebar from "@/components/layout/DoctorSidebar";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Auth pages — no sidebar at all
  const isAuthPage = pathname === "/login" || pathname === "/doctor/login";

  // Doctor routes — use doctor sidebar
  const isDoctorRoute = pathname.startsWith("/doctor/") && !isAuthPage;

  return (
    <AuthProvider>
      {isAuthPage ? (
        /* Auth pages render without sidebar */
        <>{children}</>
      ) : isDoctorRoute ? (
        /* Doctor pages render with DoctorSidebar */
        <>
          <DoctorSidebar />
          <main className="md:ml-[68px] pb-20 md:pb-0 min-h-screen">
            {children}
          </main>
        </>
      ) : (
        /* Patient pages render with Sidebar + WorkoutProvider */
        <WorkoutProvider>
          <Sidebar />
          <main className="md:ml-[68px] pb-20 md:pb-0 min-h-screen">
            {children}
          </main>
        </WorkoutProvider>
      )}
    </AuthProvider>
  );
}
