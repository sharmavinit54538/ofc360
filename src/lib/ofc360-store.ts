import { useEffect, useState, useSyncExternalStore } from "react";

export { store as reduxStore, type RootState, type AppDispatch } from "@/redux/store";

export type Role = "super_admin" | "company_admin" | "admin" | "hr" | "hr-admin" | "it_admin" | "executive" | "manager" | "employee";

export interface ofc360User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  companyId: string;
  emailVerified: boolean;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logoDataUrl?: string;
  industry?: string;
  size?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
}

export interface HR {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  managerName?: string;
  shift?: string;
  status?: string;
  activationToken?: string;
  activationTokenExpiresAt?: string;
}

export interface Manager {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  team: string[];
  shiftStart: string;
  shiftEnd: string;
  workingDays: string[];
}

export interface HRDocument {
  id: string;
  name: string;
  employeeId?: string;
  employeeName?: string;
  category: 'Employee Documents' | 'Education' | 'Employment' | 'Company Documents';
  type: string;
  uploadedBy: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'Verified' | 'Pending' | 'Rejected' | 'Expired';
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png' | 'docx';
  description?: string;
  rejectionReason?: string;
}

export interface HRDocumentActivity {
  id: string;
  documentId: string;
  documentName: string;
  action: 'Uploaded' | 'Verified' | 'Rejected' | 'Downloaded' | 'Updated';
  performedBy: string;
  timestamp: string;
  details?: string;
}

export interface Workspace {
  user: ofc360User | null;
  company: Company | null;
  hrs: HR[];
  employees: Employee[];
  managers: Manager[];
  documents?: HRDocument[];
  documentActivities?: HRDocumentActivity[];
  pendingOtp?: string;
  isDemoUser?: boolean;
  isRestoring?: boolean;
  tenantModeCompany?: { id: string; name: string } | null;
}


const KEY = "ofc360:workspace:v1";
const REMEMBER_KEY = "ofc360:remember";

const defaultState: Workspace = {
  user: null,
  company: null,
  hrs: [],
  employees: [],
  managers: [],
  documents: [],
  documentActivities: [],
  isRestoring: false,
};

let state: Workspace = defaultState;
const listeners = new Set<() => void>();
let hasLoaded = false;

export function loadOfc360Store() {
  if (typeof window === "undefined" || hasLoaded) return;
  hasLoaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...defaultState, ...parsed };
    }
    state.isRestoring = false;
    emit();
  } catch {
    state.isRestoring = false;
    emit();
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    const toSave = { ...state };
    delete toSave.isRestoring;
    localStorage.setItem(KEY, JSON.stringify(toSave));
  } catch { }
}

function emit() {
  listeners.forEach((l) => l());
}

export const ofc360 = {
  get: () => state,
  set: (partial: Partial<Workspace>) => {
    state = { ...state, ...partial };
    persist();
    emit();
  },
  reset: () => {
    state = defaultState;
    persist();
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useofc360(): Workspace {
  return useSyncExternalStore(
    ofc360.subscribe,
    () => state,
    () => defaultState,
  );
}

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const rememberStore = {
  get: () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(REMEMBER_KEY) || "";
  },
  set: (email: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(REMEMBER_KEY, email);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(REMEMBER_KEY);
  },
};
