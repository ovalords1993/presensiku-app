"use client";

import { FormEvent, useEffect, useState } from "react";

const statusColors = {
  Hadir: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Terlambat: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Izin: "bg-sky-500/15 text-sky-300 border-sky-500/30",
};

export default function MuridPage() {
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [studentProfile, setStudentProfile] = useState({
    name: "",
    nisn: "",
    className: "",
    wali: "",
    statusToday: "",
  });
  const [dataSource, setDataSource] = useState("mock");
  const [showIzinForm, setShowIzinForm] = useState(false);
  const [izinReason, setIzinReason] = useState("");
  const [izinMessage, setIzinMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("/api/students");
      const data = await response.json();

      setAttendanceHistory(data.attendanceHistory);
      setStudentProfile(data.students[0]);
      setDataSource(data.dataSource ?? "mock");
    };

    void loadData();
  }, []);

  const handleSubmitIzin = (event: FormEvent) => {
    event.preventDefault();

    if (!izinReason.trim()) {
      setIzinMessage("Mohon isi alasan izin terlebih dahulu.");
      return;
    }

    setIzinMessage("Permintaan izin berhasil dikirim ke admin sekolah.");
    setIzinReason("");
    setShowIzinForm(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Murid</p>
            <h1 className="mt-2 text-3xl font-bold">Murid / Orang Tua</h1>
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
              onClick={() => setShowIzinForm(true)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500"
            >
              Ajukan Izin
            </button>
          </div>
        </div>

        {izinMessage ? (
          <div className="mt-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {izinMessage}
          </div>
        ) : null}

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Status hari ini</p>
            <p className="mt-3 text-2xl font-bold text-emerald-400">{studentProfile.statusToday}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Kelas</p>
            <p className="mt-3 text-lg font-semibold">{studentProfile.className}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Jam masuk</p>
            <p className="mt-3 text-lg font-semibold">07:05</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Pengumuman</p>
            <p className="mt-3 text-sm text-slate-200">Ujian tengah semester minggu depan.</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Riwayat Presensi</h2>

            <div className="mt-5 space-y-3">
              {attendanceHistory.map((item) => (
                <div
                  key={`${item.date}-${item.note}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-4"
                >
                  <div>
                    <div className="font-medium text-white">{item.date}</div>
                    <div className="text-sm text-slate-400">{item.note}</div>
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${statusColors[item.status as keyof typeof statusColors]}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Informasi Siswa</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-slate-400">Nama</span>
                <p className="mt-1 text-base font-semibold text-white">{studentProfile.name}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-slate-400">NISN</span>
                <p className="mt-1 text-base font-semibold text-white">{studentProfile.nisn}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-slate-400">Wali</span>
                <p className="mt-1 text-base font-semibold text-white">{studentProfile.wali}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showIzinForm ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
          onClick={() => setShowIzinForm(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Ajukan Izin</h2>
              <button
                type="button"
                onClick={() => setShowIzinForm(false)}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSubmitIzin} className="space-y-4">
              <label className="block text-sm text-slate-300">
                Alasan izin
                <textarea
                  required
                  rows={4}
                  value={izinReason}
                  onChange={(event) => setIzinReason(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-indigo-500"
                />
              </label>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowIzinForm(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400"
                >
                  Kirim
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
