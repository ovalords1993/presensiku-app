"use client";

import { FormEvent, useEffect, useState } from "react";

const statusColors = {
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  sky: "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

const defaultManualForm = {
  name: "",
  className: "",
  checkIn: "07:00",
  status: "Hadir",
  notes: "",
};

export default function AdminPage() {
  const [attendanceRows, setAttendanceRows] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalStudents: 0, attendanceRate: 0, lateCount: 0, pendingApproval: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [classSummary, setClassSummary] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<string>("mock");
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualForm, setManualForm] = useState(defaultManualForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const loadData = async () => {
    const response = await fetch("/api/attendance");
    const data = await response.json();

    setSummary(data.summary);
    setAttendanceRows(data.attendanceRows);
    setRecentActivities(data.recentActivities);
    setClassSummary(data.classSummary);
    setPendingApprovals(data.pendingApprovals ?? []);
    setDataSource(data.dataSource ?? "mock");
  };

  const handleExportExcel = () => {
    const rows = [
      ["Nama", "Kelas", "Jam Masuk", "Status", "Catatan"],
      ...attendanceRows.map((row) => [
        row.name ?? "",
        row.className ?? "",
        row.checkIn ?? "",
        row.status ?? "",
        row.notes ?? "",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `presensi-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handlePendingApproval = (requestId: string, decision: "approved" | "rejected") => {
    const request = pendingApprovals.find((item) => item.id === requestId);

    if (!request) {
      return;
    }

    setPendingApprovals((current) => current.filter((item) => item.id !== requestId));
    setSummary((current) => ({
      ...current,
      pendingApproval: Math.max(0, current.pendingApproval - 1),
    }));
    setSubmitMessage(
      decision === "approved"
        ? `Permohonan izin ${request.name} berhasil disetujui.`
        : `Permohonan izin ${request.name} ditolak.`
    );
  };

  const updateManualForm = (field: keyof typeof defaultManualForm, value: string) => {
    setManualForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmitManualAttendance = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/attendance/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...manualForm,
          color:
            manualForm.status === "Terlambat"
              ? "amber"
              : manualForm.status === "Izin"
                ? "sky"
                : "emerald",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message ?? "Gagal menyimpan presensi manual.");
      }

      await loadData();
      setManualForm(defaultManualForm);
      setShowManualForm(false);
      setSubmitMessage("Presensi manual berhasil disimpan.");
    } catch (error) {
      setSubmitMessage(
        error instanceof Error ? error.message : "Presensi manual gagal disimpan."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">Admin Sekolah</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                dataSource === "supabase"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-300"
              }`}
            >
              {dataSource === "supabase" ? "Live Supabase" : "Demo Mode"}
            </span>
            <button
              type="button"
              onClick={handleExportExcel}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500"
            >
              Export Excel
            </button>
            <button
              type="button"
              onClick={() => setShowManualForm(true)}
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
            >
              Tambah Presensi Manual
            </button>
          </div>
        </div>

        {submitMessage ? (
          <div className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {submitMessage}
          </div>
        ) : null}

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Total siswa</p>
            <p className="mt-2 text-3xl font-bold">{summary.totalStudents}</p>
            <p className="mt-2 text-xs text-emerald-300">+42 minggu ini</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Kehadiran hari ini</p>
            <p className="mt-2 text-3xl font-bold">{summary.attendanceRate}%</p>
            <p className="mt-2 text-xs text-sky-300">1.145 siswa hadir</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Terlambat</p>
            <p className="mt-2 text-3xl font-bold">{summary.lateCount}</p>
            <p className="mt-2 text-xs text-amber-300">2.7% dari total</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Izin menunggu</p>
            <p className="mt-2 text-3xl font-bold">{summary.pendingApproval}</p>
            <p className="mt-2 text-xs text-violet-300">Perlu persetujuan</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Daftar Presensi Hari Ini</h2>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                15 Juni 2026
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 pr-4 font-medium">Nama</th>
                    <th className="pb-3 pr-4 font-medium">Kelas</th>
                    <th className="pb-3 pr-4 font-medium">Jam Masuk</th>
                    <th className="pb-3 pr-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRows.map((row) => (
                    <tr key={`${row.name}-${row.checkIn}-${row.className}`} className="border-b border-slate-800 last:border-none">
                      <td className="py-3 pr-4 font-medium text-white">{row.name}</td>
                      <td className="py-3 pr-4 text-slate-300">{row.className}</td>
                      <td className="py-3 pr-4 text-slate-300">{row.checkIn}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusColors[row.color as keyof typeof statusColors]}`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-semibold">Persetujuan Izin</h3>
              <div className="mt-5 space-y-3">
                {pendingApprovals.length ? (
                  pendingApprovals.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.className} • {item.requestedAt}</p>
                        </div>
                        <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-sky-300">
                          Menunggu
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-300">{item.reason}</p>

                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handlePendingApproval(item.id, "rejected")}
                          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200"
                        >
                          Tolak
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePendingApproval(item.id, "approved")}
                          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Setujui
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">Tidak ada izin yang menunggu persetujuan.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-semibold">Aktivitas Terbaru</h3>
              <ul className="mt-5 space-y-4 text-sm text-slate-300">
                {recentActivities.map((item) => (
                  <li key={`${item.actor}-${item.action}`} className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
                    <span className="font-medium text-white">{item.actor}</span> {item.action}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-semibold">Ringkasan Kelas</h3>
              <div className="mt-5 space-y-4">
                {classSummary.map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
                      <span>{item.label}</span>
                      <span>{item.percent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className={`h-2 rounded-full ${
                          item.color === "emerald"
                            ? "bg-emerald-400"
                            : item.color === "sky"
                              ? "bg-sky-400"
                              : "bg-violet-400"
                        }`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showManualForm ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
          onClick={() => setShowManualForm(false)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tambah Presensi Manual</h2>
              <button
                type="button"
                onClick={() => setShowManualForm(false)}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmitManualAttendance} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-sm text-slate-300">
                  Nama
                  <input
                    required
                    value={manualForm.name}
                    onChange={(event) => updateManualForm("name", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  Kelas
                  <input
                    required
                    value={manualForm.className}
                    onChange={(event) => updateManualForm("className", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  Jam Masuk
                  <input
                    required
                    value={manualForm.checkIn}
                    onChange={(event) => updateManualForm("checkIn", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                  />
                </label>

                <label className="block text-sm text-slate-300">
                  Status
                  <select
                    value={manualForm.status}
                    onChange={(event) => updateManualForm("status", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Terlambat">Terlambat</option>
                    <option value="Izin">Izin</option>
                  </select>
                </label>
              </div>

              <label className="block text-sm text-slate-300">
                Catatan
                <textarea
                  value={manualForm.notes}
                  onChange={(event) => updateManualForm("notes", event.target.value)}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualForm(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Presensi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
