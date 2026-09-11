const roles = [
  {
    name: "Super Admin",
    href: "/super-admin",
    description: "Dashboard platform SaaS, tenant, dan pemantauan global.",
  },
  {
    name: "Admin Sekolah",
    href: "/admin",
    description: "Kelola sekolah, kelas, presensi, dan izin siswa.",
  },
  {
    name: "Guru",
    href: "/guru",
    description: "Lihat jadwal, presensi kelas, dan riwayat mengajar.",
  },
  {
    name: "Murid / Orang Tua",
    href: "/murid",
    description: "Pantau kehadiran, pengumuman, dan data presensi harian.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4 rounded-full border border-slate-800 bg-slate-900/70 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 font-bold text-sm text-white">
              P
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-indigo-300">Presensiku</p>
              <p className="text-sm text-slate-300">School Attendance SaaS</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/presensi"
              className="rounded-full border border-indigo-500 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-indigo-200 transition hover:bg-indigo-500/20"
            >
              Presensi
            </a>
            <a
              href="/admin"
              className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-400"
            >
              Masuk Dashboard
            </a>
          </div>
        </header>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
              Multi-Tenant Attendance Platform
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Presensi sekolah modern untuk seluruh peran.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Proyek ini memulai struktur inti aplikasi Presensiku: landing page,
              dashboard per role, dan alur navigasi utama sesuai konsep README.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/presensi"
                className="rounded-xl bg-indigo-500 px-5 py-3 font-medium text-white transition hover:bg-indigo-400"
              >
                Coba Presensi
              </a>
              <a
                href="/admin"
                className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-medium text-slate-200 transition hover:border-slate-500"
              >
                Lihat Admin Demo
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-indigo-950/30">
            <h2 className="text-xl font-semibold">Fitur inti</h2>
            <ul className="mt-5 space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Multi-tenant SaaS routing per sekolah.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Presensi dengan selfie, QR, dan geofencing.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                Dashboard per role dan permission matrix.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                PWA-ready dan siap dikembangkan lebih lanjut.
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Pilih role utama</h2>
            <span className="text-sm text-slate-400">Struktur awal aplikasi</span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {roles.map((role) => (
              <a
                key={role.name}
                href={role.href}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-indigo-500 hover:bg-slate-900/95"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-lg font-semibold text-indigo-300">
                  {role.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-white">{role.name}</h3>
                <p className="mt-2 text-sm text-slate-300">{role.description}</p>
                <div className="mt-5 text-sm font-medium text-indigo-300 group-hover:text-indigo-200">
                  Buka dashboard →
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
