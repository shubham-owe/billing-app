"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import AppShell from "@/components/common/AppShell";
import EmptyState from "@/components/common/EmptyState";
import BillHistoryList from "@/components/bills/BillHistoryList";
import { db } from "@/lib/dexie";
import { useAppProfile } from "@/lib/hooks";

export default function BillsPage() {
  const router = useRouter();
  const profile = useAppProfile();
  const bills = useLiveQuery(() => db.bills.orderBy("createdAt").reverse().toArray(), []) ?? [];
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return bills.filter((bill) => {
      const matchQuery =
        !lower ||
        bill.billNumber.toLowerCase().includes(lower) ||
        bill.createdAt.toLowerCase().includes(lower);
      const matchDate = !date || bill.createdAt.startsWith(date);
      return matchQuery && matchDate;
    });
  }, [bills, date, query]);

  return (
    <AppShell title="Bill History">
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-2 md:grid-cols-3">
            <input
              className="input md:col-span-2"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bill number or date"
              value={query}
            />
            <input className="input" onChange={(e) => setDate(e.target.value)} type="date" value={date} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No bills found" description="Your saved bills will appear here." />
        ) : (
          <BillHistoryList
            bills={filtered}
            currency={profile?.currency}
            onOpen={(id) => router.push(`/bills/${id}`)}
            onPrint={(id) => router.push(`/print/${id}`)}
          />
        )}
      </div>
    </AppShell>
  );
}
