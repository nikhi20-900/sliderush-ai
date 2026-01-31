"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useAuthStore } from "@/store/auth.store";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  React.useEffect(() => {
    if (!hasMounted) return;
    if (!user) {
      const next = encodeURIComponent(pathname ?? "/dashboard");
      router.replace(`/auth?next=${next}`);
    }
  }, [hasMounted, user, router, pathname]);

  if (!hasMounted) return null;
  if (!user) return null;
  return <>{children}</>;
}

