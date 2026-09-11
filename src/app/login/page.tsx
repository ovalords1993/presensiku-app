"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_USERS, ROUTE_BY_ROLE, Role, setStoredSession } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@presensiku.test");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const demoAccounts = useMemo(
    () =>
      DEMO_USERS.map((user) => ({
        email: user.email,
        label: `${user.name} (${user.role})`,
      })),
    []
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const demoUser = DEMO_USERS.find(
      (item) => item.email === email && item.password === password
    );

    if (demoUser) {
      setStoredSession({
        email: demoUser.email,
        name: demoUser.name,
        role: demoUser.role,
      });

      router.push(ROUTE_BY_ROLE[demoUser.role]);
      router.refresh();
      return;
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      setError("Email atau password salah. Gunakan akun demo yang tersedia.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        setError("Email atau password salah. Gunakan akun demo yang tersedia.");
        return;
      }

      const role = (data.user.user_metadata?.role as Role | undefined) ?? "murid";
      const sessionName =
        (data.user.user_metadata?.full_name as string | undefined) ??
        data.user.email ??
        "User";

      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          full_name: sessionName,
          email: data.user.email ?? email,
          role,
          tenant_id: "00000000-0000-0000-0000-000000000000",
        },
        { onConflict: "id" }
      );

      if (profileError) {
        console.warn("Profile sync failed:", profileError.message);
      }

      setStoredSession({
        email: data.user.email ?? email,
        name: sessionName,
        role,
      });

      router.push(ROUTE_BY_ROLE[role] ?? "/murid");
      router.refresh();
    } catch {
      setError("Login gagal. Periksa koneksi atau akun Anda.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-indigo-950/30">
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-between bg-gradient-to-br from-indigo-600 to-violet-700 p-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-100">Presensiku</p>
              <h1 className="mt-4 text-3xl font-bold">Selamat datang di platform presensi sekolah.</h1>
            </div>

            <div className="mt-8 space-y-3 text-sm text-indigo-50">
              <p>Gunakan akun demo berikut untuk mencoba role yang berbeda:</p>
              <ul className="space-y-2">
                {demoAccounts.map((account) => (
                  <li key={account.email} className="rounded-xl bg-white/10 px-3 py-2">
                    <span className="font-medium">{account.label}</span>
                    <div className="text-xs text-indigo-100">{account.email}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="mt-2 text-sm text-slate-400">
              Masuk untuk membuka dashboard sesuai role Anda.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                  placeholder="nama@sekolah.test"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                  placeholder="Masukkan password"
                  required
                />
              </div>

              {error ? (
                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-500 px-4 py-3 font-medium text-white transition hover:bg-indigo-400"
              >
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
