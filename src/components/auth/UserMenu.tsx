"use client";

import { useEffect, useState } from "react";
import { clearStoredSession, getStoredSession, Session } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(getStoredSession());
  }, []);

  if (!session) {
    return null;
  }

  const handleLogout = () => {
    clearStoredSession();
    setSession(null);
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200">
      <div>
        <div className="font-medium text-white">{session.name}</div>
        <div className="text-xs text-slate-400">{session.role}</div>
      </div>
      <button
        onClick={handleLogout}
        className="rounded-full bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 transition hover:bg-slate-600"
      >
        Logout
      </button>
    </div>
  );
}
