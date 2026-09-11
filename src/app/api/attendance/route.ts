import { NextResponse } from "next/server";
import { getAttendanceApiData } from "@/lib/data-source";

export async function GET() {
  const data = await getAttendanceApiData();

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      ok: true,
      message: "Presensi berhasil disimpan",
      payload: body,
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
