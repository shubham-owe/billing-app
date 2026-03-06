"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/common/AppShell";
import BillDetails from "@/components/bills/BillDetails";
import { getBillWithItems } from "@/lib/db";
import { useAppProfile } from "@/lib/hooks";
import type { BillWithItems } from "@/lib/types";

export default function BillDetailsPage() {
  const params = useParams<{ id: string }>();
  const profile = useAppProfile();
  const [data, setData] = useState<BillWithItems>();

  useEffect(() => {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return;
    void getBillWithItems(id).then(setData);
  }, [params.id]);

  return (
    <AppShell title="Bill Details">
      <div className="space-y-3">
        {!data ? <p>Loading bill...</p> : <BillDetails data={data} profile={profile} />}
        <div className="flex gap-2">
          <Link className="btn-primary" href={`/print/${params.id}`}>
            Print Bill
          </Link>
          <Link
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
            href="/bills"
          >
            Back
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
