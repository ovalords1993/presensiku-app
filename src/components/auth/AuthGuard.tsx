"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredSession, isRoleAllowed, Role, ROUTE_BY_ROLE } from "@/lib/auth";

export default function AuthGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: Role[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const session = getStoredSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && !isRoleAllowed(session.role, allowedRoles)) {
      router.replace(ROUTE_BY_ROLE[session.role]);
      return;
    }

    if (pathname === "/login") {
      router.replace(ROUTE_BY_ROLE[session.role]);
      return;
    }

    setIsReady(true);
  }, [allowedRoles, pathname, router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-sm text-slate-300">Memeriksa akses...</div>
      </div>
    );
  }

  return <>{children}</>;
}
