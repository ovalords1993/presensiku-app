import AuthGuard from "@/components/auth/AuthGuard";

export default function MuridLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={["murid"]}>{children}</AuthGuard>;
}
