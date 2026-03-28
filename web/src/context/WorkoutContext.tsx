"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface WorkoutState {
  selectedExerciseId: string | null;
  setSelectedExerciseId: (id: string | null) => void;
  sensitivity: "strict" | "relaxed";
  setSensitivity: (s: "strict" | "relaxed") => void;
  demoVideoEnabled: boolean;
  setDemoVideoEnabled: (v: boolean) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (v: boolean) => void;
  mode: "beginner" | "advanced";
  setMode: (m: "beginner" | "advanced") => void;
}

const WorkoutContext = createContext<WorkoutState | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [sensitivity, setSensitivity] = useState<"strict" | "relaxed">("relaxed");
  const [demoVideoEnabled, setDemoVideoEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [mode, setMode] = useState<"beginner" | "advanced">("beginner");

  return (
    <WorkoutContext.Provider
      value={{
        selectedExerciseId,
        setSelectedExerciseId,
        sensitivity,
        setSensitivity,
        demoVideoEnabled,
        setDemoVideoEnabled,
        voiceEnabled,
        setVoiceEnabled,
        mode,
        setMode,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error("useWorkout must be used within WorkoutProvider");
  return ctx;
}
