"use client";

import { formatCurrency } from "@/lib/format";
import type { CartItem } from "@/lib/types";

type CartTableProps = {
  items: CartItem[];
  onIncrement: (barcode: string) => void;
  onDecrement: (barcode: string) => void;
  onSetQuantity: (barcode: string, quantity: number) => void;
  onRemove: (barcode: string) => void;
};

export default function CartTable({
  items,
  onIncrement,
  onDecrement,
  onSetQuantity,
  onRemove
}: CartTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 p-6 text-center text-slate-500">
        No items in cart yet. Start scanning products.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-600">
            <th className="py-2">Item</th>
            <th className="py-2">Price</th>
            <th className="py-2">Qty</th>
            <th className="py-2">Line Total</th>
            <th className="py-2">Remove</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr className="border-b border-slate-100 align-middle" key={item.barcode}>
              <td className="py-2">
                <div className="font-medium">{item.name}</div>
                <div className="font-mono text-xs text-slate-500">{item.barcode}</div>
              </td>
              <td className="py-2">{formatCurrency(item.price)}</td>
              <td className="py-2">
                <div className="flex items-center gap-1">
                  <button
                    className="rounded border border-slate-300 px-2 py-1"
                    onClick={() => onDecrement(item.barcode)}
                    type="button"
                  >
                    -
                  </button>
                  <input
                    className="w-14 rounded border border-slate-300 px-2 py-1 text-center"
                    min={1}
                    onChange={(e) => {
                      const nextValue = Number(e.target.value);
                      if (Number.isNaN(nextValue)) return;
                      onSetQuantity(item.barcode, nextValue);
                    }}
                    type="number"
                    value={item.quantity}
                  />
                  <button
                    className="rounded border border-slate-300 px-2 py-1"
                    onClick={() => onIncrement(item.barcode)}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </td>
              <td className="py-2 font-medium">
                {formatCurrency(item.price * item.quantity)}
              </td>
              <td className="py-2">
                <button
                  className="rounded bg-rose-100 px-2 py-1 text-rose-700 hover:bg-rose-200"
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
