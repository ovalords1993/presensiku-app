import { attendanceRows, dashboardSummary, studentProfile, attendanceHistory, recentActivities, classSummary } from "@/lib/mock-data";
import { getSupabaseServiceRoleClient } from "@/lib/supabase";

function getFallbackAttendanceData() {
  return {
    summary: dashboardSummary,
    attendanceRows,
    recentActivities,
    classSummary,
    studentProfile,
    attendanceHistory,
  };
}

function getFallbackStudentData() {
  return {
    students: [
      {
        id: 1,
        ...studentProfile,
      },
    ],
    attendanceHistory,
  };
}

function toDateLabel(value?: string) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function normalizeAttendanceRows(data: any[] = []) {
  return data.map((item) => ({
    name: item.name ?? "Unknown",
    className: item.class_name ?? "-",
    checkIn: item.check_in ?? "-",
    status: item.status ?? "Hadir",
    color: item.color ?? "emerald",
    createdAt: item.created_at,
    notes: item.notes ?? "",
  }));
}

function normalizeStudents(data: any[] = []) {
  return data.map((item, index) => ({
    id: item.id ?? index + 1,
    name: item.name ?? studentProfile.name,
    nisn: item.nisn ?? studentProfile.nisn,
    className: item.class_name ?? studentProfile.className,
    wali: item.wali ?? studentProfile.wali,
    statusToday: item.status_today ?? studentProfile.statusToday,
  }));
}

export async function getAttendanceApiData() {
  const supabase = getSupabaseServiceRoleClient();

  if (!supabase) {
    return {
      ...getFallbackAttendanceData(),
      dataSource: "mock",
    };
  }

  try {
    const [attendanceResult, studentsResult] = await Promise.all([
      supabase.from("attendance_logs").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("students").select("*").limit(50),
    ]);

    const attendanceData = attendanceResult.data ?? [];
    const studentsData = studentsResult.data ?? [];

    if (!attendanceData.length && !studentsData.length) {
      return {
        ...getFallbackAttendanceData(),
        dataSource: "mock",
      };
    }

    const normalizedRows = normalizeAttendanceRows(attendanceData);
    const totalStudents = studentsData.length || normalizedRows.length || dashboardSummary.totalStudents;

    const presentCount = normalizedRows.filter((item) => item.status === "Hadir" || item.status === "Pulang").length;
    const lateCount = normalizedRows.filter((item) => item.status === "Terlambat").length;
    const pendingApproval = normalizedRows.filter((item) => item.status === "Izin").length;

    const summary = {
      totalStudents,
      attendanceRate: normalizedRows.length ? Math.round((presentCount / normalizedRows.length) * 100) : dashboardSummary.attendanceRate,
      lateCount,
      pendingApproval,
    };

    const classByName = new Map<string, { total: number; present: number }>();

    normalizedRows.forEach((row) => {
      if (!row.className || row.className === "-") {
        return;
      }

      const current = classByName.get(row.className) ?? { total: 0, present: 0 };
      current.total += 1;

      if (row.status === "Hadir" || row.status === "Pulang") {
        current.present += 1;
      }

      classByName.set(row.className, current);
    });

    const classSummary = Array.from(classByName.entries()).map(([label, info], index) => ({
      label,
      percent: info.total ? Math.round((info.present / info.total) * 100) : 0,
      color: ["emerald", "sky", "violet"][index % 3],
    }));

    const recentActivities = normalizedRows.slice(0, 3).map((item) => ({
      actor: item.name,
      action:
        item.status === "Izin"
          ? "mengajukan izin sakit."
          : item.status === "Terlambat"
            ? "tercatat terlambat pada presensi hari ini."
            : "melakukan presensi masuk.",
    }));

    const pendingApprovals = normalizedRows
      .filter((item) => item.status === "Izin")
      .slice(0, 5)
      .map((item) => ({
        id: `${item.name}-${item.createdAt ?? item.checkIn}`,
        name: item.name,
        className: item.className,
        reason: item.notes || "Izin tidak terlapor dengan alasan tertentu.",
        requestedAt: toDateLabel(item.createdAt),
      }));

    const attendanceHistory = normalizedRows.slice(0, 4).map((item) => ({
      date: toDateLabel(item.createdAt),
      status: item.status,
      note: item.notes || `Masuk pukul ${item.checkIn}`,
    }));

    const firstStudent = normalizeStudents(studentsData)[0] ?? studentProfile;

    return {
      summary,
      attendanceRows: normalizedRows,
      recentActivities,
      classSummary: classSummary.length ? classSummary : classSummary,
      studentProfile: firstStudent,
      attendanceHistory,
      pendingApprovals,
      dataSource: "supabase",
    };
  } catch {
    return {
      ...getFallbackAttendanceData(),
      dataSource: "mock",
    };
  }
}

export async function getStudentApiData() {
  const supabase = getSupabaseServiceRoleClient();

  if (!supabase) {
    return {
      ...getFallbackStudentData(),
      dataSource: "mock",
    };
  }

  try {
    const [studentsResult, attendanceResult] = await Promise.all([
      supabase.from("students").select("*").limit(50),
      supabase.from("attendance_logs").select("*").order("created_at", { ascending: false }).limit(50),
    ]);

    const studentsData = studentsResult.data ?? [];
    const attendanceData = attendanceResult.data ?? [];

    if (!studentsData.length && !attendanceData.length) {
      return {
        ...getFallbackStudentData(),
        dataSource: "mock",
      };
    }

    const normalizedStudents = normalizeStudents(studentsData);
    const normalizedAttendance = normalizeAttendanceRows(attendanceData);

    const attendanceHistory = normalizedAttendance.slice(0, 4).map((item) => ({
      date: toDateLabel(item.createdAt),
      status: item.status,
      note: item.notes || `Masuk pukul ${item.checkIn}`,
    }));

    const studentProfileData = normalizedStudents[0] ?? {
      id: 1,
      ...studentProfile,
    };

    return {
      students: normalizedStudents.length ? normalizedStudents : [studentProfileData],
      attendanceHistory,
      dataSource: "supabase",
    };
  } catch {
    return {
      ...getFallbackStudentData(),
      dataSource: "mock",
    };
  }
}
