export const attendanceRows = [
  { name: "Alya Putri", className: "XII-A", checkIn: "07:05", status: "Hadir", color: "emerald" },
  { name: "Budi Santoso", className: "XI-B", checkIn: "07:12", status: "Terlambat", color: "amber" },
  { name: "Citra Lestari", className: "X-A", checkIn: "-", status: "Izin", color: "sky" },
  { name: "Dimas Pratama", className: "XII-C", checkIn: "07:01", status: "Hadir", color: "emerald" },
  { name: "Eka Rahma", className: "XI-A", checkIn: "07:20", status: "Terlambat", color: "amber" },
];

export const classSummary = [
  { label: "XII-A", percent: 96, color: "emerald" },
  { label: "XI-B", percent: 89, color: "sky" },
  { label: "X-A", percent: 91, color: "violet" },
];

export const recentActivities = [
  { actor: "Dimas Pratama", action: "melakukan presensi masuk." },
  { actor: "Eka Rahma", action: "mengajukan izin sakit." },
  { actor: "Wali Kelas XI-B", action: "meninjau presensi gangguan." },
];

export const studentProfile = {
  name: "Murid A",
  nisn: "2026060156",
  className: "XI-B",
  wali: "Siti Rahma",
  statusToday: "Hadir",
};

export const attendanceHistory = [
  { date: "11 Jun 2026", status: "Hadir", note: "Masuk pukul 07:05" },
  { date: "10 Jun 2026", status: "Hadir", note: "Masuk pukul 07:10" },
  { date: "09 Jun 2026", status: "Terlambat", note: "Masuk pukul 07:20" },
  { date: "08 Jun 2026", status: "Izin", note: "Cuti sakit" },
];

export const dashboardSummary = {
  totalStudents: 1248,
  attendanceRate: 92,
  lateCount: 34,
  pendingApproval: 18,
};
