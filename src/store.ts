import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "./firebase";
import { doc, getDoc, setDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

interface UserProfile {
  name: string;
  birthDate: string;
  gender: "male" | "female";
  weight: number;
  height: number;
  type: "type1" | "type2";
  targetGlucose: number;
  sensitivity: number;
  nanInsulin: number;
  doctorNotes?: string;
}

interface AppState {
  user: any | null;
  loading: boolean;
  setUser: (user: any) => void;
  setLoading: (loading: boolean) => void;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  glucoseLogs: any[];
  addGlucoseLog: (log: any) => void;
  symptoms: any[];
  addSymptom: (symptom: any) => void;
  syncFromFirestore: (userId: string) => Promise<void>;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),
      profile: null,
      setProfile: async (profile) => {
        set({ profile });
        const user = useStore.getState().user;
        if (user) {
          await setDoc(doc(db, "profiles", user.uid), profile);
        }
      },
      glucoseLogs: [],
      addGlucoseLog: async (log) => {
        set((state) => ({ glucoseLogs: [log, ...state.glucoseLogs] }));
        const user = useStore.getState().user;
        if (user) {
          await setDoc(doc(db, "logs", `${user.uid}_${log.id}`), { ...log, userId: user.uid });
        }
      },
      symptoms: [],
      addSymptom: async (symptom) => {
        set((state) => ({ symptoms: [symptom, ...state.symptoms] }));
        const user = useStore.getState().user;
        if (user) {
          await setDoc(doc(db, "symptoms", `${user.uid}_${symptom.id}`), { ...symptom, userId: user.uid });
        }
      },
      syncFromFirestore: async (userId) => {
        // Sync Profile
        const profDoc = await getDoc(doc(db, "profiles", userId));
        if (profDoc.exists()) {
          set({ profile: profDoc.data() as UserProfile });
        }

        // Sync Logs (limit to last 50 for performance)
        const logsRef = collection(db, "logs");
        const qLogs = query(logsRef, where("userId", "==", userId), orderBy("id", "desc"), limit(50));
        const logsSnap = await getDocs(qLogs);
        const logs = logsSnap.docs.map(doc => doc.data());
        set({ glucoseLogs: logs });

        // Sync Symptoms
        const sympRef = collection(db, "symptoms");
        const qSymp = query(sympRef, where("userId", "==", userId), orderBy("id", "desc"), limit(50));
        const sympSnap = await getDocs(qSymp);
        const symptoms = sympSnap.docs.map(doc => doc.data());
        set({ symptoms: symptoms });
      },
      theme: "light",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    {
      name: "glucobalance-storage",
    },
  ),
);
