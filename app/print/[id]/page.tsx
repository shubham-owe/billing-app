"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CurrencyText from "@/components/common/CurrencyText";
import { getBillWithItems } from "@/lib/db";
import { useAppProfile } from "@/lib/hooks";
import type { BillWithItems } from "@/lib/types";

export default function PrintBillPage() {
  const params = useParams<{ id: string }>();
  const profile = useAppProfile();
  const [data, setData] = useState<BillWithItems>();

  useEffect(() => {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return;
    void getBillWithItems(id).then(setData);
  }, [params.id]);

  useEffect(() => {
    if (!data) return;
    const timeout = setTimeout(() => window.print(), 250);
    return () => clearTimeout(timeout);
  }, [data]);

  if (!data) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md items-center justify-center p-4">
        <p>Loading receipt...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-4">
      <div className="no-print mb-3 flex gap-2">
        <button className="btn-primary" onClick={() => window.print()} type="button">
          Print
        </button>
        <Link
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
          href={`/bills/${params.id}`}
        >
          Back
        </Link>
      </div>

      <section className="receipt mx-auto w-full max-w-sm rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm shadow-sm">
        {profile?.shopLogo ? (
          <img
            alt={profile.shopName}
            className="mx-auto mb-2 h-14 w-14 rounded object-cover"
            src={profile.shopLogo}
          />
        ) : null}
        <h1 className="text-center text-base font-bold">{profile?.shopName}</h1>
        <p className="whitespace-pre-line text-center text-xs">{profile?.shopAddress}</p>
        {profile?.gstNumber ? <p className="text-center text-xs">GST: {profile.gstNumber}</p> : null}
        <p className="text-center text-xs">Phone: {profile?.phoneNumber}</p>

        <div className="my-3 border-t border-dashed border-slate-400 pt-2 text-xs">
          <p>Bill: {data.bill.billNumber}</p>
          <p>Date: {format(new Date(data.bill.createdAt), "dd/MM/yyyy hh:mm a")}</p>
          {data.bill.customerName ? <p>Customer: {data.bill.customerName}</p> : null}
          {data.bill.customerPhone ? <p>Phone: {data.bill.customerPhone}</p> : null}
        </div>

        {data.items.map((item) => (
          <div className="mb-2" key={item.id}>
            <div className="font-semibold">{item.nameSnapshot}</div>
            <div className="flex justify-between text-xs">
              <span>
                {item.qty} x <CurrencyText currency={profile?.currency} paise={item.unitPricePaise} />
              </span>
              <span>
                <CurrencyText currency={profile?.currency} paise={item.lineTotalPaise} />
              </span>
            </div>
          </div>
        ))}

        <div className="mt-3 border-t border-dashed border-slate-400 pt-2 text-xs">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <CurrencyText currency={profile?.currency} paise={data.bill.subtotalPaise} />
          </div>
          <div className="flex justify-between">
            <span>Tax ({data.bill.taxPercent}%)</span>
            <CurrencyText currency={profile?.currency} paise={data.bill.taxAmountPaise} />
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span>Total</span>
            <CurrencyText currency={profile?.currency} paise={data.bill.totalPaise} />
          </div>
        </div>

        {profile?.receiptFooterMessage ? (
          <p className="mt-4 text-center text-xs">{profile.receiptFooterMessage}</p>
        ) : null}
      </section>
    </main>
  );
}
