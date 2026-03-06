import { formatCurrency } from "@/lib/format";
import type { SavedBill } from "@/lib/types";

type ReceiptProps = {
  bill: SavedBill;
};

export default function Receipt({ bill }: ReceiptProps) {
  const createdAt = new Date(bill.meta.createdAt);
  const createdLabel = Number.isNaN(createdAt.getTime())
    ? bill.meta.createdAt
    : createdAt.toLocaleString();

  return (
    <div className="receipt w-full max-w-sm rounded-md border border-slate-300 bg-white p-4 font-mono text-sm shadow-sm">
      <div className="text-center">
        <h1 className="text-base font-bold">{bill.meta.storeName}</h1>
        <p className="mt-1 whitespace-pre-line text-xs">{bill.meta.storeAddress}</p>
        <p className="text-xs">Phone: {bill.meta.storePhone}</p>
      </div>

      <div className="my-3 border-t border-dashed border-slate-400 pt-2 text-xs">
        <p>Bill No: {bill.meta.billNumber}</p>
        <p>Date: {createdLabel}</p>
      </div>

      <div className="border-t border-dashed border-slate-400 pt-2">
        {bill.items.map((item) => (
          <div className="mb-2" key={item.barcode}>
            <div className="font-semibold">{item.name}</div>
            <div className="flex justify-between text-xs">
              <span>
                {item.quantity} x {formatCurrency(item.price)}
              </span>
              <span>{formatCurrency(item.quantity * item.price)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-dashed border-slate-400 pt-2 text-xs">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(bill.totals.subtotal)}</span>
        </div>

        {bill.meta.taxEnabled ? (
          <div className="mt-1 flex justify-between">
            <span>Tax ({bill.meta.taxPercent}%)</span>
            <span>{formatCurrency(bill.totals.taxAmount)}</span>
          </div>
        ) : null}

        <div className="mt-2 flex justify-between text-sm font-bold">
          <span>Total</span>
          <span>{formatCurrency(bill.totals.total)}</span>
        </div>
      </div>

      <p className="mt-4 text-center text-xs">Thank you for shopping with us.</p>
    </div>
  );
}
