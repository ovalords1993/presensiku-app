"use client";

import { useEffect, useMemo, useState } from "react";

const attendanceOptions = [
  {
    value: "masuk",
    label: "Presensi Masuk",
    description: "Absen masuk sekolah untuk hari ini.",
  },
  {
    value: "pulang",
    label: "Presensi Pulang",
    description: "Absen pulang setelah kegiatan sekolah selesai.",
  },
];

export default function PresensiPage() {
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState("masuk");
  const [location, setLocation] = useState("Sekolah SMA Nusantara");
  const [studentName, setStudentName] = useState("Murid A");
  const [className, setClassName] = useState("XI-B");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("/api/attendance");
      const data = await response.json();

      setAttendanceHistory(data.attendanceHistory || []);
    };

    void loadData();
  }, []);

  const activeOption = useMemo(
    () => attendanceOptions.find((option) => option.value === selectedType) ?? attendanceOptions[0],
    [selectedType]
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/attendance/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: studentName,
          className,
          checkIn: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: selectedType === "masuk" ? "Hadir" : "Pulang",
          color: selectedType === "masuk" ? "emerald" : "sky",
          notes,
          location,
        }),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.message || "Gagal menyimpan presensi");
      }

      const refreshed = await fetch("/api/attendance");
      const refreshedData = await refreshed.json();
      setAttendanceHistory(refreshedData.attendanceHistory || []);
      setNotes("");
      alert(`Presensi ${activeOption.label} berhasil dicatat.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menyimpan presensi";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Presensi</p>
            <h1 className="mt-2 text-3xl font-bold">Absensi Masuk & Pulang</h1>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-indigo-500 px-5 py-3 font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Presensi"}
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Pilih jenis presensi</h2>
            <div className="mt-5 space-y-4">
              {attendanceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedType(option.value)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    selectedType === option.value
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-700 bg-slate-950"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold">{option.label}</div>
                      <div className="mt-1 text-sm text-slate-300">{option.description}</div>
                    </div>
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        selectedType === option.value
                          ? "border-indigo-400 bg-indigo-400"
                          : "border-slate-500"
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Nama siswa</p>
                <input
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Kelas</p>
                <input
                  value={className}
                  onChange={(event) => setClassName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Lokasi terdeteksi</p>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Catatan</p>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm text-slate-400">Status aktif</p>
              <h3 className="mt-2 text-2xl font-bold text-emerald-400">{activeOption.label}</h3>
              <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
                Lokasi: <span className="font-medium text-white">{location}</span>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-semibold">Riwayat presensi</h3>
              <div className="mt-4 space-y-3">
                {attendanceHistory.map((item, index) => (
                  <div
                    key={`${item.time}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-950 p-3"
                  >
                    <div>
                      <div className="font-medium text-white">{item.type}</div>
                      <div className="text-xs text-slate-400">{item.time}</div>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-300">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
