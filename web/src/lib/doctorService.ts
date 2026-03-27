import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserStats, WorkoutSession } from "@/lib/userService";

// ── Types ──

export interface PatientSummary {
  uid: string;
  displayName: string;
  email: string;
  createdAt: string;
  age?: string;
  bloodGroup?: string;
  stats: UserStats;
  recentSessions: WorkoutSession[];
}

export interface DoctorProfile {
  displayName: string;
  email: string;
  role: "doctor";
  createdAt: string;
}

// ── Doctor Profile ──

export async function getDoctorProfile(uid: string): Promise<DoctorProfile | null> {
  const snap = await getDoc(doc(db, "doctors", uid));
  return snap.exists() ? (snap.data() as DoctorProfile) : null;
}

export async function createDoctorProfile(
  uid: string,
  displayName: string,
  email: string
) {
  const docRef = doc(db, "doctors", uid);
  const snap = await getDoc(docRef);
  if (!snap.exists()) {
    await setDoc(docRef, {
      displayName,
      email,
      role: "doctor",
      createdAt: new Date().toISOString(),
    });
  }
}

// ── Patients ──

/**
 * Get all patients linked to a doctor.
 * Patients are linked via their `linkedDoctorId` field in the users collection.
 */
export async function getDoctorPatients(doctorUid: string): Promise<PatientSummary[]> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("linkedDoctorId", "==", doctorUid));
  const snap = await getDocs(q);

  const patients: PatientSummary[] = [];

  for (const userDoc of snap.docs) {
    const data = userDoc.data();
    
    // Fetch recent sessions
    let recentSessions: WorkoutSession[] = [];
    try {
      const sessionsRef = collection(db, "users", userDoc.id, "sessions");
      const sessionSnap = await getDocs(sessionsRef);
      recentSessions = sessionSnap.docs
        .map((s) => s.data() as WorkoutSession)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    } catch (e) {
      // Sessions subcollection may not exist yet
    }

    patients.push({
      uid: userDoc.id,
      displayName: data.displayName || "Unknown",
      email: data.email || "",
      createdAt: data.createdAt || "",
      age: data.age || "",
      bloodGroup: data.bloodGroup || "",
      stats: data.stats || {
        totalReps: 0,
        streak: 0,
        avgAccuracy: 0,
        consistencyScore: 0,
        formImprovement: 0,
        lastScore: 0,
        sessionsCount: 0,
      },
      recentSessions,
    });
  }

  return patients;
}

/**
 * Get ALL patients (useful when there's only one doctor).
 */
export async function getAllPatients(): Promise<PatientSummary[]> {
  const usersRef = collection(db, "users");
  const snap = await getDocs(usersRef);

  const patients: PatientSummary[] = [];

  for (const userDoc of snap.docs) {
    const data = userDoc.data();

    let recentSessions: WorkoutSession[] = [];
    try {
      const sessionsRef = collection(db, "users", userDoc.id, "sessions");
      const sessionSnap = await getDocs(sessionsRef);
      recentSessions = sessionSnap.docs
        .map((s) => s.data() as WorkoutSession)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    } catch (e) {
      // ignore
    }

    patients.push({
      uid: userDoc.id,
      displayName: data.displayName || "Unknown",
      email: data.email || "",
      createdAt: data.createdAt || "",
      age: data.age || "",
      bloodGroup: data.bloodGroup || "",
      stats: data.stats || {
        totalReps: 0,
        streak: 0,
        avgAccuracy: 0,
        consistencyScore: 0,
        formImprovement: 0,
        lastScore: 0,
        sessionsCount: 0,
      },
      recentSessions,
    });
  }

  return patients;
}

/**
 * Assign an exercise plan to a patient using their email address.
 * Looks up the patient, adds the new workout group, and flags them as having a new assignment.
 * If patient isn't registered, creates an offline stub profile.
 */
export async function assignExercisesByEmail(
  doctorUid: string,
  doctorName: string,
  patientData: {
    email: string;
    fullName: string;
    age: string;
    bloodGroup: string;
  },
  condition: string,
  notes: string,
  exerciseIds: string[]
): Promise<{ success: boolean; message: string }> {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", patientData.email));
    const snap = await getDocs(q);

    // Create a new workout group for this assignment
    const newGroup = {
      id: `dr-${Date.now()}`,
      name: `Dr. ${doctorName} - ${condition}`,
      exercises: exerciseIds,
      description: notes,
    };

    if (snap.empty) {
      // Patient doesn't exist -> create stub profile
      const stubUid = `stub_${Date.now()}`;
      await setDoc(doc(db, "users", stubUid), {
        email: patientData.email,
        displayName: patientData.fullName || patientData.email.split("@")[0],
        age: patientData.age || "",
        bloodGroup: patientData.bloodGroup || "",
        isStub: true,
        createdAt: new Date().toISOString(),
        linkedDoctorId: doctorUid,
        hasNewAssignment: true,
        workoutGroups: [newGroup],
        stats: {
          totalReps: 0,
          streak: 0,
          avgAccuracy: 0,
          consistencyScore: 0,
          formImprovement: 0,
          lastScore: 0,
          sessionsCount: 0,
        },
        settings: {
          sensitivity: "relaxed",
          demoVideoEnabled: true,
          voiceEnabled: true,
          mode: "beginner",
        },
      });
      return { success: true, message: "Stub patient created. They will see this plan upon signup." };
    }

    // Patient exists -> link and update
    const userDoc = snap.docs[0];
    const userData = userDoc.data();
    const existingGroups = userData.workoutGroups || [];

    await setDoc(
      doc(db, "users", userDoc.id),
      {
        linkedDoctorId: doctorUid,
        hasNewAssignment: true,
        workoutGroups: [...existingGroups, newGroup],
        // Also update details if they are empty
        ...(patientData.age && !userData.age ? { age: patientData.age } : {}),
        ...(patientData.bloodGroup && !userData.bloodGroup ? { bloodGroup: patientData.bloodGroup } : {}),
      },
      { merge: true }
    );

    return { success: true, message: "Exercises assigned successfully." };
  } catch (error: any) {
    console.error("Failed to assign exercises:", error);
    return { success: false, message: error.message || "Failed to assign exercises." };
  }
}

/**
 * Remove a patient from the doctor's dashboard.
 * If the patient is an offline stub, it deletes the document.
 * If the patient is a real registered user, it just unlinks the doctor ID.
 */
export async function removeLinkedPatient(patientUid: string): Promise<{ success: boolean; message: string }> {
  try {
    const { deleteDoc, doc, getDoc, setDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");
    
    const userRef = doc(db, "users", patientUid);
    const snap = await getDoc(userRef);
    
    if (!snap.exists()) {
      return { success: false, message: "Patient not found." };
    }

    const userData = snap.data();
    if (userData.isStub) {
      // Completely delete stub profiles since they aren't real accounts yet
      await deleteDoc(userRef);
      return { success: true, message: "Removed offline patient." };
    }

    // For real accounts, just sever the link
    await setDoc(userRef, { linkedDoctorId: null }, { merge: true });
    
    return { success: true, message: "Patient unlinked successfully." };
  } catch (error: any) {
    console.error("Failed to remove patient:", error);
    return { success: false, message: error.message || "Failed to remove patient." };
  }
}
