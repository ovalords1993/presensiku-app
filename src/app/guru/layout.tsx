import AuthGuard from "@/components/auth/AuthGuard";

export default function GuruLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={["guru"]}>{children}</AuthGuard>;
}
