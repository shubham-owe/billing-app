"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Receipt from "@/components/Receipt";
import { readBillFromStorage } from "@/lib/storage";
import type { SavedBill } from "@/lib/types";

export default function PrintPage() {
  const [bill, setBill] = useState<SavedBill | null>(null);

  useEffect(() => {
    setBill(readBillFromStorage());
  }, []);

  useEffect(() => {
    if (!bill) return;
    const timeout = window.setTimeout(() => window.print(), 200);
    return () => window.clearTimeout(timeout);
  }, [bill]);

  if (!bill) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center p-4">
        <p className="mb-4 text-center text-slate-700">
          No saved bill found. Create a bill first.
        </p>
        <Link className="rounded-md bg-slate-900 px-4 py-2 text-white" href="/">
          Back to New Bill
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center p-4">
      <div className="no-print mb-4 flex gap-2">
        <button
          className="rounded-md bg-slate-900 px-4 py-2 text-white"
          onClick={() => window.print()}
          type="button"
        >
          Print
        </button>
        <Link className="rounded-md bg-slate-200 px-4 py-2 text-slate-900" href="/">
          Back
        </Link>
      </div>

      <Receipt bill={bill} />
    </main>
  );
}
