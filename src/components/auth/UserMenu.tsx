"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearStoredSession, getStoredSession, Session } from "@/lib/auth";

const NAV_ITEMS: Array<{ href: Route; label: string }> = [
  { href: "/", label: "Beranda" },
  { href: "/admin", label: "Admin" },
  { href: "/guru", label: "Guru" },
  { href: "/murid", label: "Murid" },
  { href: "/super-admin", label: "Super Admin" },
  { href: "/presensi", label: "Presensi" },
];

export default function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
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
    <div className="rounded-2xl border border-slate-700 bg-slate-900/95 px-4 py-3 shadow-2xl shadow-slate-950/50 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
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

      <div className="mt-3 flex flex-wrap gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full border px-2.5 py-1.5 text-xs font-medium transition ${
                isActive
                  ? "border-indigo-500 bg-indigo-500/15 text-indigo-200"
                  : "border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
