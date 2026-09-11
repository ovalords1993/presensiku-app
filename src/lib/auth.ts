import type { Route } from "next";

export type Role = "super-admin" | "admin" | "guru" | "murid";

export interface Session {
  email: string;
  name: string;
  role: Role;
}

export const STORAGE_KEY = "presensiku-session";

export const DEMO_USERS: Array<{
  email: string;
  password: string;
  role: Role;
  name: string;
}> = [
  {
    email: "superadmin@presensiku.test",
    password: "admin123",
    role: "super-admin",
    name: "Super Admin",
  },
  {
    email: "admin@presensiku.test",
    password: "admin123",
    role: "admin",
    name: "Admin Sekolah",
  },
  {
    email: "guru@presensiku.test",
    password: "admin123",
    role: "guru",
    name: "Guru Piket",
  },
  {
    email: "murid@presensiku.test",
    password: "admin123",
    role: "murid",
    name: "Murid A",
  },
];

export const ROUTE_BY_ROLE: Record<Role, Route> = {
  "super-admin": "/super-admin",
  admin: "/admin",
  guru: "/guru",
  murid: "/murid",
};

export function getStoredSession(): Session | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(session: Session) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function isRoleAllowed(sessionRole: Role, allowedRoles?: Role[]) {
  if (!allowedRoles) {
    return true;
  }

  return allowedRoles.includes(sessionRole);
}
