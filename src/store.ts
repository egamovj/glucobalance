import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  glucoseLogs: any[];
  addGlucoseLog: (log: any) => void;
  symptoms: any[];
  addSymptom: (symptom: any) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      glucoseLogs: [],
      addGlucoseLog: (log) =>
        set((state) => ({ glucoseLogs: [log, ...state.glucoseLogs] })),
      symptoms: [],
      addSymptom: (symptom) =>
        set((state) => ({ symptoms: [symptom, ...state.symptoms] })),
      theme: "light",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    {
      name: "glucobalance-storage",
    },
  ),
);
