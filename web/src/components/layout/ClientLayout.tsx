"use client";

import { ReactNode } from "react";
import { WorkoutProvider } from "@/context/WorkoutContext";
import Sidebar from "@/components/layout/Sidebar";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <WorkoutProvider>
      <Sidebar />
      {/* Main content area: offset by sidebar on desktop, bottom nav on mobile */}
      <main className="md:ml-[68px] pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
    </WorkoutProvider>
  );
}
