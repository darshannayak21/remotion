"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { getDoctorProfile, createDoctorProfile } from "@/lib/doctorService";
import { getDoctorByEmail, isApprovedDoctor } from "@/lib/doctorConfig";

export type UserRole = "patient" | "doctor" | null;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: "patient" | "doctor" | null;
  signUp: (email: string, pass: string, name: string) => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  signInAsDoctor: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"patient" | "doctor" | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const email = firebaseUser.email || "";
        // Check if this user is a doctor — first by Firestore doc, then by approved email
        const doctorProfile = await getDoctorProfile(firebaseUser.uid);
        if (doctorProfile) {
          setRole("doctor");
        } else if (isApprovedDoctor(email)) {
          // Approved doctor email but no doctor profile yet — auto-create it
          const doctorInfo = getDoctorByEmail(email);
          await createDoctorProfile(
            firebaseUser.uid,
            doctorInfo?.displayName || firebaseUser.displayName || "Doctor",
            email
          );
          setRole("doctor");
        } else {
          setRole("patient");
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Create initial Firestore user document (for patients)
  // Merges offline stub data if it exists for this email
  const createUserDocument = async (uid: string, displayName: string, email: string) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    
    if (!snap.exists()) {
      // Look for a stub profile
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email), where("isStub", "==", true));
      const stubSnap = await getDocs(q);

      let initialData: any = {
        displayName,
        email,
        createdAt: new Date().toISOString(),
        linkedDoctorId: "", // Will be set when linked to a doctor
        hasNewAssignment: false,
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
        workoutGroups: [],
      };

      if (!stubSnap.empty) {
        const stubDoc = stubSnap.docs[0];
        const stubData = stubDoc.data();
        initialData = {
          ...initialData,
          ...stubData,
          displayName: displayName || stubData.displayName,
          isStub: false, // Remove stub flag
        };
        // Delete the stub document since we merged it
        await deleteDoc(doc(db, "users", stubDoc.id));
      }

      await setDoc(userRef, initialData);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await createUserDocument(cred.user.uid, displayName, email);
    setRole("patient");
  };

  const signIn = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // Detect role
    const doctorProfile = await getDoctorProfile(cred.user.uid);
    setRole(doctorProfile ? "doctor" : "patient");
  };

  const signInAsDoctor = async () => {
    // Use Google Sign-In and verify the email is approved
    const cred = await signInWithPopup(auth, googleProvider);
    const email = cred.user.email || "";

    if (!isApprovedDoctor(email)) {
      // Not an approved doctor — sign them out
      await signOut(auth);
      throw new Error("This Google account is not authorized for doctor access.");
    }

    // Get the approved doctor's display name from config
    const doctorInfo = getDoctorByEmail(email);
    const displayName = doctorInfo?.displayName || cred.user.displayName || "Doctor";

    // Ensure doctor profile exists in Firestore
    await createDoctorProfile(cred.user.uid, displayName, email);
    setRole("doctor");
  };

  const signInWithGoogleFn = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const email = cred.user.email || "";

    // Check if this Google account belongs to an approved doctor
    if (isApprovedDoctor(email)) {
      const doctorInfo = getDoctorByEmail(email);
      await createDoctorProfile(
        cred.user.uid,
        doctorInfo?.displayName || cred.user.displayName || "Doctor",
        email
      );
      setRole("doctor");
      return;
    }

    // Otherwise it's a patient
    await createUserDocument(
      cred.user.uid,
      cred.user.displayName || "User",
      email
    );
    setRole("patient");
  };

  const logout = async () => {
    await signOut(auth);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role,
        signUp,
        signIn,
        signInAsDoctor,
        signInWithGoogle: signInWithGoogleFn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
