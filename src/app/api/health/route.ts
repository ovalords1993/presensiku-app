import { getSupabaseClient, getSupabaseServiceRoleClient } from "@/lib/supabase";

export async function GET() {
  const supabaseClient = getSupabaseClient();
  const serviceRoleClient = getSupabaseServiceRoleClient();

  return Response.json({
    ok: true,
    app: "presensiku-app",
    status: "ready",
    environment: {
      supabaseConfigured: Boolean(supabaseClient),
      serviceRoleConfigured: Boolean(serviceRoleClient),
      demoMode: !supabaseClient,
    },
    timestamp: new Date().toISOString(),
  });
}
