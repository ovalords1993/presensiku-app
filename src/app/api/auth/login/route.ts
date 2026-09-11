import { NextResponse } from "next/server";
import { getSupabaseClient, getSupabaseServiceRoleClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = getSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        {
          ok: false,
          message: "Supabase belum dikonfigurasi.",
        },
        { status: 503 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        {
          ok: false,
          message: error?.message ?? "Login gagal.",
        },
        { status: 401 }
      );
    }

    const role = (data.user.user_metadata?.role as string | undefined) ?? "murid";
    const fullName = (data.user.user_metadata?.full_name as string | undefined) ?? data.user.email ?? "User";

    const adminSupabase = getSupabaseServiceRoleClient();

    if (adminSupabase) {
      const { error: profileError } = await adminSupabase.from("profiles").upsert(
        {
          id: data.user.id,
          full_name: fullName,
          email: data.user.email ?? body.email,
          role,
          tenant_id: "00000000-0000-0000-0000-000000000000",
        },
        { onConflict: "id" }
      );

      if (profileError) {
        console.warn("Profile sync failed:", profileError.message);
      }
    }

    return NextResponse.json({
      ok: true,
      user: {
        email: data.user.email,
        name: fullName,
        role,
      },
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
