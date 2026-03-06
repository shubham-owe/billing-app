"use client";

import CurrencyText from "@/components/common/CurrencyText";
import type { CartItem } from "@/lib/types";

type BillCartProps = {
  items: CartItem[];
  currency?: string;
  onInc: (barcode: string) => void;
  onDec: (barcode: string) => void;
  onQty: (barcode: string, qty: number) => void;
  onRemove: (barcode: string) => void;
};

export default function BillCart({
  items,
  currency,
  onInc,
  onDec,
  onQty,
  onRemove
}: BillCartProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500 dark:border-slate-700">
        Cart is empty. Scan products to start bill.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-full text-sm">
        <thead className="border-b border-slate-200 dark:border-slate-800">
          <tr className="text-left">
            <th className="px-3 py-2">Item</th>
            <th className="px-3 py-2">Price</th>
            <th className="px-3 py-2">Qty</th>
            <th className="px-3 py-2">Total</th>
            <th className="px-3 py-2">Remove</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr className="border-b border-slate-100 dark:border-slate-800" key={item.barcode}>
              <td className="px-3 py-2">
                <p className="font-medium">{item.name}</p>
                <p className="font-mono text-xs text-slate-500">{item.barcode}</p>
              </td>
              <td className="px-3 py-2">
                <CurrencyText currency={currency} paise={item.unitPricePaise} />
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-1">
                  <button
                    className="rounded border border-slate-300 px-2 py-1 dark:border-slate-700"
                    onClick={() => onDec(item.barcode)}
                    type="button"
                  >
                    -
                  </button>
                  <input
                    className="w-14 rounded border border-slate-300 px-2 py-1 text-center dark:border-slate-700 dark:bg-slate-900"
                    min={1}
                    onChange={(e) => onQty(item.barcode, Number(e.target.value))}
                    type="number"
                    value={item.qty}
                  />
                  <button
                    className="rounded border border-slate-300 px-2 py-1 dark:border-slate-700"
                    onClick={() => onInc(item.barcode)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="px-3 py-2">
                <CurrencyText
                  currency={currency}
                  paise={item.unitPricePaise * item.qty}
                />
              </td>
              <td className="px-3 py-2">
                <button
                  className="rounded bg-rose-100 px-2 py-1 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
                  onClick={() => onRemove(item.barcode)}
                  type="button"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
