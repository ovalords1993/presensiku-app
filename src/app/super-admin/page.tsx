"use client";

import { useEffect, useState } from "react";

export default function SuperAdminPage() {
  const [dataSource, setDataSource] = useState("mock");
  const [summary, setSummary] = useState({ totalStudents: 0, attendanceRate: 0, lateCount: 0, pendingApproval: 0 });

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("/api/attendance");
      const data = await response.json();

      setDataSource(data.dataSource ?? "mock");
      setSummary(data.summary || { totalStudents: 0, attendanceRate: 0, lateCount: 0, pendingApproval: 0 });
    };

    void loadData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Super Admin</p>
            <h1 className="mt-2 text-3xl font-bold">Platform Dashboard</h1>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${
              dataSource === "supabase"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-300"
            }`}
          >
            {dataSource === "supabase" ? "Live Supabase" : "Demo Mode"}
          </span>
        </div>

        <p className="mt-3 text-slate-300">
          Dashboard platform untuk mengelola tenant, billing, dan kesehatan sistem secara global.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Tenant aktif</p>
            <p className="mt-2 text-3xl font-bold">84</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">MRR</p>
            <p className="mt-2 text-3xl font-bold">Rp 48J</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Total siswa</p>
            <p className="mt-2 text-3xl font-bold">{summary.totalStudents}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Kehadiran</p>
            <p className="mt-2 text-3xl font-bold">{summary.attendanceRate}%</p>
          </div>
        </div>
      </div>
    </main>
  );
}
