"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/common/AppShell";
import DashboardActionGrid from "@/components/dashboard/DashboardActionGrid";
import ShopHeaderCard from "@/components/dashboard/ShopHeaderCard";
import { getStats } from "@/lib/db";
import { useAppProfile } from "@/lib/hooks";

export default function DashboardPage() {
  const profile = useAppProfile();
  const [stats, setStats] = useState({ productsCount: 0, billsCount: 0 });

  useEffect(() => {
    void getStats().then(setStats);
  }, [profile]);

  return (
    <AppShell title="Dashboard">
      {profile ? (
        <div className="space-y-4">
          <ShopHeaderCard
            billsCount={stats.billsCount}
            productsCount={stats.productsCount}
            profile={profile}
          />
          <DashboardActionGrid />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          Loading profile...
        </div>
      )}
    </AppShell>
  );
}
