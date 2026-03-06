"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/common/AppShell";
import ShopProfileForm from "@/components/onboarding/ShopProfileForm";
import { useAuthSession, useAppProfile } from "@/lib/hooks";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading } = useAuthSession();
  const profile = useAppProfile();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth");
  }, [loading, router, user]);

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl p-4">
        <div className="h-40 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      </main>
    );
  }

  if (!user) return null;

  return (
    <AppShell requireProfile={false} title="Onboarding">
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          Complete your shop details to start billing.
        </p>
        <ShopProfileForm
          defaultPhone={user.phoneNumber ?? ""}
          existing={profile}
          onSaved={() => router.replace("/dashboard")}
          submitLabel={profile ? "Update Profile" : "Complete Onboarding"}
        />
      </div>
    </AppShell>
  );
}
