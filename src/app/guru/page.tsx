"use client";

import { useEffect, useState } from "react";

export default function GuruPage() {
  const [dataSource, setDataSource] = useState("mock");
  const [schedule, setSchedule] = useState<any[]>([]);
  const [attendanceRows, setAttendanceRows] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalStudents: 0, attendanceRate: 0, lateCount: 0, pendingApproval: 0 });

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("/api/attendance");
      const data = await response.json();

      setDataSource(data.dataSource ?? "mock");
      setSchedule([
        { time: "07:00", subject: "Matematika", className: "X-A" },
        { time: "09:00", subject: "Fisika", className: "XI-B" },
        { time: "13:00", subject: "Konsultasi siswa", className: "-" },
      ]);
      setAttendanceRows(data.attendanceRows || []);
      setSummary(data.summary || { totalStudents: 0, attendanceRate: 0, lateCount: 0, pendingApproval: 0 });
    };

    void loadData();
  }, []);

  const presentCount = attendanceRows.filter((item) => item.status === "Hadir").length;

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Guru</p>
            <h1 className="mt-2 text-3xl font-bold">Dashboard Guru</h1>
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

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Total siswa</p>
            <p className="mt-2 text-3xl font-bold">{summary.totalStudents}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Hadir</p>
            <p className="mt-2 text-3xl font-bold text-emerald-300">{presentCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Terlambat</p>
            <p className="mt-2 text-3xl font-bold text-amber-300">{summary.lateCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Kehadiran</p>
            <p className="mt-2 text-3xl font-bold text-sky-300">{summary.attendanceRate}%</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Jadwal hari ini</p>
            <ul className="mt-3 space-y-3 text-sm text-slate-200">
              {schedule.map((item) => (
                <li key={`${item.time}-${item.subject}`} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <div className="font-medium text-white">{item.time} - {item.subject}</div>
                  <div className="text-xs text-slate-400">{item.className !== "-" ? `Kelas ${item.className}` : "Konsultasi"}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Status presensi</p>
            <p className="mt-3 text-2xl font-bold text-emerald-400">{summary.attendanceRate}%</p>
            <div className="mt-5 space-y-2">
              {attendanceRows.slice(0, 4).map((item) => (
                <div key={`${item.name}-${item.checkIn}`} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200">
                  <div className="font-medium text-white">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.className} • {item.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
