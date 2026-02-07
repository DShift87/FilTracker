import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import type { Filament, Project } from "@/app/context/AppContext";
import type { PrintedPart } from "@/app/context/AppContext";

const DATA_DOC_PATH = "appData/default";

export interface CloudData {
  filaments: Filament[];
  printedParts: PrintedPart[];
  projects: Project[];
}

export async function loadCloudData(): Promise<CloudData | null> {
  if (!isFirebaseConfigured()) return null;
  const db = getDb();
  const ref = doc(db, DATA_DOC_PATH);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { filaments: [], printedParts: [], projects: [] };
  const data = snap.data() as CloudData;
  return {
    filaments: data.filaments ?? [],
    printedParts: data.printedParts ?? [],
    projects: data.projects ?? [],
  };
}

// Firestore doesn't accept undefined; strip it so writes don't fail
function sanitizeForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export async function saveCloudData(data: CloudData): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getDb();
  const ref = doc(db, DATA_DOC_PATH);
  await setDoc(ref, sanitizeForFirestore(data));
}

export function subscribeToCloudData(
  onData: (data: CloudData) => void
): Unsubscribe {
  if (!isFirebaseConfigured()) return () => {};
  const db = getDb();
  const ref = doc(db, DATA_DOC_PATH);
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      onData({ filaments: [], printedParts: [], projects: [] });
      return;
    }
    const data = snap.data() as CloudData;
    onData({
      filaments: data.filaments ?? [],
      printedParts: data.printedParts ?? [],
      projects: data.projects ?? [],
    });
  });
}
