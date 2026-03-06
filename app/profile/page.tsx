"use client";

import Link from "next/link";
import AppShell from "@/components/common/AppShell";
import ShopProfileForm from "@/components/onboarding/ShopProfileForm";
import { useAppProfile } from "@/lib/hooks";

export default function ProfilePage() {
  const profile = useAppProfile();

  return (
    <AppShell title="My Profile">
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          Your business data is stored on this device. Export backups regularly to avoid data loss if browser
          storage is cleared.
          <Link className="ml-2 underline" href="/backup">
            Open Backup / Restore
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          {profile ? (
            <ShopProfileForm existing={profile} onSaved={() => {}} submitLabel="Update Profile" />
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
