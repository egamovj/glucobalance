import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  addDoc,
  updateDoc,
} from "firebase/firestore";

export interface UserProfile {
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
  role: "user" | "admin" | "doctor";
  waterGoal: number;
  email?: string;
  doctorId?: string;
}

export interface DoctorProfile {
  uid?: string;
  realUid?: string;
  login: string;
  name: string;
  specialization: string;
  licenseNumber: string;
  phone: string;
  createdByAdmin: boolean;
  createdAt: number;
}

export interface ChatRoom {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  lastMessage: string;
  lastMessageType?: 'text' | 'video_call' | 'video_call_ended';
  lastMessageTime: any;
  updatedAt: any;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  text: string;
  type?: 'text' | 'video_call' | 'video_call_ended';
  timestamp: any;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  reason: string;
  createdAt: any;
}

interface WaterLog {
  id: string;
  amount: number;
  timestamp: string;
}

export interface InsulinLog {
  id: string;
  userId: string;
  type: "basal" | "bolus";
  name: string;
  doses: {
    morning?: number;
    evening?: number;
    breakfast?: number;
    lunch?: number;
    dinner?: number;
    additional?: number;
  };
  timestamp: number;
}

interface Exercise {
  id: string;
  title: string;
  duration: string;
  level: "Oson" | "O'rta" | "Qiyin";
  videoId: string;
  thumbnail: string;
  color: string;
  createdAt: number;
}

interface SymptomDefinition {
  id: string;
  label: string;
  createdAt: number;
}


export interface DailyPatientReport {
  patient: any;
  glucoseLogs: any[];
  symptoms: any[];
  waterLogs: any[];
  insulinLogs: InsulinLog[];
  hasData: boolean;
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
  insulinLogs: InsulinLog[];
  addInsulinLog: (log: Omit<InsulinLog, "id" | "userId" | "timestamp">) => Promise<void>;
  waterLogs: WaterLog[];
  addWaterLog: (amount: number) => Promise<void>;
  deleteWaterLog: (id: string) => Promise<void>;
  lessons: any[];
  fetchLessons: () => Promise<void>;
  addLesson: (lesson: any) => Promise<void>;
  updateLesson: (id: string, lesson: any) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  exercises: Exercise[];
  fetchExercises: () => Promise<void>;
  addExercise: (exercise: Omit<Exercise, "id" | "createdAt">) => Promise<void>;
  updateExercise: (id: string, exercise: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
  symptomDefinitions: SymptomDefinition[];
  fetchSymptomDefinitions: () => Promise<void>;
  addSymptomDefinition: (label: string) => Promise<void>;
  deleteSymptomDefinition: (id: string) => Promise<void>;
  uploadImage: (
    file: File,
    onProgress?: (progress: number) => void,
  ) => Promise<string>;
  seedLessons: (initialLessons: any[]) => Promise<void>;
  seedExercises: (initialExercises: any[]) => Promise<void>;
  seedSymptomDefinitions: () => Promise<void>;
  syncFromFirestore: (userId: string) => Promise<void>;
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Doctor features
  doctorProfiles: DoctorProfile[];
  fetchDoctorProfiles: () => Promise<void>;
  addDoctorProfile: (doctor: Omit<DoctorProfile, "createdAt"> & { password: string }) => Promise<void>;
  deleteDoctorProfile: (login: string) => Promise<void>;
  checkDoctorAccess: (login: string) => Promise<DoctorProfile | null>;

  // Patient management (for doctor)
  patients: any[];
  fetchAllPatients: () => Promise<void>;
  fetchPatientDetail: (uid: string) => Promise<any>;

  // Daily reports
  dailyReports: DailyPatientReport[];
  dailyReportsLoading: boolean;
  fetchDailyReports: (date: string) => Promise<void>;

  // Chat
  chatRooms: ChatRoom[];
  fetchChatRooms: () => Promise<void>;
  getOrCreateChatRoom: (patientId: string, patientName: string, doctorId: string, doctorName: string) => Promise<string>;
  sendMessage: (roomId: string, text: string, type?: 'text' | 'video_call' | 'video_call_ended') => Promise<void>;
  markRoomAsRead: (roomId: string) => Promise<void>;
  getLastReadAt: (roomId: string) => Promise<number>;

  // Appointments
  appointments: Appointment[];
  fetchAppointments: () => Promise<void>;
  createAppointment: (appointment: Omit<Appointment, "id" | "createdAt" | "status">) => Promise<void>;
  updateAppointmentStatus: (id: string, status: Appointment["status"]) => Promise<void>;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),
      profile: null,
      glucoseLogs: [],
      symptoms: [],
      insulinLogs: [],
      waterLogs: [],
      lessons: [],
      exercises: [],
      symptomDefinitions: [],
      doctorProfiles: [],
      patients: [],
      dailyReports: [],
      dailyReportsLoading: false,
      chatRooms: [],
      appointments: [],
      logout: () => set({
        user: null,
        profile: null,
        glucoseLogs: [],
        symptoms: [],
        insulinLogs: [],
        waterLogs: [],
        patients: [],
        dailyReports: [],
        chatRooms: [],
        appointments: []
      }),

