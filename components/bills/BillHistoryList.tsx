import { format } from "date-fns";
import CurrencyText from "@/components/common/CurrencyText";
import type { Bill } from "@/lib/types";

type BillHistoryListProps = {
  bills: Bill[];
  currency?: string;
  onOpen: (id: number) => void;
  onPrint: (id: number) => void;
};

export default function BillHistoryList({
  bills,
  currency,
  onOpen,
  onPrint
}: BillHistoryListProps) {
  return (
    <div className="space-y-3">
      {bills.map((bill) => (
        <div
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          key={bill.id}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold">{bill.billNumber}</p>
              <p className="text-sm text-slate-500">
                {format(new Date(bill.createdAt), "dd MMM yyyy, hh:mm a")}
              </p>
              <p className="text-sm text-slate-500">Items: {bill.itemCount}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                <CurrencyText currency={currency} paise={bill.totalPaise} />
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  className="rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-700"
                  onClick={() => onOpen(bill.id!)}
                  type="button"
                >
                  View
                </button>
                <button
                  className="rounded bg-slate-900 px-2 py-1 text-sm text-white"
                  onClick={() => onPrint(bill.id!)}
                  type="button"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
