import { NextResponse } from "next/server";
import { getSupabaseClient, getSupabaseServiceRoleClient } from "@/lib/supabase";

export async function POST() {
  const supabase = getSupabaseServiceRoleClient() ?? getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        ok: false,
        message: "Supabase belum dikonfigurasi.",
      },
      { status: 503 }
    );
  }

  const { data: existingClasses, error: classesError } = await supabase.from("classes").select("id").limit(1);

  if (classesError) {
    return NextResponse.json(
      {
        ok: false,
        message: classesError.message,
      },
      { status: 500 }
    );
  }

  if (existingClasses && existingClasses.length > 0) {
    return NextResponse.json({
      ok: true,
      message: "Seed data sudah tersedia.",
    });
  }

  const { error: classesInsertError } = await supabase.from("classes").insert([
    { name: "X-A", tenant_id: "00000000-0000-0000-0000-000000000000" },
    { name: "XI-B", tenant_id: "00000000-0000-0000-0000-000000000000" },
    { name: "XII-A", tenant_id: "00000000-0000-0000-0000-000000000000" },
  ]);

  if (classesInsertError) {
    return NextResponse.json(
      {
        ok: false,
        message: classesInsertError.message,
      },
      { status: 500 }
    );
  }

  const { data: classesData } = await supabase.from("classes").select("*");

  const seedStudents = [
    { name: "Murid A", nisn: "2026060156", class_name: "XI-B", wali: "Siti Rahma", status_today: "Hadir" },
    { name: "Alya Putri", nisn: "2026060157", class_name: "XII-A", wali: "Rahmat", status_today: "Hadir" },
    { name: "Budi Santoso", nisn: "2026060158", class_name: "XI-B", wali: "Nia", status_today: "Terlambat" },
  ];

  const { error: studentsError } = await supabase.from("students").insert(seedStudents);

  if (studentsError) {
    return NextResponse.json(
      {
        ok: false,
        message: studentsError.message,
      },
      { status: 500 }
    );
  }

  const { error: attendanceError } = await supabase.from("attendance_logs").insert([
    {
      name: "Alya Putri",
      class_name: "XII-A",
      check_in: "07:05",
      status: "Hadir",
      color: "emerald",
      notes: "Masuk pukul 07:05",
    },
    {
      name: "Budi Santoso",
      class_name: "XI-B",
      check_in: "07:12",
      status: "Terlambat",
      color: "amber",
      notes: "Masuk pukul 07:12",
    },
  ]);

  if (attendanceError) {
    return NextResponse.json(
      {
        ok: false,
        message: attendanceError.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Seed data berhasil dibuat.",
    classes: classesData,
  });
}
