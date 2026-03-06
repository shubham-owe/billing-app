"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import PhoneLoginForm from "@/components/auth/PhoneLoginForm";
import { useAuthSession } from "@/lib/hooks";
import { APP_NAME } from "@/lib/constants";
import { db } from "@/lib/dexie";

type Tab = "google" | "mobile";

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("google");
  const { user, loading } = useAuthSession();
  const profileCount = useLiveQuery(() => db.profile.count(), []);
  const profileKnown = profileCount !== undefined;
  const router = useRouter();

  useEffect(() => {
    if (loading || !user || !profileKnown) return;
    router.replace((profileCount ?? 0) > 0 ? "/dashboard" : "/onboarding");
  }, [loading, profileCount, profileKnown, router, user]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center p-4">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold">{APP_NAME}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Sign in to continue with your offline POS.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            className={`rounded-lg px-3 py-2 text-sm ${
              tab === "google"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
            onClick={() => setTab("google")}
            type="button"
          >
            Google
          </button>
          <button
            className={`rounded-lg px-3 py-2 text-sm ${
              tab === "mobile"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
            onClick={() => setTab("mobile")}
            type="button"
          >
            Mobile
          </button>
        </div>

        <div className="mt-4">
          {tab === "google" ? (
            <GoogleLoginButton onSuccess={() => router.replace("/onboarding")} />
          ) : (
            <PhoneLoginForm onSuccess={() => router.replace("/onboarding")} />
          )}
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Data is stored only on your device in IndexedDB.
        </p>
      </div>
    </main>
  );
}
