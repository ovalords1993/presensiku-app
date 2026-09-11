import AuthGuard from "@/components/auth/AuthGuard";

export default function PresensiLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
