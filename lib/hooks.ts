"use client";

import { useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import { db } from "@/lib/dexie";
import { saveAuthMeta } from "@/lib/db";
import { subscribeAuthState } from "@/lib/auth";

export function useAuthSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (nextUser) {
        await saveAuthMeta({
          uid: nextUser.uid,
          displayName: nextUser.displayName,
          email: nextUser.email,
          phoneNumber: nextUser.phoneNumber
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

export function useAppProfile() {
  return useLiveQuery(() => db.profile.toCollection().first(), []);
}

export function useRouteGuards(options: {
  requireAuth?: boolean;
  requireProfile?: boolean;
  redirectAuthedTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuthSession();
  const profileCount = useLiveQuery(() => db.profile.count(), []);
  const profileKnown = profileCount !== undefined;
  const profileExists = (profileCount ?? 0) > 0;

  useEffect(() => {
    if (loading) return;

    if (options.requireAuth && !user) {
      router.replace("/auth");
      return;
    }

    if (options.redirectAuthedTo && user) {
      router.replace(options.redirectAuthedTo);
      return;
    }

    if (options.requireProfile && user && profileKnown && !profileExists) {
      if (pathname !== "/onboarding") router.replace("/onboarding");
      return;
    }

    if (pathname === "/onboarding" && user && profileKnown && profileExists) {
      router.replace("/dashboard");
    }
  }, [
    loading,
    options.redirectAuthedTo,
    options.requireAuth,
    options.requireProfile,
    pathname,
    profileKnown,
    profileExists,
    router,
    user
  ]);

  const resolved = useMemo(() => {
    if (loading) return false;
    if (options.requireAuth && !user) return false;
    if (options.requireProfile && user && profileKnown && !profileExists) return false;
    return true;
  }, [loading, options.requireAuth, options.requireProfile, profileExists, profileKnown, user]);

  return { user, loading, ready: resolved };
}