      setProfile: async (profile) => {
        const currentProfile = get().profile;
        const updatedProfile = {
          ...profile,
          role: currentProfile?.role || profile.role || "user",
          waterGoal: currentProfile?.waterGoal || profile.waterGoal || 2000,
        };
        set({ profile: updatedProfile });
        const user = get().user;
        if (user) {
          await setDoc(doc(db, "profiles", user.uid), updatedProfile);
        }
      },
      addGlucoseLog: async (log) => {
        set((state) => ({ glucoseLogs: [log, ...state.glucoseLogs] }));
        const user = get().user;
        if (user) {
          await setDoc(doc(db, "logs", `${user.uid}_${log.id}`), {
            ...log,
            userId: user.uid,
          });
        }
      },
      addSymptom: async (symptom) => {
        set((state) => ({ symptoms: [symptom, ...state.symptoms] }));
        const user = get().user;
        if (user) {
          await setDoc(doc(db, "symptoms", `${user.uid}_${symptom.id}`), {
            ...symptom,
            userId: user.uid,
          });
        }
      },
      addInsulinLog: async (log) => {
        const user = get().user;
        if (!user) return;
        const newDoc = doc(collection(db, "insulin_logs"));
        const logData: InsulinLog = {
          ...log,
          id: newDoc.id,
          userId: user.uid,
          timestamp: Date.now(),
        };
        await setDoc(newDoc, logData);
        set((state) => ({ insulinLogs: [logData, ...state.insulinLogs] }));
      },
      fetchLessons: async () => {
        const lessonsRef = collection(db, "academy_lessons");
        const q = query(lessonsRef, orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        const lessons = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        set({ lessons });
      },
      addLesson: async (lesson) => {
        const newDoc = doc(collection(db, "academy_lessons"));
        const lessonData = { ...lesson, id: newDoc.id, createdAt: Date.now() };
        await setDoc(newDoc, lessonData);
        set((state) => ({ lessons: [...state.lessons, lessonData] }));
      },
      updateLesson: async (id, lesson) => {
        const lessonRef = doc(db, "academy_lessons", id);
        await setDoc(lessonRef, { ...lesson, id }, { merge: true });
        set((state) => ({
          lessons: state.lessons.map((l) =>
            l.id === id ? { ...l, ...lesson } : l,
          ),
        }));
      },
      deleteLesson: async (id) => {
        const lessonRef = doc(db, "academy_lessons", id);
        await deleteDoc(lessonRef);
        set((state) => ({
          lessons: state.lessons.filter((l) => l.id !== id),
        }));
      },
      fetchExercises: async () => {
        const exercisesRef = collection(db, "exercises");
        const q = query(exercisesRef, orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        const exercises = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Exercise[];
        set({ exercises });
      },
      addExercise: async (exercise) => {
        const newDoc = doc(collection(db, "exercises"));
        const exerciseData = {
          ...exercise,
          id: newDoc.id,
          createdAt: Date.now(),
        };
        await setDoc(newDoc, exerciseData);
        set((state) => ({ exercises: [...state.exercises, exerciseData] }));
      },
      updateExercise: async (id, exercise) => {
        const exerciseRef = doc(db, "exercises", id);
        await setDoc(exerciseRef, { ...exercise, id }, { merge: true });
        set((state) => ({
          exercises: state.exercises.map((e) =>
            e.id === id ? { ...e, ...exercise } : e,
          ),
        }));
      },
      deleteExercise: async (id) => {
        const exerciseRef = doc(db, "exercises", id);
        await deleteDoc(exerciseRef);
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== id),
        }));
      },
      fetchSymptomDefinitions: async () => {
        const sympRef = collection(db, "symptom_definitions");
        const q = query(sympRef, orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        const definitions = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SymptomDefinition[];
        set({ symptomDefinitions: definitions });
      },
      addSymptomDefinition: async (label) => {
        const newDoc = doc(collection(db, "symptom_definitions"));
        const sympData = { label, id: newDoc.id, createdAt: Date.now() };
        await setDoc(newDoc, sympData);
        set((state) => ({
          symptomDefinitions: [...state.symptomDefinitions, sympData],
        }));
      },
      deleteSymptomDefinition: async (id) => {
        const sympRef = doc(db, "symptom_definitions", id);
        await deleteDoc(sympRef);
        set((state) => ({
          symptomDefinitions: state.symptomDefinitions.filter((s) => s.id !== id),
        }));
      },
      uploadImage: async (
        file: File,
        onProgress?: (progress: number) => void,
      ) => {
        return new Promise((resolve, reject) => {
          try {
            console.log(
              "Starting Base64 conversion (No Storage needed):",
              file.name,
              file.size,
            );

            const reader = new FileReader();

            reader.onprogress = (event) => {
              if (event.lengthComputable && onProgress) {
                const progress = (event.loaded / event.total) * 100;
                onProgress(progress);
              }
            };

            reader.onload = () => {
              console.log("Base64 conversion complete");
              if (onProgress) onProgress(100);
              resolve(reader.result as string);
            };

            reader.onerror = (error) => {
              console.error("FileReader error:", error);
              reject(new Error("Rasmni o'qishda xatolik yuz berdi."));
            };

            reader.readAsDataURL(file);
          } catch (error: any) {
            console.error("uploadImage catch error:", error);
            reject(
              new Error(error.message || "Yuklashda ichki xatolik yuz berdi."),
            );
          }
        });
      },
      seedLessons: async (initialLessons) => {
        for (const lesson of initialLessons) {
          const newDoc = doc(collection(db, "academy_lessons"));
          const lessonData = {
            ...lesson,
            id: newDoc.id,
            createdAt: Date.now(),
          };
          await setDoc(newDoc, lessonData);
        }
        const lessonsRef = collection(db, "academy_lessons");
        const q = query(lessonsRef, orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        const lessons = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        set({ lessons });
      },
      seedExercises: async (initialExercises) => {
        for (const exercise of initialExercises) {
          const newDoc = doc(collection(db, "exercises"));
          const exerciseData = {
            ...exercise,
            id: newDoc.id,
            createdAt: Date.now(),
          };
          await setDoc(newDoc, exerciseData);
        }
        const exercisesRef = collection(db, "exercises");
        const q = query(exercisesRef, orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        const exercises = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Exercise[];
        set({ exercises });
      },
      seedSymptomDefinitions: async () => {
        const initialSymptoms = [
          { label: "Bosh aylanishi" },
          { label: "Holsizlik" },
          { label: "Ko'p chanqash" },
          { label: "Tez-tez siydik ajralishi" },
          { label: "Qo'l-oyoq uvishishi" },
          { label: "Ko'rish xiralashishi" },
          { label: "Yurak urish tezlashishi" },
        ];
        for (const symp of initialSymptoms) {
          const newDoc = doc(collection(db, "symptom_definitions"));
          await setDoc(newDoc, { ...symp, id: newDoc.id, createdAt: Date.now() });
        }
        const sympRef = collection(db, "symptom_definitions");
        const q = query(sympRef, orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        const symptomDefinitions = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SymptomDefinition[];
        set({ symptomDefinitions });
      },
      syncFromFirestore: async (userId: string) => {
        // Sync Profile
        const profDoc = await getDoc(doc(db, "profiles", userId));
        if (profDoc.exists()) {
          set({ profile: profDoc.data() as UserProfile });
        }

        // Sync Logs (limit to last 50 for performance)
        const logsRef = collection(db, "logs");
        const qLogs = query(
          logsRef,
          where("userId", "==", userId),
          orderBy("id", "desc"),
          limit(50),
        );
        const logsSnap = await getDocs(qLogs);
        const logs = logsSnap.docs.map((doc) => doc.data());
        set({ glucoseLogs: logs });

        // Sync Symptoms
        const sympRef = collection(db, "symptoms");
        const qSymp = query(
          sympRef,
          where("userId", "==", userId),
          orderBy("id", "desc"),
          limit(50),
        );
        const sympSnap = await getDocs(qSymp);
        const symptoms = sympSnap.docs.map((doc) => doc.data());
        set({ symptoms: symptoms });

        // Sync Symptom Definitions
        const defRef = collection(db, "symptom_definitions");
        const qDef = query(defRef, orderBy("createdAt", "asc"));
        const defSnap = await getDocs(qDef);
        const definitions = defSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as SymptomDefinition[];
        set({ symptomDefinitions: definitions });

        // Sync Water Logs
        const waterRef = collection(db, "water_logs");
        const qWater = query(
          waterRef,
          where("userId", "==", userId),
          orderBy("timestamp", "desc"),
          limit(50),
        );
        const waterSnap = await getDocs(qWater);
        const waterLogs = waterSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WaterLog[];
        set({ waterLogs });

        // Sync Insulin Logs
        const insulinRef = collection(db, "insulin_logs");
        const qInsulin = query(
          insulinRef,
          where("userId", "==", userId),
          limit(50),
        );
        const insulinSnap = await getDocs(qInsulin);
        const insulinLogs = insulinSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as InsulinLog[];
        // Sort client-side to avoid index requirement
        const sortedInsulin = insulinLogs.sort((a, b) => b.timestamp - a.timestamp);
        set({ insulinLogs: sortedInsulin });
      },
      addWaterLog: async (amount: number) => {
        const userId = get().user?.uid;
        if (!userId) return;

        const newDoc = doc(collection(db, "water_logs"));
        const newLog: WaterLog = {
          id: newDoc.id,
          amount,
          timestamp: new Date().toISOString(),
        };

        await setDoc(newDoc, { ...newLog, userId });
        set((state) => ({ waterLogs: [newLog, ...state.waterLogs] }));
      },
      deleteWaterLog: async (id: string) => {
        await deleteDoc(doc(db, "water_logs", id));
        set((state) => ({
          waterLogs: state.waterLogs.filter((log) => log.id !== id),
        }));
      },
      theme: "light",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),

      // ========== Doctor Profile Management ==========
      fetchDoctorProfiles: async () => {
        const ref = collection(db, "doctor_profiles");
        const q = query(ref, orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const doctors = snap.docs.map((d) => ({
          ...d.data(),
          uid: d.id,
        })) as DoctorProfile[];
        set({ doctorProfiles: doctors });
      },

      addDoctorProfile: async (doctor) => {
        const { password, ...doctorData } = doctor;
        const docData = { ...doctorData, createdAt: Date.now() };
        // Create Firebase Auth account using a secondary app to avoid signing out the admin
        const { initializeApp, deleteApp } = await import('firebase/app');
        const { getAuth, createUserWithEmailAndPassword } = await import('firebase/auth');
        const syntheticEmail = `${doctor.login}@glucobalance.app`;
        
        // Create a temporary secondary app
        const secondaryApp = initializeApp(
          {
            apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
            authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
          },
          'secondary-auth-' + Date.now()
        );
        const secondaryAuth = getAuth(secondaryApp);
        
        try {
          const userCred = await createUserWithEmailAndPassword(secondaryAuth, syntheticEmail, password);
          const realUid = userCred.user.uid;
          
          const docDataWithUid = { ...docData, realUid };
          
          await deleteApp(secondaryApp);
          
          // Use login as doc ID for easy lookup
          await setDoc(doc(db, "doctor_profiles", doctor.login), docDataWithUid);
          
          // CRITICAL: Also create a profile entry with role 'doctor' so they are filtered out of patient lists
          await setDoc(doc(db, "profiles", realUid), {
            name: doctor.name,
            email: syntheticEmail,
            role: 'doctor',
            specialization: doctor.specialization
          });

          set((state) => ({
            doctorProfiles: [docDataWithUid, ...state.doctorProfiles],
          }));
        } catch (err: any) {
          await deleteApp(secondaryApp);
          if (err.code !== 'auth/email-already-in-use') {
            throw err;
          }
          // If already in use, we still want to save the doc if possible, 
          // but we might not have the UID. The login backfill will handle it.
          await setDoc(doc(db, "doctor_profiles", doctor.login), docData);
          set((state) => ({
            doctorProfiles: [docData, ...state.doctorProfiles],
          }));
        }
      },

      deleteDoctorProfile: async (login: string) => {
        try {
          // 1. Delete from doctor_profiles
          await deleteDoc(doc(db, "doctor_profiles", login));
          
          // 2. Also delete from profiles to avoid orphans
          await deleteDoc(doc(db, "profiles", login));
          
          set((state) => ({
            doctorProfiles: state.doctorProfiles.filter((d) => d.login !== login),
          }));
        } catch (error) {
          console.error("Error deleting doctor profile:", error);
          throw error;
        }
      },

      checkDoctorAccess: async (login: string) => {
        const docRef = doc(db, "doctor_profiles", login);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return snap.data() as DoctorProfile;
        }
        return null;
      },

      // ========== Patient Management (Doctor view) ==========
      fetchAllPatients: async () => {
        const { user, profile } = get();
        if (!user || !profile) return;

        const ref = collection(db, "profiles");
        let q: any = ref;

        // If current user is a doctor, filter by their doctorId
        if (profile.role === 'doctor') {
          const doctorLogin = user.email?.replace('@glucobalance.app', '') || '';
          q = query(ref, where("doctorId", "==", doctorLogin));
        }

        const snap = await getDocs(q);
        const patients = snap.docs
          .map((d) => ({
            uid: d.id,
            ...(d.data() as object),
          }))
          .filter((p: any) => {
            const role = (p.role || 'user').toLowerCase();
            return role !== 'doctor' && role !== 'admin' && role !== 'shifokor';
          });
        set({ patients });
      },

      fetchPatientDetail: async (uid: string) => {
        // Fetch profile
        const profDoc = await getDoc(doc(db, "profiles", uid));
        const profile = profDoc.exists() ? profDoc.data() : null;

        // Fetch glucose logs
        const logsRef = collection(db, "logs");
        const qLogs = query(
          logsRef,
          where("userId", "==", uid),
          orderBy("id", "desc"),
          limit(30),
        );
        const logsSnap = await getDocs(qLogs);
        const glucoseLogs = logsSnap.docs.map((d) => d.data());

        // Fetch symptoms
        const sympRef = collection(db, "symptoms");
        const qSymp = query(
          sympRef,
          where("userId", "==", uid),
          orderBy("id", "desc"),
          limit(30),
        );
        const sympSnap = await getDocs(qSymp);
        const symptoms = sympSnap.docs.map((d) => d.data());

        // Fetch water logs
        const waterRef = collection(db, "water_logs");
        const qWater = query(
          waterRef,
          where("userId", "==", uid),
          orderBy("timestamp", "desc"),
          limit(30),
        );
        const waterSnap = await getDocs(qWater);
        const waterLogs = waterSnap.docs.map((d) => d.data());

        // Fetch insulin logs
        const insulinRef = collection(db, "insulin_logs");
        const qInsulin = query(
          insulinRef,
          where("userId", "==", uid),
          limit(30),
        );
        const insulinSnap = await getDocs(qInsulin);
        const insulinLogs = insulinSnap.docs.map((d) => d.data() as InsulinLog);
        const sortedInsulin = insulinLogs.sort((a, b) => b.timestamp - a.timestamp);

        return { profile, glucoseLogs, symptoms, waterLogs, insulinLogs: sortedInsulin };
      },

      // ========== Daily Reports (Doctor Dashboard) ==========
      fetchDailyReports: async (date: string) => {
        const patients = get().patients;
        if (patients.length === 0) return;

        set({ dailyReportsLoading: true });

        try {
          // Create date boundaries
          const dayStart = new Date(date);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(date);
          dayEnd.setHours(23, 59, 59, 999);
          
          const startMs = dayStart.getTime();
          const endMs = dayEnd.getTime();
          const startISO = dayStart.toISOString();
          const endISO = dayEnd.toISOString();

          // Use existing symptom definitions if loaded, otherwise fetch them
          let sympDefMap = new Map(get().symptomDefinitions.map((s) => [s.id, s.label]));
          if (sympDefMap.size === 0) {
            const defRef = collection(db, "symptom_definitions");
            const defSnap = await getDocs(defRef);
            const defs = defSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
            sympDefMap = new Map(defs.map((s) => [s.id, s.label]));
          }

          // Optimized approach: Fetch all data for the day across all users in 4 queries
          const fetchBatch = async (collName: string, isMs: boolean) => {
            const q = query(
              collection(db, collName),
              where("timestamp", ">=", isMs ? startMs : startISO),
              where("timestamp", "<=", isMs ? endMs : endISO)
            );
            const snap = await getDocs(q);
            return snap.docs.map(d => ({ ...d.data(), id: d.id }));
          };

          const [allLogs, allSymptoms, allWater, allInsulin] = await Promise.all([
            fetchBatch("logs", false), // ISO
            fetchBatch("symptoms", false), // ISO
            fetchBatch("water_logs", false), // ISO
            fetchBatch("insulin_logs", true) // Ms
          ]);

          // Group by userId for quick lookup
          const logsGroup = new Map();
          const sympGroup = new Map();
          const waterGroup = new Map();
          const insulinGroup = new Map();

          allLogs.forEach((l: any) => {
            if (!logsGroup.has(l.userId)) logsGroup.set(l.userId, []);
            logsGroup.get(l.userId).push(l);
          });
          allSymptoms.forEach((s: any) => {
            if (!sympGroup.has(s.userId)) sympGroup.set(s.userId, []);
            sympGroup.get(s.userId).push({
              ...s,
              symptomLabels: (s.symptoms || []).map((id: string) => sympDefMap.get(id) || id)
            });
          });
          allWater.forEach((w: any) => {
            if (!waterGroup.has(w.userId)) waterGroup.set(w.userId, []);
            waterGroup.get(w.userId).push(w);
          });
          allInsulin.forEach((i: any) => {
            if (!insulinGroup.has(i.userId)) insulinGroup.set(i.userId, []);
            insulinGroup.get(i.userId).push(i);
          });

          // Assemble reports for all patients
          const reports: DailyPatientReport[] = patients.map(patient => {
            const uid = patient.uid;
            const glucoseLogs = (logsGroup.get(uid) || []).sort((a: any, b: any) => 
               new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            const symptoms = (sympGroup.get(uid) || []).sort((a: any, b: any) => 
               new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
            const waterLogs = waterGroup.get(uid) || [];
            const insulinLogs = (insulinGroup.get(uid) || []).sort((a: any, b: any) => 
               b.timestamp - a.timestamp
            );

            const hasData = glucoseLogs.length > 0 || symptoms.length > 0 || waterLogs.length > 0 || insulinLogs.length > 0;

            return {
              patient,
              glucoseLogs,
              symptoms,
              waterLogs,
              insulinLogs,
              hasData
            };
          });

          // Sort: patients with data first, then alphabetically
          reports.sort((a, b) => {
            if (a.hasData && !b.hasData) return -1;
            if (!a.hasData && b.hasData) return 1;
            return (a.patient.name || '').localeCompare(b.patient.name || '');
          });

          set({ dailyReports: reports, dailyReportsLoading: false });
        } catch (err) {
          console.error("Error in fetchDailyReports:", err);
          set({ dailyReportsLoading: false });
        }
      },

      // ========== Chat System ==========
      fetchChatRooms: async () => {
        const userId = get().user?.uid;
        if (!userId) return;
        const role = get().profile?.role;

        const ref = collection(db, "chat_rooms");
        const field = role === "doctor" ? "doctorId" : "patientId";
        // No orderBy to avoid composite index requirement
        const q = query(ref, where(field, "==", userId));
        const snap = await getDocs(q);
        const rooms = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as ChatRoom[];
        // Sort client-side
        rooms.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        set({ chatRooms: rooms });
      },

      getOrCreateChatRoom: async (patientId, patientName, doctorId, doctorName) => {
        // Check if chat room already exists for this specific doctor-patient pair
        const ref = collection(db, "chat_rooms");
        const q = query(
          ref,
          where("patientId", "==", patientId),
          where("doctorId", "==", doctorId),
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs[0].id;
        }

        // Create new room
        const newRoom = {
          patientId,
          doctorId,
          patientName,
          doctorName,
          lastMessage: "",
          lastMessageTime: null,
          updatedAt: Date.now(),
        };
        const newDoc = await addDoc(collection(db, "chat_rooms"), newRoom);
        // Update local state
        set((state) => ({
          chatRooms: [{ id: newDoc.id, ...newRoom } as ChatRoom, ...state.chatRooms],
        }));
        return newDoc.id;
      },

      sendMessage: async (roomId, text, type: 'text' | 'video_call' | 'video_call_ended' = 'text') => {
        const user = get().user;
        const profile = get().profile;
        if (!user || !profile) return;

        const msgData = {
          roomId,
          senderId: user.uid,
          senderName: profile.name,
          text,
          type,
          timestamp: Date.now(),
        };

        try {
          await addDoc(collection(db, "chat_messages"), msgData);

          // Update room's last message
          await updateDoc(doc(db, "chat_rooms", roomId), {
            lastMessage: text,
            lastMessageType: type,
            lastMessageTime: Date.now(),
            updatedAt: Date.now(),
          });
        } catch (error) {
          console.error("Error in sendMessage:", error);
          throw error;
        }
      },

      markRoomAsRead: async (roomId: string) => {
        const userId = get().user?.uid;
        if (!userId) return;
        const statusDocId = `${roomId}_${userId}`;
        await setDoc(doc(db, "chat_read_status", statusDocId), {
          roomId,
          userId,
          lastReadAt: Date.now(),
        });
      },

      getLastReadAt: async (roomId: string) => {
        const userId = get().user?.uid;
        if (!userId) return 0;
        const statusDocId = `${roomId}_${userId}`;
        const snap = await getDoc(doc(db, "chat_read_status", statusDocId));
        if (snap.exists()) {
          return snap.data().lastReadAt || 0;
        }
        return 0;
      },

      // ========== Appointments ==========
      fetchAppointments: async () => {
        const userId = get().user?.uid;
        const userEmail = get().user?.email;
        if (!userId) return;
        const role = get().profile?.role;

        const ref = collection(db, "appointments");
        // Appointments store doctorId as login, patientId as UID
        const field = role === "doctor" ? "doctorId" : "patientId";
        // For doctors, extract login from synthetic email (login@glucobalance.app -> login)
        const doctorLogin = userEmail?.replace('@glucobalance.app', '') || '';
        const value = role === "doctor" ? doctorLogin : userId;
        const q = query(ref, where(field, "==", value), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const appointments = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as Appointment[];
        set({ appointments });
      },

      createAppointment: async (appointment) => {
        const newData = {
          ...appointment,
          status: "pending" as const,
          createdAt: Date.now(),
        };
        const newDoc = await addDoc(collection(db, "appointments"), newData);
        set((state) => ({
          appointments: [{ id: newDoc.id, ...newData }, ...state.appointments],
        }));
      },

      updateAppointmentStatus: async (id, status) => {
        await updateDoc(doc(db, "appointments", id), { status });
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, status } : a,
          ),
        }));
      },
    }),
    {
      name: "glucobalance-storage",
    },
  ),
);
