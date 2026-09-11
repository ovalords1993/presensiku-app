import { NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseServiceRoleClient();

    if (!supabase) {
      return NextResponse.json(
        {
          ok: false,
          message: "Supabase service role belum dikonfigurasi. Isi SUPABASE_SERVICE_ROLE_KEY untuk menyimpan presensi.",
        },
        { status: 503 }
      );
    }

    const insertPayload = {
      name: body.name ?? "Unknown",
      class_name: body.className ?? "-",
      check_in: body.checkIn ?? "-",
      status: body.status ?? "Hadir",
      color: body.color ?? "emerald",
      notes: body.notes ?? null,
      tenant_id: body.tenantId ?? "00000000-0000-0000-0000-000000000000",
    };

    const { error } = await supabase.from("attendance_logs").insert(insertPayload);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Presensi berhasil disimpan ke Supabase",
      payload: insertPayload,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid request body",
      },
      { status: 400 }
    );
  }
}
