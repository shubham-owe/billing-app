"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { useAuthSession } from "@/lib/hooks";
import { db } from "@/lib/dexie";

export default function RootPage() {
  const router = useRouter();
  const { user, loading } = useAuthSession();
  const profileCount = useLiveQuery(() => db.profile.count(), []);
  const profileKnown = profileCount !== undefined;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    if (!profileKnown) return;
    router.replace((profileCount ?? 0) > 0 ? "/dashboard" : "/onboarding");
  }, [loading, profileCount, profileKnown, router, user]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center justify-center p-4">
      <p className="text-sm text-slate-500">Loading app...</p>
    </main>
  );
}
